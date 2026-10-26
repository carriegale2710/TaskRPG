# Devlog

Development context: why work happened, what it produced, what failed, what comes next. Not release notes — user-visible outcomes live in `CHANGELOG.md`. Not build status — see `docs/BUILD_PLAN.md`. Not rules — see `docs/PRD.md`.

Rule of thumb: if a fact explains a choice or records what happened during the work, it belongs here. If it tells a reader what shipped in a version, it belongs in `CHANGELOG.md`.

Timeline uses commit dates from `git log`, newest first. Not changelog release dates: the `0.4.0` block bundles commits from 2026-10-15 and 2026-10-16, and `0.1.0`/`0.2.0` both landed on 2026-10-14.

## 2026-10-26 — Planned-task game day fix

### Goal

Fix issue #13: planned-task check must use engine game day, not local calendar date.

### Did

- Added `scheduledDate()` to `task-utils.js`. Normalises `YYYY-MM-DD`, datetime, and quoted `scheduled` values to calendar date.
- Added `isPlannedToday(value, gameDay)` to `task-utils.js`. Compares normalised scheduled date with engine game day.
- Changed `task-done.js` planned check from `scheduled === utils.today()` to `utils.isPlannedToday(scheduled, engine.gameDay(timestamp, settings.dayRolloverHour))`.
- Added 6 tests to `task-utils.test.js`: rollover at 01:00/04:00, datetime value, quoted value, missing/empty value, date normalisation.
- Added 2 tests to `task-done.test.js`: datetime `scheduled` and quoted `scheduled` for current game day.
- Updated AC-4 and added TC-13 to `docs/BUILD_PLAN.md`.

### Decisions

- `isPlannedToday()` receives engine-computed game day. Avoids second copy of rollover rule in `task-utils.js`.
- Task-done tests schedule current game day via `engine.gameDay(engine.localStamp(), 4)`. Calendar-date scheduling wrong between midnight and rollover hour.

### Failed / learned

- Initial task-done test used `ymd(0)`. Failed at 00:38 local because game day still previous day. Correct engine behaviour; test changed to game-day scheduling.
- Quoted scheduled value already passed before fix. `parseFrontmatter()` strips quotes. Test kept as regression guard.

### Validation

- Red first: 6 utils tests failed on missing `isPlannedToday`/`scheduledDate`; datetime task-done test failed `false !== true`.
- Green after implementation: 6/6 utils tests pass; 2/2 task-done tests pass.
- Mutation check: forced `isPlannedToday()` to `false`; 3 utils tests and 2 task-done tests failed. Restored implementation; tests green.

### Blockers / next

- Apply provided file changes and run full `node --test TaskRPG/Scripts/task-utils.test.js` and `node --test TaskRPG/Scripts/task-done.test.js`.
- Confirm existing test suites still pass.
- Commit changes to `feat/3-task-creation-planning-completion-undo`; reference issue #13.

### Links

- Branch: `feat/3-task-creation-planning-completion-undo`
- Issue: carriegale2710/TaskRPG#13
- Files: `TaskRPG/Scripts/task-utils.js`, `TaskRPG/Scripts/task-done.js`, `TaskRPG/Scripts/task-utils.test.js`, `TaskRPG/Scripts/task-done.test.js`, `docs/BUILD_PLAN.md`
- Tests: `TaskRPG/Scripts/task-utils.test.js`, `TaskRPG/Scripts/task-done.test.js`

## 2026-10-25 — task resolution manual validation

### Goal

Record real-vault validation for Step 3 task resolution.

### Did

- Updated staged engine state, task template, and build/testing docs for current task-resolution work.
- Recorded user-confirmed desktop and phone checks as passed: TaskNotes field mapping, completion fields, Notice output, duplicate prevention, undo/redo, failure handling, and settings versioning.

### Outcome

- `docs/BUILD_PLAN.md` now marks TC-30 through TC-33 and task-resolution manual validation passed.
- Step 3 task resolution remains in progress because Undo acceptance still has open criteria.

### Decisions

- Keep Step 3 open until remaining Undo checks pass; do not mark whole milestone complete from Task done validation alone.

### Blockers / next

- Finish remaining Undo manual and replay checks before closing Step 3.

### Links

