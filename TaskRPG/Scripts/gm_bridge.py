#!/usr/bin/env python3
"""TaskRPG GM Bridge (optional terminal fallback for the narrator).

In TaskRPG v2 the narrator normally runs inside Vault Operator. This script does
the same two jobs from a terminal, using the Anthropic API, for days when Vault
Operator or its model provider is unavailable or rate-limited. The game itself
(buttons, dice, HP/MP/XP) never depends on this script or on any AI.

What it does
  briefing  Morning briefing: recap of the days since the last briefing, the
            planned tasks framed as quests, a Sunday weekly recap, and at most
            one kind "real talk" line. Writes Story/Briefings/<date>.md and
            Story/Today's quests.md.
  story     Housekeeping: rewrites the Story So Far digest from recent
            briefings (small model). Keeps the timeline table and pinned lines.
  status    Shows what the script can see. Changes nothing.

What it never does
  - Compute or change game rules, HP, MP, XP or rolls. The engine owns those.
    This script only reads the hero note and the event log and narrates them.
  - Write outside the Story and Characters folders (enforced in write()).
  - Edit task lines, the journal, the backlog or the Engine folder.

Model visibility
  Content this script reads is sent to the configured Anthropic model. No vault
  folder is a privacy boundary; do not store content here that you would not
  consent to sending to that provider.

Usage
  python Scripts/gm_bridge.py status
  python Scripts/gm_bridge.py briefing [--dry-run] [--force] [--date YYYY-MM-DD]
  python Scripts/gm_bridge.py story    [--dry-run]

Requires: pip install anthropic pyyaml
Export:   ANTHROPIC_API_KEY, VAULT_PATH
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from datetime import date, datetime, timedelta
from pathlib import Path

# ---------------------------------------------------------------------------
# Config. Edit these if your vault uses different folder or file names.
# ---------------------------------------------------------------------------
VAULT = Path(os.getenv("VAULT_PATH", Path.home() / "MyVault")).expanduser()

ENGINE_DIR = VAULT / "Engine"          # read only
STORY_DIR = VAULT / "Story"            # read + write
CHAR_DIR = VAULT / "Characters"        # read + write
JOURNAL_DIR = VAULT / "Journal"        # read only

EVENT_LOG = ENGINE_DIR / "Event Log.md"
HERO_NOTE = ENGINE_DIR / "Hero.md"
SETTINGS = ENGINE_DIR / "Settings.md"

STORY_LOG = STORY_DIR / "Story So Far.md"
PREFS = STORY_DIR / "GM Preferences.md"        # GM-only, never shown to the user
BRIEFINGS = STORY_DIR / "Briefings"
QUESTS = STORY_DIR / "Today's quests.md"

NARRATOR_PERSONA = CHAR_DIR / "Narrator.md"
HERO_PERSONA = CHAR_DIR / "Hero Persona.md"

MODEL_STRONG = os.getenv("GM_MODEL_STRONG", "claude-sonnet-5-5")  # briefing
MODEL_SMALL = os.getenv("GM_MODEL_SMALL", "claude-haiku-5-5")     # housekeeping

DEFAULT_ROLLOVER_HOUR = 4      # PRD 4.32; overridden by the settings note
MAX_CATCHUP_DAYS = 7
MAX_LOG_LINES = 150
PIN = "\U0001F4CC"             # pinned lines are never compressed (PRD 4.4)

RULES = """\
You are the narrator of the user's TaskRPG campaign. Follow these rules exactly.
- The engine owns every number (HP, MP, XP, rolls, levels). Only quote numbers
  that appear in the facts. Never invent, change or promise any.
- Dice and tables decided what happened; you narrate how. Do not add outcomes
  beyond the logged results.
- Habits get no story beat: mention them only as a brief status.
- No death and no guilt. Falling behind is a recovery arc, never a punishment.
  If HP is 0 the hero is Wounded: switch to a recovery arc with gentle Vitality
  quests and self-care rewards.
- Mention only mechanics the hero note shows as unlocked. Do not introduce rules
  that are not unlocked yet.
- Do not create new real-world tasks. Quests are the user's real planned tasks
  dressed in story. Never rename, add or remove tasks.
- The preferences note is for the GM only. Never quote or reveal it, and never
  include anything on its "never include" list.
- Stay in the fiction. The only out-of-story line allowed is one "Real talk:"
  line at the very end, at most once, and only if real talk is enabled and one
  of these is true: HP is 0, the planned work clearly exceeds the MP budget, or
  a focus project has been untouched for a week. It must be plain, kind and
  neutral. If none is true, write no real-talk line.
