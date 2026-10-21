# TaskRPG Decision Log

**Last Updated**: 2026-10-21
Newest first. A decision stays active until marked `Superseded`.

Statuses: **Accepted** (settled; agents follow it), **Provisional** (revisable default), **Superseded** (inactive; link replacement).

## D-024—`Task done` always writes `status: done`

- **Status:** Accepted
- **Decision:** `task-done.js` overwrites the note's `status` with `done` and stamps `completedDate`. Prior status is not preserved.
- **Context:** The script preserved whatever status the note held, so a resolved task could still read `open`/`in-progress`. User confirmed TaskNotes detects a status written straight to frontmatter, so no plugin API call is needed.
- **Rationale:** One rule: a resolved RPG turn means a completed note. Symmetric with undo writing `open` (D-021). `done` is configured with `isCompleted: true` in this vault.
- **Alternatives considered:** Keep status untouched (note and log disagree); read `customStatuses` and write whichever entry is completed (more code, same result here).
- **Implications:** Removes the "TaskRPG preserves TaskNotes status" claim from PRD 3.9, `TESTING.md`, `CHANGELOG.md`. Test starts the note at `open`. Write stays frontmatter-only via `updateTaskStatus`.
- **Revisit when:** `done` is renamed or removed, or a different completion value is configured.

## D-023—Task identity is a `taskId` frontmatter field, not the file path

- **Status:** Accepted
- **Decision:** Every task note carries a stable `taskId`. New notes get it from the TaskNotes body template (`taskId: {{nano}}`).
- **Context:** TaskNotes 4.13.8 writes no per-task ID and identifies tasks by tag; its identity is the file path. Events need an identity that survives renames for undo matching.
- **Rationale:** A field travels with the note, survives moves, and does not depend on folder layout. `{{nano}}` comes from TaskNotes, so TaskRPG invents nothing.
- **Alternatives considered:** Vault-relative path (fragile on rename); writing the field on first resolution (mutates the note beyond status).
- **Implications:** Both scripts read `taskId` from frontmatter; no script change was needed. Body-template merge verified on 4.13.8 (2026-10-21): `taskId` written, `tags`/`status` preserved. Backfill script is dry-run by default because `TaskNotes/` is gitignored. Notes also need `skill` and `size`.
- **Revisit when:** TaskNotes writes its own stable ID or the template cannot set frontmatter.

## D-022—A task note is identified by TaskNotes' tag, not a `type` field

- **Status:** Accepted
- **Decision:** A note is a task when it carries the configured `taskTag` (from `data.json`, fallback `task`) and a non-empty `taskId`. No `type` requirement.
- **Context:** The script required `type: task`, but TaskNotes 4.13.8 writes no such field and identifies by tag. 0 of 11 real notes had `type`, so every real note was refused.
- **Rationale:** Uses the plugin's identification, follows renamed tags, needs no migration.
- **Alternatives considered:** Add `type: task` via template and backfill (duplicate identity that can drift); keep and ask the user to edit notes (breaks existing notes).
- **Implications:** `taskTag()` mirrors `taskFolder()`. A note with `type: task` but no tag is refused; leftover `type` is harmless. Covered by tests, not run on a live note with `skill`/`size`.
- **Revisit when:** TaskNotes adds a type field or changes `taskIdentificationMethod`.

## D-021—Undo restores the TaskNotes default `open` status