- Branch: `feat/3-task-creation-planning-completion-undo`
- Docs: `docs/BUILD_PLAN.md`, `docs/TESTING.md`
- Chat/session: user-confirmed manual validation, 2026-10-26

## 2026-10-25 — task resolution test coverage

### Goal

Bring task-resolution documentation and test coverage into sync.

### Did

- Expanded `task-done.test.js` and `task-utils.test.js` around validation, failure handling, parsing, and duplicate guards.
- Updated `docs/BUILD_PLAN.md` acceptance tables and recorded 132 passing tests.

### Outcome

- `node --test` passes: 132 tests, 30 suites, 0 failures.
- No runtime code changed; desktop and phone Obsidian validation remains pending.

### Decisions

- Keep manual acceptance criteria open until real Obsidian checks run.

### Blockers / next

- Run pending desktop and phone checks before marking Step 3 complete.

### Links

- Tests: `TaskRPG/Scripts/task-done.test.js`, `TaskRPG/Scripts/task-utils.test.js`
- Docs: `docs/BUILD_PLAN.md`, `docs/TESTING.md`

## 2026-10-24 — changelog and devlog split back to one job each

### Goal

Two docs had drifted into each other. Changelog held rule specs, decision rationale, PR/issue references and doc-shuffle narration. Devlog held commit lists with the reasoning stripped out.

### Why

Same failure the 2026-10-18 restructure was meant to fix, one level down: the changelog was being written from the devlog's raw material instead of from release facts. A reader scanning versions could not see what shipped; a reader looking for why a choice was made found hashes and file lists.

Diagnosis: entries were being written once and pasted into both files. The split needs a test applied per fact, not a habit.

### Did

- Rewrote `CHANGELOG.md` to version headings only, one-line entries, caveman ultra prose. Kept breaking changes, limitations and validation status. Dropped rule detail that PRD 3.17 and `docs/DECISIONS.md` already own.
- Fixed `.gitignore`/dev-file entry filed under `0.3.0` "Removed" when it was an addition.
- Tightened `docs/DOCUMENTATION.md` `## CHANGELOG` to state the split, and added a `## DEVLOG` template.
- Rewrote this file around goal, why, outcome, decisions, failures, next.

### Outcome

- `CHANGELOG.md` 245 → ~140 lines; every entry now answers "what shipped in this version".
- Devlog carries the reasoning and results; no rule text duplicated in either doc.
- No facts lost: undo requirements, cascade rules and host decisions stay in PRD/DECISIONS, where they are authoritative.
- Docs-only change. `node --test` in `TaskRPG/`: 96 tests, 5 suites, 0 fail — unchanged, confirming nothing touched runtime.

### Decisions

- Fact test for placement: why/outcome → devlog; shipped → changelog; current state → BUILD_PLAN.
- Changelog keeps limitation and validation lines even under brevity rules; hiding an unverified path is worse than a long bullet.

### Open

- `.agents/skills/changelog/SKILL.md` still says it writes `docs/CHANGELOG.md`; the file is at repo root. Skill is local/untracked, so left alone.

### Blockers / next

- Apply the split on every commit instead of at cleanup time. Changelog line at commit, devlog entry at session end.

### Links

- Docs: `CHANGELOG.md`, `docs/DOCUMENTATION.md`

## 2026-10-24 — v1 scope cut to ten items

### Goal

Shrink v1 to a buildable, testable set before more code.

### Why

The 20-item must-have list mixed working code with items that had no implementation and no test path: story rollback, gift cascade, inventory and loot hooks, focus-project XP, starter random tables, companion, post-trial expansion. Each needs its own Obsidian validation, and the trial week can only exercise one small loop. Keeping them in scope made Step 3 look unfinished and hid what v1 actually promises.

### Did

- `b0b37ac` PRD §7 must-have cut 20 items to 10: engine, TaskNotes fields, event log and hero panels, settings note, QuickAdd wrappers, result card and habit toast, habit notes with 30-day cost, quiz and personas (no portrait, no GM-only note), morning briefing and Today's quests, trial week. Deferred rules stay in PRD §3, marked out of v1.
- `b0b37ac` `docs/BUILD_PLAN.md` trimmed: dropped story rollback, gift cascade, inventory/loot hooks, focus-project XP, starter tables, companion step, post-trial expansion. Step 4 renamed "Quiz, narrator and hero"; Step 5 renamed "The morning briefing". Stale `PRD 4.15`/`4.23`/`4.35`/`4.39` references repointed to `ARCHITECTURE.md` §4, §5, §10 and PRD 3.23.1, 3.25.
- `1e10b9e` BUILD_PLAN criteria ticks for task creation and undo.

