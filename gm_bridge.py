#!/usr/bin/env python3
"""GM Bridge: Obsidian vault <-> Claude GM agent.

Usage:
  python gm_bridge.py morning
  python gm_bridge.py evening
  python gm_bridge.py summary

Requires: pip install anthropic python-frontmatter
Export: ANTHROPIC_API_KEY, VAULT_PATH
"""
import os, sys, re
from datetime import date
from pathlib import Path
import frontmatter
from anthropic import Anthropic

VAULT = Path(os.getenv("VAULT_PATH", Path.home() / "MyVault"))
JOURNAL = VAULT / "Journal"
STORY = VAULT / "Campaign" / "02 Story So Far.md"
RULES = VAULT / "Campaign" / "01 Campaign Rules.md"
MODEL = "claude-sonnet-4-20250514"
MAX_TOKENS = 600

def today_note():
    p = JOURNAL / f"{date.today().isoformat()}.md"
    if not p.exists(): sys.exit(f"[!] Not found: {p}")
    return p

def load(p): return frontmatter.load(p)

def recent(n=2):
    notes = sorted(JOURNAL.glob("*.md"), reverse=True)[:n+1]
    out = []
    for p in notes:
        post = load(p)
        beat = section(post.content, "Story beat")
        if beat: out.append(f"[{p.stem}]\n{beat.strip()}")
    return out[:n]

def section(content, heading):
    m = re.search(rf"## {re.escape(heading)}\n(.*?)(?=\n## |\Z)", content, re.DOTALL)
    return m.group(1).strip() if m else ""

def capacity(mp): return 2 if mp<=4 else 3 if mp<=7 else 4
def qtype(mp): return "Rest/Scout" if mp<=4 else "Standard" if mp<=7 else "Deep/Bold"

def morning_prompt(post):
    mp = post.get("mp",5); cap = capacity(mp); qt = qtype(mp)
    plan = section(post.content, "Today's plan")
    story = STORY.read_text() if STORY.exists() else ""
    rules = RULES.read_text() if RULES.exists() else ""
    return f"""You are the GM for "The Archivist's Coast."
MP: {mp}/10, Energy: {post.get("energy","medium")}, Type: {qt}, Capacity: {cap}
Rules: low MP = recovery framing, no new threads if MP<=4, rewards match capacity.
Plan: {plan}
Rules: {rules}
Story: {story}
Write 100-150 word quest framing, clear objective, no new real-world tasks."""

def evening_prompt(post):
    mp = post.get("mp",5)
    quest = section(post.content, "Quest / story update")
    story = STORY.read_text() if STORY.exists() else ""
    rec = "\n\n---\n\n".join(recent(2))
    return f"""You are the GM for "The Archivist's Coast."
MP: {mp}/10, Quest: {quest}
Story: {story}
Recent: {rec}
Write 120-180 word completion beat, advance existing thread, reward proportional to capacity, next-chapter hook."""

def summary_prompt():
    story = STORY.read_text() if STORY.exists() else ""
    rec = "\n\n---\n\n".join(recent(5))
    return f"""Rewrite Story So Far (200-400 words) incorporating recent beats. Preserve threads/NPCs/hooks, drop resolved minor details.\nCurrent: {story}\nRecent: {rec}\nReturn only new summary."""

def call(prompt):
    c = Anthropic()
    r = c.messages.create(model=MODEL, max_tokens=MAX_TOKENS, messages=[{"role":"user","content":prompt}])
    return r.content[0].text.strip()

def write_beat(post, path, beat):
    content = post.content + f"\n\n**Story beat:**\n\n_{beat}_\n"
    post.content = content
    frontmatter.dump(post, path)

def timeline(summary):
    if not STORY.exists(): return
    text = STORY.read_text(); row = f"| {date.today().isoformat()} | {summary[:80]} | [[Journal/{date.today().isoformat()}]] |"
    lines = text.split("\n")
    for i,l in enumerate(lines):
        if l.startswith("|---"): lines.insert(i+1,row); break
    STORY.write_text("\n".join(lines))

def main():
    if len(sys.argv)<2 or sys.argv[1] not in ("morning","evening","summary"):
        print(__doc__); sys.exit(1)
    mode = sys.argv[1]; path = today_note(); post = load(path)
    prompt = morning_prompt(post) if mode=="morning" else evening_prompt(post) if mode=="evening" else summary_prompt()
    print(f"[GM] {mode} for {path.name}...")
    result = call(prompt)
    if mode=="morning":
        print("\n=== QUEST FRAMING ===\n"+result+"\n(Paste into daily note.)")
    elif mode=="evening":
        print("\n=== STORY BEAT ===\n"+result)
        write_beat(post, path, result); timeline(result.split("\n")[0][:80])
        print(f"\n[GM] Wrote to {path.name} + Story So Far.")
    else:
        STORY.write_text(result); print("[GM] Story So Far refreshed.")

if __name__=="__main__": main()