- **Status:** Accepted
- **Decision:** `Undo last` sets the matching note to `open` and clears `completedDate`. No previous-status lookup; event schema unchanged.
- **Context:** Undo cleared only `completedDate`, leaving the note Done while the log treated the task as unresolved (issue #19).
- **Rationale:** `open` is the plugin default, keeps the note consistent with unresolved state, and avoids storing a guessed prior status.
- **Alternatives considered:** Preserve status; restore it from the event log (schema change).
- **Implications:** `open` lives once as `OPEN_TASK_STATUS` in `task-utils.js`; the edit goes through the frontmatter-only writer (issue #14). Verified against 4.13.8.
- **Revisit when:** Configured statuses or `defaultTaskStatus` change.

## D-020—Event log as source of truth

- **Status:** Accepted
- **Decision:** One shared append-only event log is the source of truth for shared progression.
- **Context:** v1 used the daily journal, which made reconstruction and correction hard.
- **Rationale:** Auditable progression, replay, undo without history rewriting, game state separate from journal prose.
- **Alternatives considered:** Daily journal as truth; JSON state store.
- **Implications:** Hero note is a derived cache; every meaningful action appends an event; recalculation replays events.
- **Revisit when:** Log size or concurrent edits make Markdown impractical.

## D-019—Immersion is the v1 priority

- **Status:** Accepted
- **Decision:** Prioritise an immersive RPG layer before external integrations.
- **Context:** Boredom and lack of novelty are the main reasons projects and routines are abandoned.
- **Rationale:** Immersion sustains productive behaviour; external sync does not fix motivation.
- **Alternatives considered:** Productivity mechanics with a story wrapper; immediate external sync.
- **Implications:** v1 focuses on narrator, characters, dice, tables, memory, progression; sync is deferred.
- **Revisit when:** The core loop is stable and external tasks become the main friction.

## D-018—Use TaskNotes as the task layer

- **Status:** Accepted
- **Decision:** TaskNotes owns task creation, planning, scheduling and user fields (`skill`, `size`, `urgent`, `important`). TaskRPG owns resolution, undo, and the two status writes (`done`, `open`; D-024).
- **Context:** Duplicating task management in QuickAdd would create competing sources of truth.
- **Rationale:** Reuse avoids duplicate UI, status logic and scheduling logic.
- **Alternatives considered:** Custom QuickAdd New task and Plan task scripts.
- **Implications:** TaskRPG reads configured TaskNotes fields; custom task-creation macros are removed from v1. Status ownership changed in D-024.
- **Revisit when:** TaskNotes cannot support a required workflow.

## D-017—Separate task completion from RPG resolution

- **Status:** Accepted
- **Decision:** TaskRPG owns resolution and undo. Marking Done in TaskNotes does not itself resolve the RPG turn in phase 1; the user runs `Task done` on an open task, and `Undo last` appends a correction (D-008).
- **Context:** Automatic TaskNotes Workflows integration is unverified.
- **Rationale:** Manual resolution avoids an untested trigger and keeps the first slice reliable.
- **Alternatives considered:** Resolve automatically on In Progress → Done.
- **Implications:** `Task done` requires an open TaskNotes task; duplicate protection uses recorded RPG resolution, not TaskNotes status. Automatic triggering may come in phase 2.
- **Revisit when:** TaskNotes Workflows integration is validated.

## D-016—Dice and tables decide what happens

- **Status:** Accepted
- **Decision:** Dice and random tables determine events; AI narrates presentation.
- **Context:** Pure AI generation feels arbitrary and is hard to audit.
- **Rationale:** Real dice and plain table notes preserve surprise, reproducibility and user control, with narrative personalisation.
- **Alternatives considered:** AI chooses every story event.
- **Implications:** Tables are notes; usage is tracked; narrator output follows rolled results.
- **Revisit when:** Table upkeep becomes burdensome or randomness quality drops.

## D-015—Layered character memory

- **Status:** Accepted
- **Decision:** Core facts, recent sessions, monthly digests, pinned moments, campaign logs, shared canon.
- **Context:** Long-term continuity can exceed context limits.
- **Rationale:** Keeps characters manageable over months while preserving continuity.
- **Alternatives considered:** Full transcripts; one summary.
- **Implications:** Agents compress old sessions; pinned moments are protected; originals stay in GitHub history.
- **Revisit when:** Memory quality or context use becomes problematic.

## D-014—Shared progression, isolated campaign story

- **Status:** Accepted
- **Decision:** Player progression is shared across campaigns; campaign story state is isolated by campaign ID.
- **Context:** Multiple campaigns may share one world.
- **Rationale:** Real tasks reflect one player; plot continuity should not leak between campaigns.
- **Alternatives considered:** Separate progression per campaign.
- **Implications:** A campaign-linked task awards progression once; campaign events need approval to become shared canon.
- **Revisit when:** Campaign isolation requirements change.

## D-013—10 MP daily budget

- **Status:** Accepted
- **Decision:** 10 MP, refilled each morning.
- **Context:** v1 modelled real daily energy, adding input burden and guilt.
- **Rationale:** A fixed in-game budget encourages prioritisation without health data.
- **Alternatives considered:** Real-energy input; no MP limit.
- **Implications:** Task size, planning, urgency, importance, overdraft and Wounded interact with MP.
- **Revisit when:** Real use shows the budget too tight or too loose.

## D-012—Task Done is a dice-based game turn

- **Status:** Accepted
- **Decision:** Completing a task triggers a 2d6 roll and instant table result.
- **Context:** v1 gave a story beat after work, with less immediate novelty.
- **Rationale:** Immediate randomness makes completion feel like a turn and reinforces the loop.
- **Alternatives considered:** AI-written story on every Done press.
- **Implications:** Dice affect story only; XP and MP follow deterministic rules.
- **Revisit when:** Live narration becomes reliable and desirable.

## D-011—Habits stay dice-free

- **Status:** Accepted
- **Decision:** Habit completion shows a one-line status, no dice roll or story beat.
- **Context:** Habits are frequent and must stay low-friction.
- **Rationale:** A toast preserves momentum without making every routine narratively expensive.
- **Alternatives considered:** Dice rolls and story beats for habits.
- **Implications:** Habits still give HP and XP; narrative development stays in tasks and sessions.
- **Revisit when:** Users want richer habit feedback.

## D-010—Five fixed skills

- **Status:** Accepted
- **Decision:** Focus, Vitality, Craft, Mind, Presence.
- **Context:** Broad coverage of work and life without excessive complexity.
- **Rationale:** Five covers deep work, wellbeing, making, learning/admin and social life while keeping progression legible.
- **Alternatives considered:** More granular skills; user-defined skills.
- **Implications:** Every task and habit maps to one skill; companions and perks align to these.
- **Revisit when:** A required domain does not fit.

## D-009—HP is habit-driven

- **Status:** Accepted
- **Decision:** Core habits restore HP; missed blocks cost HP, capped at 2/day.
- **Context:** A gentle consequence loop for routines without punishing task backlog.
- **Rationale:** HP links wellbeing routines to game state and gives a recovery path.
- **Alternatives considered:** HP from task completion; no HP loss.
- **Implications:** Wounded affects dice and task MP; habits are exempt from the Wounded surcharge.
- **Revisit when:** HP penalties feel punitive or ineffective.

## D-008—Undo is a correcting event

- **Status:** Accepted
- **Decision:** Undo appends a correction; it never deletes or rewrites history.
- **Context:** The event log must stay auditable.
- **Rationale:** Corrections preserve the original action, support replay, prevent data loss.
- **Alternatives considered:** Delete or edit the original event.
- **Implications:** Undo is same-day eligible actions only and cannot re-roll.
- **Revisit when:** A richer correction workflow is needed.

## D-007—Engine stays dependency-free

- **Status:** Accepted
- **Decision:** Plain, dependency-free JavaScript, no Obsidian API.
- **Context:** Vault Operator cannot run a terminal; a future plugin port is possible.
- **Rationale:** A pure engine runs in QuickAdd, terminal tests and a future plugin without rewriting rules.
- **Alternatives considered:** Build against Obsidian APIs.
- **Implications:** All file I/O in wrappers; tests run without Obsidian.
- **Revisit when:** A hard requirement forces direct Obsidian integration.

## D-006—Notes are the storage format

- **Status:** Accepted
- **Decision:** `Events.md`, `Settings.md`, `Hero.md` stay Markdown notes.
- **Context:** Must remain readable and portable inside Obsidian.
- **Rationale:** Markdown preserves readability, vault compatibility and future plugin compatibility.
- **Alternatives considered:** JSON or JSONL as the primary format.
- **Implications:** Terminal tests may use equivalent JSONL; live vault stays Markdown.
- **Revisit when:** Performance, concurrency or querying justify migration.

## D-005—Vault Operator runs narrator and characters

- **Status:** Accepted
- **Decision:** Narrator and character agents run in Vault Operator inside Obsidian.
- **Context:** User wants in-vault character interaction, not a terminal workflow.
- **Rationale:** Sidebar chat, vault access and persona agents without a custom framework.
- **Alternatives considered:** Custom plugin; external chat app; terminal agent.
- **Implications:** Desktop-only; provider data terms apply; controlled write permissions required.
- **Revisit when:** Vault Operator limits block required interactions.

## D-004—One agent per character

- **Status:** Accepted
- **Decision:** One narrator agent, one agent per recurring character, each with a persona file.
- **Context:** Continuity and voice need isolated persona and memory.
- **Rationale:** Easier to reason about persona, memory and relationships.
- **Alternatives considered:** One multi-character agent.
- **Implications:** Summaries and memory writes are character-scoped; campaign context is selected explicitly.
- **Revisit when:** Agent count or provider limits make it impractical.

## D-003—Tutorial arc

- **Status:** Accepted
- **Decision:** Introduce mechanics gradually through a tutorial arc.
- **Context:** Many interacting mechanics.
- **Rationale:** Staged unlocks lower initial load and teach the loop through play.
- **Alternatives considered:** Everything from day one.
- **Implications:** Locked rules stay visible but inactive; a skip-ahead command may unlock early.
- **Revisit when:** Onboarding feels too slow or restrictive.

## D-002—Projects, arcs and quests

- **Status:** Accepted
- **Decision:** Long-term work is projects; stages are arcs; real tasks are quests.
- **Context:** Multi-week work needs narrative structure.
- **Rationale:** Connects real progress to story progression without changing task ownership.
- **Alternatives considered:** Fixed-length seasons; flat task lists.
- **Implications:** Arcs and quest backlogs; threat rises with finished arcs; focus projects get an XP bonus.
- **Revisit when:** The workflow proves too heavy.

## D-001—Boss challenges are real-world criteria

- **Status:** Accepted
- **Decision:** Engine-checked real-world challenges, not dice fights.
- **Context:** Milestone challenges must tie to actual behaviour.
- **Rationale:** Engine checks prevent honour-system completion and connect rewards to progress.
- **Alternatives considered:** Dice-based boss combat.
- **Implications:** Fixed engine-owned type menu; rewards may include one small perk per skill.
- **Revisit when:** More variety is needed.