### Outcome

- v1 is ten items; deferred rules stay documented so cutting them is not the same as forgetting them.
- BUILD_PLAN lost steps that were empty checklists, so remaining work reads as real work. Step 3 is the only code in flight.
- No code changed, so no test result changed.

### Decisions

- v1 = those ten items. Deferred rules stay documented, unbuilt, out of v1.

### Blockers / next

- Story rollback, gift cascade and the mid-day day-boundary change stay unbuilt or undecided (D-029, D-030, PRD 3.17).
- Step 3 still needs desktop and phone validation before it can be called done.

### Links

- Branch: `feat/3-task-creation-planning-completion-undo`
- Docs: `docs/PRD.md`, `docs/BUILD_PLAN.md`, `docs/ARCHITECTURE.md`

## 2026-10-23 — habit undo owns its history line, undo.js rename

### Goal

Undo should reverse exactly what its own press wrote — no more, no less.

### Why

Habit presses append a visible line to the habit note, but undo only appended a correcting event. The engine said "undone", the note still said "done today". Two visible sources of truth disagreeing is the failure D-020 exists to prevent: note bodies are user-facing state and must follow replay.

The rename followed the same reasoning. Once undo handled habits too, `task-undo.js` named the file after half its job and invited the next reader to assume habits were excluded.

PRD 3.17 also said "restore Story state" with no mechanism, and listed only MP/XP/HP/loot as derived values. Both were untestable as written.

### Did

- `58956aa` habit undo deletes only the history line stamped with the undone event's timestamp; other lines untouched; Notice says whether a line was removed. `removeHabitLogLine()` joins `task-utils.js`.
- `task-undo.js` → `undo.js`, `task-undo.test.js` → `undo.test.js`.
- PRD 3.17 rewritten with testable requirements: eligibility, stacking newest-first, correcting event before note writes, replay-derived state, story rollback via `<!-- evt:<eventId> -->` tags; BUILD_PLAN undo checklist regroups by PRD 3.17.
- PRD 3.1–3.25 gained 50 user stories, two acceptance criteria each, restating settled bullets.
- D-026 recorded. D-032: AI agent host left undecided (Obsidian Copilot, Text Generator, Vault Operator); D-005 superseded. `gm_bridge.py` docstring follows.
- Six `hasUnresolvedTaskDone` guard tests moved `undo.test.js` → `task-utils.test.js`; one renamed to say it blocks.

### Outcome

- Habit note and engine state agree after undo. Removing by timestamp means no new field, no history IDs, and no rewrite of lines the user typed.
- Undo requirements are now testable one criterion at a time instead of prose.
- Host-agnostic wording means a plugin swap costs a validation run, not a docs rewrite.
- Guard tests sit with the helper they test, so a failing guard points at `task-utils.js`.

### Decisions

- D-026: matching history line is removed, not struck through. A note that keeps a false "done" line contradicts replay.
- D-028: undo replays the log with the target excluded rather than subtracting stored deltas.
- D-029: trailing HTML comment tag is invisible in reading view, survives tables, needs no snapshot.
- D-031: no confirmation step; undo is recoverable by pressing Done again.

### Failed / learned

- Writing the undo rule as prose first produced three rounds of rework. Writing the criteria as numbered requirements exposed timestamp ties, level-up reversal and settings-in-force gaps that prose had hidden.

### Blockers / next

- Gift cascade undo (D-030) blocked until gifts, inventory and companions exist.
- Story rollback tag exists as a rule only; no narrator writes tags yet.

### Links

- Commit: `58956aa`
- PR: #10 (draft), issue #3

## 2026-10-22 — result card as one Notice

### Why

Every run showed the Notice, so the `obsidian.Modal` branch never executed. It could not be trusted either: `obsidian` is not reliably a global inside a QuickAdd user script loaded by read/eval, and the surrounding `try`/`catch` swallowed which branch ran. Two display paths where one is unobservable means a silent fallback decides behaviour, and no test can catch a regression.

### Did

