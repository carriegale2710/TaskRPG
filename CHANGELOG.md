# Changelog

Release history. Format: Keep a Changelog (https://keepachangelog.com/). Invoke `changelog` skill.

This file records what shipped, per version. It is not session context: goals, commits, decisions, failures and blockers live in `docs/DEVLOG.md`. Not build status: that is `docs/BUILD_PLAN.md`. Not rules: those are `docs/PRD.md`.

Version numbers follow semver, one minor bump per release while 0.y.z: `0.1.0` = Step 1 (engine/tests), `0.2.0` = Step 2 (habit Done button), `0.3.0` = repo restructure, `0.4.0` = agent setup/docs skills, `0.4.1` = docs restructure.

## [0.5.0]

### Added

- `Task done` resolves open TaskNotes task: roll, event, note status.
- `Undo last` appends correcting event, restores task or habit note.
- `task-utils.js` holds shared frontmatter, tag, hero-render helpers.
- `task-done.test.js`, `task-utils.test.js`, `undo.test.js` cover new paths.

### Changed

- TaskNotes owns creation and planning; TaskRPG owns resolution, undo, status writes.
- Task resolution tests expand validation to 140 passing cases.
- Result card shows as one 15-second Notice; `obsidian.Modal` path gone.
- `task-undo.js` renamed `undo.js`; handles habits too.
- Habit undo deletes its own history line; other lines untouched.
- `Engine/Hero.md` rewritten after task done and after undo.
- Task notes found by `taskId`, `tasksFolder`, `taskTag`, not folder guess.
- PRD v1 scope cut from 20 items to 10.
- Tests grouped by describe blocks for readable output.
- CHANGELOG trimmed to release history; session detail now DEVLOG only.

### Fixed

- Planned tasks use game day, not calendar date.
- `scheduled` accepts datetime and quoted values.
- Missing or empty `scheduled` stays unplanned.
- `Task done` logged event but left note open; frontmatter write fixed.
- Block-list and quoted `tags` parse; urgent/important bonuses apply.
- Scheduled date reads `scheduled`, not `scheduledDate`.
- Duplicate guard allows re-resolution after valid undo.
- `taskId: null`, `~`, `undefined` refused as missing.
- Stale `Scripts/` and `Engine/` paths fixed after move into `TaskRPG/`.

### Removed

- `new-task.js` and `plan-task.js` QuickAdd flows.

---

## [0.4.1] - 2026-10-18

Docs-only. No engine, script, or runtime change.

### Added

- `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, `docs/BUILD_PLAN.md`, `docs/DOCUMENTATION.md`.
- `Journal/README.md` replaces `TaskRPG/Journal/AGENTS.md`.

### Changed

- `CHANGELOG.md` moved to repo root.
- PRD restructured: single settled-decisions §3, subsections renumbered.
- `AGENTS.md` rewritten: authority, skills, safety, coding rules.
- `README.md` rewritten as first-time landing page.
- Build status and gaps moved to `docs/BUILD_PLAN.md`.
- `Journal/` moved out of `TaskRPG/`; user-owned, agents stay out.
- `Templates/Daily.md` moved to `TaskRPG/Templates/`.
- TaskNotes base views: labels, `sort`, project filter normalized.
- `.gitignore` adds local `Clippings/`, `TaskNotes/` ignores.
- Habit note links `BUILD_PLAN.md`, not removed `STEP2`.

### Removed

- `docs/BUILD_PROMPT.md`, `docs/STEP3.md`.
- `TaskRPG/Campaign/AGENTS.md`, `TaskRPG/World/AGENTS.md`.

---

## [0.4.0] - 2026-10-16

Agent setup and documentation skills. No engine or runtime change.

### Added

- TDD rules in `AGENTS.md`: test-first, no weakened tests.
- Session skills: `caveman` always, `ponytail` for coding.
- Local `/changelog` skill, run on each commit.
- PRD user flow section: habit Done flow.

### Changed

- `AGENTS.md` TDD section cut from ~1,824 words to short block.

---

## [0.3.0] - 2026-10-16

Repo restructure. All tests passing.

### Added

- `docs/` folder for project documentation.
- `TaskRPG/` folder for game content.
- `.gitignore` ignores local dev files.

---

## [0.2.0] - 2026-10-14

Habit Done button.

### Added

- Habit Done macro (`habit-done.js`): on-time/late prompt, event, history, hero.
- `Engine/Hero.md` derived hero note with Meta Bind fields.
- `Engine/Habits/Morning routine.md` first habit, with Done button.
- `habit-done.test.js`: on-time, late, cancelled, no habit open.

### Changed

- Live event log is `Engine/Events.md`, not `.jsonl`; Obsidian hides `.jsonl`.

---

## [0.1.0] - 2026-10-14

Engine and tests.

### Added

- `engine.js` dependency-free engine; runs from terminal, no Obsidian.
- Rules: MP, habit cost tiers, XP/levels, 2d6 roll, HP, rest/pause.
- Append-only event log; replay in timestamp order; per-day settings.
- `engine.test.js`: one test per rule, plus undo, day boundary, backfill.
