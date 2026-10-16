# TaskRPG Agent Instructions

| When working on               | Open first                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------------ |
| Product behavior/scope        | `docs/PRD.md` (settled decisions §4; build defaults §6; scope §8)                    |
| Current build step / status   | `docs/BUILD_PROMPT.md` and `docs/CHANGELOG.md`                                       |
| Plugin/integration boundaries | `docs/PLUGINS.md`                                                                    |
| Tests/commands/manual checks  | `docs/TESTING.md`                                                                    |
| Engine rules                  | `TaskRPG/Scripts/engine.js`, `engine.test.js`, `task-utils.js`, `task-utils.test.js` |
| Live vault state              | `TaskRPG/Engine/Settings.md`, `Hero.md`, `Events.md`, `State.json`                   |
| Macros                        | `TaskRPG/Scripts/task-done.js`, `habit-done.js`, `undo-last.js`, `gm_bridge.py`      |
| Vault-area rules              | local `AGENTS.md` in `TaskRPG/Campaign/`, `TaskRPG/Journal/`, `TaskRPG/World/`       |

## Source of truth

- Follow [PRD.md](./docs/PRD.md) for product behavior and implementation scope.
- The PRD's **Settled decisions** are requirements. **Leaning** items are not final; **Build defaults** are starting values, not immutable rules. Success metrics are aspirational, and items marked Later, Should-have or Future versions are not v1 requirements.
- If these instructions and the PRD conflict, follow the PRD. Keep this file focused on working rules rather than duplicating the full specification.
- Preserve existing behavior unless the PRD explicitly changes it. Make small, testable changes and verify the affected behavior.
- Product principles, architecture/ownership and game behavior live in the PRD (sections 3, 4.2, 4.3, 4.5-4.12, 4.15, 4.17-4.21, 4.25-4.38). Do not restate them here.

## Session skills

Load both skills below at the start of every coding session, before the first code change or implementation plan. They live in `.agents/skills/`; load them by ID with the skill tool. If a skill cannot be loaded, say so rather than continuing silently without it.

1. **`ponytail`**—pragmatic, minimalist engineering. Reuse over rebuild, root cause over symptom, no speculative scaffolding. It governs _how much_ gets built, not what must be proven.
2. **`caveman`**—compressed communication. Default level `full`; `/caveman lite|full|ultra|off` changes it mid-session.

**A coding session** is any session that reads, writes, reviews or plans engine, script, macro, test or configuration code. It is **not** a coding session when the work is story, canon, character voice, narration, journal content, PRD or prose drafting, hand-made settings or vault-data edits, or pure research and Q&A. Do not load either skill for that work, and drop `caveman` if a coding session turns into it.

Where these skills pull against the rules in this file, this file wins:

- **Compression never overrides the reporting rules here.** The `tdd` skill's _Report_ step, the proven-versus-assumed distinction, failing-run output and the "state options clearly" contract in _Assumptions and risky decisions_ stay in plain prose. The `caveman` skill's own Auto-Clarity rules already exempt security warnings, irreversible actions and multi-step sequences where compression risks misreading; treat a test-evidence report or a decision request as the same case.
- **Everything written to the vault or the repo stays normal prose.** Code, comments, commit messages, `docs/CHANGELOG.md` entries and documentation are never written in caveman style—the `caveman` skill requires this too.
- **"Confirm before implementing" beats ponytail's "ship the lazy version and question it in the same response".** Cut unrequested scope freely, then ask; do not ship a design decision the docs do not settle.
- **Ponytail does not license skipping proof.** Tests, doc sync and changelog updates stay required exactly as described in _Build and test_ and _Test-driven development_ below.

## Build and test

- Keep engine behavior runnable from the terminal without Obsidian. Add or update automated tests for each engine rule changed, including relevant settings, event replay and undo behavior.
- Test macros and Obsidian/mobile integration at the relevant slice; treat untested plugin behavior as an assumption to verify, not a guaranteed capability.
- Keep changes scoped. Update directly related documentation, preserve readable vault data and formatting, and report validation results and unresolved limitations.
- `TaskRPG/Scripts/engine-smoke.js` and the throwaway test log (`TaskRPG/Engine/Test Events.md`) exist for first integration checks and manual tests. Never point one at the live log or an important real task.
- Test file layout, run commands, the rule-to-test table, the boundary cases to cover, and the manual Obsidian checks live in `docs/TESTING.md`. Follow it rather than restating here.

## Test-driven development

Default to test-driven development for anything with engine behavior: write the check first, watch it fail for the right reason, then make it pass. **Load the `tdd` skill before the first test or engine change in a coding session.** `docs/TESTING.md` is this project's how-to: the practical order of operations, the run commands, the rule-to-test table and the manual checks.

The invariants that hold whether or not the skill is loaded—never weakening a test, failing tests as the to-do list, reporting honestly what is proven, regression tests first—live in the `tdd` skill. Do not restate them here. Where the `tdd` skill and this file disagree, this file wins and the skill is corrected.

Not for prose, story, canon, documentation or hand-made settings edits—nothing to assert; get the docs in sync instead.

## Documentation, changelog and doc drift

- **Decision log.** Run `/log-decision` whenever a new decision warrants being added to the PRD (the main decision doc): decision, rationale, alternatives, implications. File it before the change is assumed settled.
- **Doc sync before release/PR.** Always run `/update-docs` before each release or before opening a new PR.
- **README is protected.** Do not touch `README.md` unless the information already there is contradictory or outdated compared to the repo. When it is out of date, correct it rather than adding new sections; do not expand README opportunistically.
- **Update CHANGELOG.md on every commit.** Every time you make a commit, invoke the `/update-changelog` skill. A commit that adds tests for a feature that is not built yet says so in its changelog line; do not claim behaviour that does not exist.
- **Document decisions and limitations.** If you change a documented rule, behavior, architecture, public API, or plugin mapping, explicitly record it in docs. Note known limitations, validation status, and any follow-ups.
- **No silent drift.** If you're unsure whether a doc needs updating, update it or call it out in the commit/PR notes.

## Safety and care

- Ask before deleting or moving many files, pruning records, or making broad vault restructures.
- Do not delete or rewrite event history to correct an action; use the engine's undo/correction mechanism.
- Never expose API keys or credentials. Do not imply that any vault content is private from an AI provider.

## Assumptions and risky decisions

- **Confirm before implementing.** If you need to make any risky assumption or design/implementation decision that is not already answered by the repo's documentation (PRD, AGENTS, README, TESTING, etc.) or inline comments, stop and confirm with the user before implementing.
- **State options clearly.** When asking, include context, the assumption/decision, alternatives considered, tradeoffs, and your recommended approach.
- **Don't guess silently.** If the documentation is ambiguous or missing, ask rather than inventing behavior. Preserve existing behavior unless the PRD explicitly changes it.
- **Verify untested integrations.** Treat untested plugin behavior (QuickAdd, Meta Bind, TaskNotes, Vault Operator, Dice Roller, Templater) as assumptions to verify, not guarantees.