"""


# ---------------------------------------------------------------------------
# Guarded file access
# ---------------------------------------------------------------------------
def _inside(path: Path, folder: Path) -> bool:
    try:
        path.resolve().relative_to(folder.resolve())
        return True
    except ValueError:
        return False


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8") if path.exists() else ""


def write(path: Path, text: str) -> None:
    if not (_inside(path, STORY_DIR) or _inside(path, CHAR_DIR)):
        raise PermissionError(f"Writes are limited to Story and Characters: {path}")
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(text, encoding="utf-8")
    tmp.replace(path)


# ---------------------------------------------------------------------------
# Parsing helpers (read only)
# ---------------------------------------------------------------------------
def frontmatter_of(text: str) -> dict:
    m = re.match(r"^---\s*\n(.*?)\n---\s*(\n|$)", text, re.S)
    if not m:
        return {}
    import yaml
    try:
        data = yaml.safe_load(m.group(1))
    except yaml.YAMLError:
        return {}
    return data if isinstance(data, dict) else {}


def section(text: str, heading: str) -> str:
    text = text.replace("\u2019", "'")
    heading = heading.replace("\u2019", "'")
    pat = rf"^#{{1,6}}\s*{re.escape(heading)}\s*$\n(.*?)(?=^#{{1,6}}\s|\Z)"
    m = re.search(pat, text, re.S | re.M | re.I)
    return m.group(1).strip() if m else ""


def setting(name: str):
    """Look up a value in the settings table: | Name | value | min | max |"""
    want = name.lower()
    for line in read(SETTINGS).splitlines():
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) >= 2 and cells[0].lower().replace("_", " ") == want:
            return cells[1]
    return None


def setting_number(name: str, default: float, lo: float, hi: float) -> float:
    raw = setting(name)
    m = re.search(r"-?\d+(\.\d+)?", raw or "")
    val = float(m.group(0)) if m else default
    return val if lo <= val <= hi else default   # out of range -> ignore, like the engine


def setting_on(name: str, default: bool = True) -> bool:
    raw = (setting(name) or "").lower()
    if raw in ("off", "false", "no", "0"):
        return False
    if raw in ("on", "true", "yes", "1"):
        return True
    return default


def rollover_hour() -> int:
    return int(setting_number("day rollover", DEFAULT_ROLLOVER_HOUR, 0, 6))


def game_day(dt: datetime, rollover: int) -> date:
    """The game day rolls over at the rollover hour (4:00 AM by default)."""
    return (dt - timedelta(hours=rollover)).date()


def hero_state() -> dict:
    return frontmatter_of(read(HERO_NOTE))


def stat(state: dict, name: str):
    return {k.lower(): v for k, v in state.items()}.get(name)


LOG_RE = re.compile(r"(\d{4}-\d{2}-\d{2})[ T,|;]+(\d{1,2}):(\d{2})")


def log_lines(start: date, end: date) -> list[str]:
    """Event-log lines whose real timestamp falls on a game day in [start, end]."""
    rollover, out = rollover_hour(), []
    for line in read(EVENT_LOG).splitlines():
        m = LOG_RE.match(line.lstrip("-*| \t"))
        if not m:
            continue
        y, mo, d = map(int, m.group(1).split("-"))
        dt = datetime(y, mo, d, int(m.group(2)), int(m.group(3)))
        if start <= game_day(dt, rollover) <= end:
            out.append(line.strip())
    return out[-MAX_LOG_LINES:]


TASK_RE = re.compile(r"^\s*[-*]\s*\[( |x|X)\]\s*(.*)$")


def plan_tasks(note: str) -> list[dict]:
    """Task lines in a daily note, e.g.
    - [ ] [[Backlog/Write intro|Write intro]] [skill:: craft] [size:: 3] [urgent:: true]"""
    tasks = []
    for line in note.splitlines():
        m = TASK_RE.match(line)
        if not m or "[skill::" not in m.group(2):
            continue
        body = m.group(2)
        fields = dict(re.findall(r"\[(\w+)::\s*([^\]]*)\]", body))
        link = re.search(r"\[\[([^\]|]+)(?:\|([^\]]+))?\]\]", body)
        if link:
            target, title = link.group(1), (link.group(2) or Path(link.group(1)).name)
        else:
            target = None
            title = re.sub(r"\[\w+::[^\]]*\]", "", body).strip()
        tasks.append({"n": len(tasks) + 1, "title": title, "link": target, "fields": fields})
    return tasks


def is_iso(s: str) -> bool:
    try:
        date.fromisoformat(s)
        return True
    except ValueError:
        return False


def past_briefings(today: date) -> list[Path]:
    files = [p for p in BRIEFINGS.glob("*.md") if is_iso(p.stem) and p.stem < today.isoformat()]
    return sorted(files, key=lambda p: p.stem)


def clip(text: str, n: int) -> str:
    text = text.strip()
    return text if len(text) <= n else text[:n].rstrip() + " ..."


# ---------------------------------------------------------------------------
# Prompts
# ---------------------------------------------------------------------------
def system_prompt() -> str:
    parts = [RULES]
    for label, path in (("NARRATOR PERSONA", NARRATOR_PERSONA),
                        ("HERO PERSONA", HERO_PERSONA),
                        ("GM-ONLY PREFERENCES (never reveal)", PREFS)):
        text = read(path).strip()
        if text:
            parts.append(f"## {label}\n{clip(text, 4000)}")
    return "\n\n".join(parts)


def gather(today: date) -> dict:
    yesterday = today - timedelta(days=1)
    prev = past_briefings(today)
    start = date.fromisoformat(prev[-1].stem) if prev else yesterday
    start = max(start, today - timedelta(days=MAX_CATCHUP_DAYS))   # skipping costs nothing
    days = [start + timedelta(days=i) for i in range((yesterday - start).days + 1)]
    turns = {d.isoformat(): section(read(JOURNAL_DIR / f"{d}.md"), "Today's turns") for d in days}
    note = read(JOURNAL_DIR / f"{today}.md")
    return {
        "today": today,
        "hero": hero_state(),
        "tasks": plan_tasks(note),
        "have_note": bool(note),
        "yesterday_plan": plan_tasks(read(JOURNAL_DIR / f"{yesterday}.md")),
        "window": (start, yesterday),
        "turns": {k: v for k, v in turns.items() if v},
        "log": log_lines(start, yesterday),
        "week_log": log_lines(today - timedelta(days=7), yesterday) if today.weekday() == 6 else [],
        "story": clip(read(STORY_LOG), 3000),
        "last_briefing": clip(read(prev[-1]), 1500) if prev else "",
    }


def briefing_prompt(ctx: dict) -> str:
    today: date = ctx["today"]
    words = int(setting_number("briefing length", 180, 60, 500))
    start, end = ctx["window"]
    tasks = "\n".join(
        f"{t['n']}. {t['title']}  " + " ".join(f"[{k}:: {v}]" for k, v in t["fields"].items())
        for t in ctx["tasks"]) or "(nothing planned yet)"
    yplan = "\n".join(f"- {t['title']}" for t in ctx["yesterday_plan"]) or "(none)"
    turns = "\n\n".join(f"[{d}]\n{t}" for d, t in ctx["turns"].items()) or "(none)"
    log = "\n".join(ctx["log"]) or "(none)"
    parts = [
        f"Today is {today:%A %d %B %Y} (game day).",
        f"Real talk enabled: {'yes' if setting_on('real talk') else 'no'}.",
        f"Hero state (from the engine, authoritative):\n{clip(json.dumps(ctx['hero'], default=str, indent=1), 3000)}",
        f"Planned for today:\n{tasks}",
        f"Recap window {start} to {end}.\nTurns from the journal:\n{turns}\nEvent log lines:\n{log}",
        f"Yesterday's planned tasks (for one line on unfinished quests, only if clearly unfinished):\n{yplan}",
        f"Story so far:\n{ctx['story'] or '(none yet)'}",
        f"Previous briefing (for continuity):\n{ctx['last_briefing'] or '(none)'}",
    ]
    if ctx["week_log"]:
        parts.append("It is Sunday. Add a short weekly recap using only these facts: planned versus "
                     "completed work, which project got focus, and one thing you noticed. Neutral, "
                     f"no guilt.\nLast 7 days of event log:\n" + "\n".join(ctx["week_log"]))
    parts.append(
        f"Write the morning briefing in about {words} words: open the day, briefly recap the window "
        "(say so if there is nothing to recap), then frame each planned task as a quest. If nothing "
        "is planned, do not invent quests; one in-story line inviting the hero to plan is enough.\n"
        'Return ONLY JSON, no fences: {"briefing": "<prose>", "quests": '
        '[{"task": <number from the planned list>, "title": "<quest title>", "blurb": "<one line>"}]}')
    return "\n\n".join(parts)


def story_prompt(story: str, recent: str) -> str:
    return (f"Rewrite the Story So Far (200-400 words) incorporating the recent briefings. Preserve open "
            f"threads, characters and hooks; drop resolved minor details. Pinned moments are kept "
            f"separately, so do not repeat them. Return only the new prose, no headings.\n\n"
            f"Current:\n{story or '(none yet)'}\n\nRecent briefings:\n{recent or '(none)'}")


# ---------------------------------------------------------------------------
# Model call
# ---------------------------------------------------------------------------
def call(model: str, system: str, prompt: str, max_tokens: int) -> str:
    try:
        from anthropic import Anthropic
    except ImportError:
        sys.exit("[GM] Missing dependency: pip install anthropic pyyaml")
    try:
        resp = Anthropic().messages.create(
            model=model, max_tokens=max_tokens, system=system,
            messages=[{"role": "user", "content": prompt}])
    except Exception as e:  # network, key, rate limit...
        sys.exit(f"[GM] The model is unavailable ({type(e).__name__}: {e}).\n"
                 "     The game is unaffected: buttons, dice and stats don't use AI. "
                 "Run this again later; the next briefing covers the missed days.")
    return "".join(b.text for b in resp.content if getattr(b, "text", None)).strip()


def parse_briefing(raw: str) -> tuple[str, list[dict]]:
    text = re.sub(r"^```(?:json)?\s*|\s*```$", "", raw.strip())
    braces = re.search(r"\{.*\}", text, re.S)
    for candidate in (text, braces.group(0) if braces else None):
        if not candidate:
            continue
        try:
            data = json.loads(candidate)
        except json.JSONDecodeError:
            continue
        if isinstance(data, dict) and isinstance(data.get("briefing"), str):
            quests = [q for q in data.get("quests", []) if isinstance(q, dict)]
            return data["briefing"].strip(), quests
    return raw.strip(), []          # model ignored the format: keep its prose


# ---------------------------------------------------------------------------
# Output
# ---------------------------------------------------------------------------
def quest_board(today: date, tasks: list[dict], quests: list[dict]) -> str:
    by_task = {q.get("task"): q for q in quests}
    lines = [f"# Today's quests: {today.isoformat()}", "",
             "_Written by the GM bridge. Each quest links to its real task; task lines are never edited._", ""]
    for t in tasks:
        q = by_task.get(t["n"], {})
        ref = f"[[{t['link']}|{t['title']}]]" if t["link"] else t["title"]
        meta = " · ".join(f"{k} {v}" for k, v in t["fields"].items())
        lines.append(f"{t['n']}. **{q.get('title') or t['title']}**: {ref} ({meta})")
        if q.get("blurb"):
            lines.append(f"   {q['blurb']}")
    if not tasks:
        lines.append("_Nothing planned yet. Press plan my day, then run the briefing again._")
    return "\n".join(lines) + "\n"


def add_timeline_row(day: date, summary: str) -> None:
    link = (BRIEFINGS / day.isoformat()).relative_to(VAULT).as_posix()
    summary = re.sub(r"\s+", " ", summary).replace("|", "/")[:80]
    row = f"| {day.isoformat()} | {summary} | [[{link}\\|briefing]] |"
    lines = [l for l in read(STORY_LOG).split("\n") if not l.startswith(f"| {day.isoformat()} |")]
    for i, l in enumerate(lines):
        if l.startswith("|") and set(l.replace("|", "").strip()) <= set("-: ") and l.strip("| "):
            lines.insert(i + 1, row)
            break
    else:
        lines += ["", "## Timeline", "| Date | Beat | Link |", "|---|---|---|", row]
    write(STORY_LOG, "\n".join(lines).rstrip("\n") + "\n")


# ---------------------------------------------------------------------------
# Commands
# ---------------------------------------------------------------------------
def current_game_day(override: str | None) -> date:
    if override:
        return date.fromisoformat(override)
    return game_day(datetime.now(), rollover_hour())


def cmd_briefing(args) -> None:
    today = current_game_day(args.date)
    target = BRIEFINGS / f"{today}.md"
    if target.exists() and not args.force and not args.dry_run:
        sys.exit(f"[GM] A briefing for {today} already exists ({target.name}). "
                 "Use --force to replace it.")
    ctx = gather(today)
    if not ctx["have_note"]:
        print(f"[GM] No daily note for {today}; framing the day without a plan.")
    prompt, system = briefing_prompt(ctx), system_prompt()
    if args.dry_run:
        print("=== SYSTEM ===\n" + system + "\n\n=== PROMPT ===\n" + prompt)
        return
    print(f"[GM] Briefing for {today} ({MODEL_STRONG})...")
    briefing, quests = parse_briefing(call(MODEL_STRONG, system, prompt, 1500))
    header = f"# Morning briefing: {today:%A %d %B %Y}\n\n"
    write(target, header + briefing + "\n")
    write(QUESTS, quest_board(today, ctx["tasks"], quests))
    add_timeline_row(today, briefing.split("\n")[0])
    print("\n" + briefing)
    print(f"\n[GM] Wrote {target.relative_to(VAULT)} and {QUESTS.relative_to(VAULT)}.")


def cmd_story(args) -> None:
    lines = read(STORY_LOG).split("\n")
    table = [l for l in lines if l.startswith("|")]
    pins = [l for l in lines if PIN in l and not l.startswith("|")]
    prose = "\n".join(l for l in lines if not l.startswith("|") and PIN not in l
                      and not re.match(r"^#+\s*(timeline|pinned)", l, re.I))
    prose = re.sub(r"^# .*\n", "", prose.strip()).strip()
    recent = "\n\n---\n\n".join(
        f"[{p.stem}]\n{clip(read(p), 1500)}" for p in reversed(past_briefings(date.today() + timedelta(days=1))[-5:]))
    prompt = story_prompt(prose, recent)
    if args.dry_run:
        print(prompt)
        return
    print(f"[GM] Refreshing Story So Far ({MODEL_SMALL})...")
    new = call(MODEL_SMALL, system_prompt(), prompt, 900)
    out = ["# Story So Far", "", new.strip()]
    if pins:
        out += ["", "## Pinned moments", *pins]
    if table:
        out += ["", "## Timeline", *table]
    write(STORY_LOG, "\n".join(out) + "\n")
    print("[GM] Story So Far refreshed (timeline and pinned lines kept).")


def cmd_status(args) -> None:
    today = current_game_day(args.date)
    print(f"Vault: {VAULT}\nGame day: {today} (rolls over at {rollover_hour():02d}:00)")
    for label, p in (("Event log", EVENT_LOG), ("Hero note", HERO_NOTE), ("Settings", SETTINGS),
                     ("Story So Far", STORY_LOG), ("GM preferences", PREFS),
                     ("Narrator persona", NARRATOR_PERSONA), ("Hero persona", HERO_PERSONA),
                     ("Today's daily note", JOURNAL_DIR / f"{today}.md")):
        print(f"  {'ok     ' if p.exists() else 'missing'} {label}: {p.relative_to(VAULT)}")
    h = hero_state()
    print(f"Hero: HP {stat(h, 'hp')}  MP {stat(h, 'mp')}")
    print(f"Planned today: {len(plan_tasks(read(JOURNAL_DIR / f'{today}.md')))} task(s)")
    prev = past_briefings(today)
    print(f"Last briefing: {prev[-1].stem if prev else 'none'}")
    print(f"ANTHROPIC_API_KEY: {'set' if os.getenv('ANTHROPIC_API_KEY') else 'not set'}")


def main() -> None:
    ap = argparse.ArgumentParser(description="TaskRPG GM Bridge (optional narrator fallback)")
    ap.add_argument("command", choices=("briefing", "story", "status", "morning", "evening", "summary"))
    ap.add_argument("--dry-run", action="store_true", help="print the prompt; no API call, no writes")
    ap.add_argument("--force", action="store_true", help="replace today's briefing if it exists")
    ap.add_argument("--date", help="override the game day (YYYY-MM-DD)")
    args = ap.parse_args()

    legacy = {"morning": "briefing", "summary": "story"}
    if args.command == "evening":
        sys.exit("[GM] 'evening' was removed in TaskRPG v2: there is no per-day story beat. "
                 "Results are turned into prose in the next morning briefing.")
    if args.command in legacy:
        print(f"[GM] '{args.command}' is now '{legacy[args.command]}'.")
        args.command = legacy[args.command]
    {"briefing": cmd_briefing, "story": cmd_story, "status": cmd_status}[args.command](args)


if __name__ == "__main__":
    main()