- `47e368f` dropped the QuickAdd `obsidian.Modal` path and its silent try/catch fallback; one 15-second Notice carries the result card, dismisses on click.
- `task-done.test.js` asserts one Notice with outcome line. PRD 3.15, BUILD_PLAN, TESTING updated.

### Outcome

- Single display path, no swallowed error, no dependency on an unavailable global.
- One test asserts exactly one Notice per resolution, so a second display path cannot return unnoticed.
- The "result modal untested" gap closes. Mobile Notice rendering stays unverified and is recorded as such.

### Decisions

- D-025: Notice wins. Unverified plugin path removed rather than wrapped in a fallback.

### Blockers / next

- Mobile Notice rendering still unverified.

### Links

- Commit: `47e368f`

## 2026-10-21 — TaskNotes integration day

### Goal

Resolve real TaskNotes tasks instead of an assumed folder layout. One shared helper module.

### Why

The first scripts encoded assumptions no plugin actually met. A note was a task only with `type: task`; none of the 11 real notes had that field, so every real note was refused. Task notes were assumed to sit directly in `TaskNotes/`. Identity was the file path, which breaks on rename and would strand undo matching. Reading the installed plugin's `data.json` replaced three guesses with one source.

### Did

- `8859d1f` task note identified by `taskTag` read from TaskNotes `data.json`, located via `tasksFolder` (fallback `TaskNotes/Tasks`); no `type: task` requirement.
- `6dcb111` `taskId` as stable identity (D-023); body template `taskId: {{nano}}`.
- `dd61d58`, `b3a5b70` undo refactor and logging; `task-undo.js` introduced.
- `a02a91d`, `a3ec113` `Engine/Hero.md` rewritten after task done and after undo; `renderHero()` shared so the two wrappers cannot drift.
- `c1a4530` TaskRPG writes `status: done`/`open` (D-024, issue #19); supersedes the 2026-10-15 "preserve TaskNotes status" rule.
- `744e0d0` daily, habit and task templates.
- `2926a7e`, `88b5f5c`, `bb34b88` AGENTS file map, ARCHITECTURE vault map, verbosity cut.

### Outcome

- Real vault notes are accepted without migration: tag and folder come from the plugin's own config, so renaming the tag or moving `tasksFolder` keeps working.
- `taskId` survives moves, which is what makes undo find the note it must reopen.
- Hero panels no longer lag behind the log: both wrappers render from one shared helper, so a change cannot land in one and miss the other.
- Template merge verified manually on TaskNotes 4.13.8 (2026-10-21): `taskId` written, `tags`/`status` preserved.
- Still unverified: desktop `Task done`, field preservation on a live note, phone display. Recorded in BUILD_PLAN, not claimed here.

### Decisions

- TaskNotes = creation, planning, user fields. TaskRPG = resolution, undo, `done`/`open` writes.
- Hero note is derived state; panels read it, nobody hand-edits it.

### Failed / learned

- "Preserve note status" was the wrong direction. TaskNotes detects the status written to frontmatter, so preserving it left a resolved turn looking open. Two 2026-10-15 decisions were reversed once the plugin was observed rather than assumed.
- Lesson now applied: read the plugin's config and test one real note before encoding a rule about its behaviour.

### Links

- Issue: #19
- Tests: `task-done.test.js`, `task-utils.test.js`

## 2026-10-20 — frontmatter edge cases

### Why

Two silent data-loss classes, both invisible to the user at the time:

- TaskNotes writes tags as a block list (`tags:` then `  - important`). The parser handled only flow lists, so `urgent`/`important` were dropped and the XP bonuses never applied.
- `updateTaskStatus` edited the wrong part of the note and failed without surfacing it. A `Task done` could log an event and leave the note open, which makes the log and the user's task list disagree.

Silent failure is worse than a crash here: the log says the turn happened, the note says it did not.

### Did

- `685498c` block-list `tags:` now parses as a list, so urgent/important XP bonuses apply. Quoted flow-list tags lose their quotes.
- `e31a2a4` tests for unquoted, single-, double-quoted `type`/`taskId`/`skill`/`size`, empty quoted values, colon and quote inside values, leading BOM (issue #17). Test-only; behaviour already shipped.
- `5b960ec` completion fields written into frontmatter (issue #14).

### Outcome

- Bonuses apply to real notes; quoted, block-list and BOM-prefixed frontmatter all parse.
- Status edits are frontmatter-only, insert missing fields, preserve CRLF, and throw a clear error when there is no frontmatter.
- Tests now pin the quoting and BOM cases so a future regex change cannot quietly regress them.

### Failed / learned

- Frontmatter rewrite failed silently. Fix: write only the frontmatter block, insert missing `status`/`completedDate`, throw when frontmatter is absent. Rule: a write that cannot be verified should fail loudly.

### Links

- Issues: #14, #17

## 2026-10-19 — test readability, changelog cleanup

### Why

Test output had become a flat wall of names, so finding the failing rule meant scrolling rather than reading. The changelog also carried status and gap lines that BUILD_PLAN had just taken ownership of, keeping two answers for one question. `.agents/` churn was polluting history for local-only tooling.

### Did

- `a879990` tests grouped with describe blocks for readable terminal output.
- `4e89b47` CHANGELOG made scannable; outdated info deleted.
- `0cbc70b`, `8babf8d` `.agents/skills` gitignored and deleted from tracking — local only.

### Outcome

- A failure now prints under the suite that owns the rule.
- Changelog stopped competing with BUILD_PLAN for status.
- Skill edits stay local, so repo history holds project changes only.

## 2026-10-18 — docs restructure (0.4.1)

### Goal

Kill verbosity, staleness, redundancy, drift. One job per doc.

### Why

Docs had grown by accretion. Rules were restated in PRD, AGENTS and TESTING; build status sat in the changelog; the changelog also explained rules; README carried spec. Any change required finding every copy, and readers could not tell which copy was authoritative. The symptom users of the docs felt was drift: two files disagreeing after one edit.

### Did

- `e3b5b93` new `docs/ARCHITECTURE.md`, `docs/BUILD_PLAN.md`, `docs/DECISIONS.md`, `docs/DOCUMENTATION.md`. PRD restructured into a single "Settled decisions" §3 with renumbered subsections. `AGENTS.md` rewritten to authority order, skills, safety, coding rules. `README.md` rewritten as landing page.
- `e3b5b93` build status and known gaps moved out of `CHANGELOG.md` and `docs/TESTING.md` into `docs/BUILD_PLAN.md`. `CHANGELOG.md` moved `docs/` → repo root. Removed `docs/BUILD_PROMPT.md`, `docs/STEP3.md`, `TaskRPG/Campaign/AGENTS.md`, `TaskRPG/World/AGENTS.md`.
- `e78998b` `Journal/` moved out of `TaskRPG/` — user-owned content, agents stay out.
- `31dc7ca` new vault folders.

### Outcome

- Each doc has one job; the responsibility table names what each must never contain.
- Status lives in one place (BUILD_PLAN), decisions in one place (DECISIONS), rules in one place (PRD).
- Rules live in PRD; `AGENTS.md` points at them instead of restating them, so a rule edit has one destination.

### Decisions

- Single-responsibility doc set. `AGENTS.md` owns where information lives; `docs/DOCUMENTATION.md` owns how to write it.

### Failed / learned

- Splitting files once was not enough. Without a per-fact placement rule, content flowed back into whichever file was open at the time — which is what forced the 2026-10-24 split. Ownership needs a test, not just a table.

### Assumptions

- Changelog block bundles a few items committed 2026-10-15/16 (TaskNotes base views, `.gitignore` additions); recorded under this release entry.

### Links

- Release: `0.4.1`

## 2026-10-17 — repo structure PR merged (#11)

### Why

The `repo-structure` branch held the layout Step 3 depends on (`TaskRPG/Scripts/`). Continuing on a long-lived branch meant every path in docs, macros and tests stayed provisional.

### Did

- `c3b5211` merge brings `TaskRPG/Scripts/` layout into main: `task-done.js`, `task-utils.js`, tests.

### Outcome

- Main became the work base for Step 3; scripts, docs and QuickAdd references agree on one layout.

### Links

- PR: #11

## 2026-10-16 — repo restructure (0.3.0)

### Why

Root mixed three kinds of content: project docs, game data, and code. Obsidian shows all of it as notes, so vault browsing was cluttered and "where does this file go" had no answer.

### Did

- `c31dac9` all project docs into `docs/`.
- `bd65c7d` game content into `TaskRPG/`: scripts, story, characters, events.
- `6d2709d` changelog notes restructure.
- `b26f651`, `e473c96`, `0aec3a4` `.agents/` treated as local-only: deleted, untracked, gitignored.

### Outcome

- Root holds entry points (`README.md`, `AGENTS.md`, `CHANGELOG.md`); detail sits under `docs/`; game content under `TaskRPG/`.
- Local tooling stopped appearing in repo history.

### Links

- Release: `0.3.0`

## 2026-10-16 — agent contract, session skills, TaskNotes field names

### Why

Agents had rules scattered across files with no stated precedence, so a conflict was resolved by whichever file was read last. Separately, field names were being invented: `scheduledDate` read naturally but TaskNotes uses `scheduled`, and a wrong name fails silently as an empty field.

### Did

- `fd71adc` agent instructions update; `83bb433` README restore.
- `c8f7687` caveman skill on by default for all sessions.
- `0c01347` reference guide for `/update-changelog` skill.
- `aa70290` verbosity cut plus user flow diagram section in PRD (habit Done flow only).
- `e0dfbbb` `scheduled` used, not `scheduledDate`, matching TaskNotes default properties.
- `96e151e` TaskNotes base views filtered by `urgent` and `important`; `9a5969e` scripts and tests derive urgency/importance from TaskNotes tags.

### Outcome

- One authority order; conflicting instructions now have a resolution rule.
- Scripts and views read the plugin's real property names, so filters and bonuses apply to actual notes.
- Context cost of the agent contract dropped while rules gained precedence.

### Decisions

- Repo-specific naming follows TaskNotes defaults rather than custom fields.

## 2026-10-15 — agent TDD rules, session skills, changelog habit

### Why

Agent output was being accepted without evidence. Rules existed as prose, tests were written after the fact, and chat replies were long enough to hide the actual answer. The changelog was updated sporadically, so releases had gaps.

### Did

- `ce6e593` agents update docs and changelog on every commit.
- `b7ba911`, `f98eafc` TDD rules and `tdd` skill guidance in AGENTS; `e46be0c` deletes outdated tdd reference.
- `f06eeff` load `caveman` and `ponytail` at start of coding sessions.
- `cea7196` 50 skills imported from vault library; `e2b22ca` skills copied into claude folder.

### Outcome

- Test-first became the default, with failing tests treated as the work list.
- Compression and minimalism rules cut output volume; TDD and evidence reporting stayed exempt.

### Failed / learned

- The TDD section reached ~89 lines / 1,824 words before the 2026-10-16 cut. Long rules go unread; a rule that needs a page is being enforced by memory, not by the doc.

## 2026-10-15 — Step 3 kickoff, TaskNotes ownership flip

### Goal

Task creation, planning, completion and undo on top of the Step 1 engine.

### Why

Task lifecycle was the next slice of v1. The first attempt built creation and planning inside QuickAdd, which duplicated TaskNotes: two ways to make a task, two status models, two sources of truth for scheduling. Once the overlap was visible, the cheaper design was to let TaskNotes own creation and planning and keep TaskRPG for resolution.

### Did

- `6510c00` task creation, planning, completion and undo scripts plus wrappers.
- `fddaf90` test undo resolution; `d66b987` duplicate guard follows `undo.targetEventId`; `3e17a79`, `3f02549` guard test and shared guard helper.
- `1fbfd90` TaskNotes takes task creation and planning; `22ac4fb`, `9bc050d` remove creation and planning scripts; `dc0d31b`, `def9f1a`, `24c75b5`, `5ee9423`, `6441803` docs follow the ownership change.
- `7f85ee4`, `60d00b9` allow TaskNotes Done status, guard duplicate resolution, preserve note status on undo.
- `376e572`, `bff6d6b` document Step 3 gaps, delete finished `STEP2.md`.

### Outcome

- TaskRPG stopped owning task creation. One UI for making and planning tasks, one for resolving them.
- Duplicate resolution guard keyed on the event log rather than note status, so a re-run cannot double-award.
- Net effect of the build: three scripts deleted, one shared helper introduced, three status/summary decisions later reversed.

### Failed / learned

- Both 2026-10-15 status decisions (allow Done status, preserve status on undo) were reversed on 2026-10-21 by D-024. Ownership was settled only after real TaskNotes behaviour was observed. Cause: designing against an assumed plugin model instead of the installed one.

### Links

- Branch: `feat/3-task-creation-planning-completion-undo`

## 2026-10-14 — Step 2: habit Done button (0.2.0)

### Goal

First in-vault button: press Done on a habit note, get a result.

### Why

The engine worked in a terminal but nothing proved a QuickAdd user script could run in the vault, on a phone, with no `require` and no Obsidian API. That constraint (D-007) decides the whole wrapper architecture, so it had to be tested on the smallest possible slice before tasks.

Habits were also the lowest-friction loop: one press, one toast, no dice (D-011). If the wrapper could not survive that, nothing bigger would.

### Did

- `6ebc158` issue 2 habit Done slice: `Scripts/habit-done.js` QuickAdd user script behind `TaskRPG: Habit Done`. Reads `habitId` and `skill`, asks within-block vs after-block, sets `onTime`, writes event log → habit History → hero note. Cancelling writes nothing. Loads `engine.js` by read/eval, no `require`, phone-capable.
- `84fb89a`, `9c233cc`, `f272874` cover on-time press, late press, cancelled press, no habit note open, QuickAdd command wiring.
- `Engine/Hero.md` derived from log, frontmatter `hp`, `maxHP`, `mp`, `maxMP`, `xp_<skill>`; stable identity stays in `Campaign/00 Hero.md`. Live log is `Engine/Events.md`, one JSON object per line.
- `5470600` PLUGINS doc update; `7e10c9a` gitignore and changelog.
- `57f8125` PR #9 merged 2026-10-15 00:00.

### Outcome

- QuickAdd runs the engine in-vault with read/eval and no Obsidian API, proving the wrapper approach before task code depended on it.
- Write order fixed as event log → habit History → hero note, so a display failure never invents state that the log lacks.
- Test count 45 (43 engine, 2 habit). Desktop and phone press still unverified in a live vault.
- Habit History gave the first visible per-press record, which later made undo's "remove your own line" rule possible.

### Decisions

- `.md` log beats `.jsonl`: `.jsonl` hidden in Obsidian file list.
- Macros write hero note directly; panels stop reading `Engine/State.json`.

### Links

- PR: #9, issue #2
- Tests: `TaskRPG/Scripts/habit-done.test.js`

## 2026-10-14 — Step 1: engine and tests (0.1.0)

### Goal

Deterministic engine runnable from the terminal, no Obsidian dependency.

### Why

Game rules that cannot be tested are guesses. Writing the engine first, with no Obsidian API and no plugin, meant each rule could fail a test before any UI existed, and the same code could later run inside QuickAdd unchanged (D-007). A replay-based event log (D-020) was chosen so undo, correction and audit never rewrite history.

### Did

- `1629395` `Scripts/engine.js` plus settings and state notes, tests, docs, changelog; `914486a` PR #1 merged 08:50.
- Rules: 4:00 AM day rollover; MP refill capped at 10 with size cost, unplanned and Wounded surcharges, skill-level discounts, overdraft halving XP; habit cost tiers across last 30 eligible days; XP bonuses for important, urgent, weekly focus; placeholder level thresholds; 2d6 roll with skill, HP and Tired modifiers; HP restore and missed-deadline cost; rest/pause; per-day settings in force; undo as correcting log line.
- Tests: one per rule, plus settings changes, undo, day boundary, backfill, terminal run, invalid settings, table-driven invalid actions, bad usage exit code, live `Settings.md` validity.
- `404f465`, `f09b7df` delete stray plugin folders, simplify `.gitignore`. `6d25b9b` `gm_bridge.py` moved into `Scripts/` by `git mv`.

### Outcome

- 43 engine tests; every rule has a named failure.
- Replay is deterministic: repeated `recalc` runs produce identical state, which is what makes undo and per-day settings possible later.
- A settings note with an out-of-range value is rejected with the offending key named, so a typo cannot silently change the game.
- Live `Settings.md` is parsed by a test, so the real vault file cannot drift from the schema.
- Terminal usage works with no Obsidian running: `node Scripts/engine.js recalc`.

### Decisions

- One line per action in shared append-only log; replay in timestamp order; back-filled events appended, never inserted.

### Links

- PR: #1
- Tests: `TaskRPG/Scripts/engine.test.js`
