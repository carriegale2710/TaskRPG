# TaskRPG Agent Instructions

## Authority

1. `docs/PRD.md` is the source of truth for product behavior, architecture, ownership, and v1 scope.
2. This file governs how agents work in this repository.
3. `docs/TESTING.md` governs test layout, commands, coverage expectations, and manual checks.
4. Project skills under `.agents/skills/` govern optional workflow behavior.
5. If sources conflict: PRD > this file > `docs/TESTING.md` > skills.
6. Safety, confirmation, test-evidence, and decision-request rules always use clear prose.

## Session skills

If the agent supports project skills:

- If available, load `caveman` at start of every session. Stop only if user says so.
- If available, load `ponytail` writing, refactoring code or brainstorming solutions or ideas to solve user problems.
- Load `write-tests` before the first test or engine change.
- If a required skill cannot load, say so and continue without silently skipping the underlying rule.

Skills never override the PRD, this file, safety rules, test evidence, or confirmation requirements.

## Safety

- Never expose API keys, tokens, or credentials.
- Do not imply vault content is private from an AI provider.
- Ask before deleting or moving more than three files, pruning records, or restructuring the vault.
- Do not touch the user's other notes; stay inside the TaskRPG folders defined in PRD 4.15.
- Never delete or rewrite event history to correct an action; use the engine’s undo/correction mechanism.
- Treat every plugin integration listed in `docs/PLUGINS.md` as an assumption to verify until `docs/TESTING.md` records a result.
- Never point `engine-smoke.js` or the throwaway test log at the live event log or important real tasks.
- Treat `State.json` and `Events.md` as live state: do not edit them manually to correct behavior; use the engine’s undo/correction mechanism.

## Before coding

- Read all of `docs/PRD.md` before writing or changing code.
- Implement only PRD “Settled decisions” for v1.
- Treat “Leaning items” as non-final, “Build defaults” as starting values, and Later/Should-have/Future items as out of scope.
- Read the affected code before proposing or making changes.
- If code contradicts the PRD, stop. Report:
  - PRD section/rule
  - Current code behavior
  - Exact conflict
  - Options
  - Recommended resolution
- Wait for the user’s decision before changing behavior.
- Confirm before implementing any risky assumption or design decision not settled by the PRD, this file, `docs/TESTING.md`, or inline comments.
- When asking, include context, the decision needed, alternatives, tradeoffs, and a recommendation.

## Coding rules

- Make the smallest testable change that satisfies the PRD.
- Work in small steps: finish one step, say what to press to try it, and wait for the user before continuing.
- Preserve existing behavior unless the PRD explicitly changes it.
- Keep engine behavior runnable from the terminal without Obsidian.
- Use test-driven development for engine behavior: write the failing test first, confirm it fails for the right reason, then implement.
- Add or update tests for every changed engine rule, including settings, event replay, and undo behavior where relevant.
- Never weaken a test to make a change pass.
- Treat failing tests as the work list.
- Report what is proven by test output separately from what is assumed or manually checked.
- Follow `docs/TESTING.md` for commands, test locations, rule-to-test mapping, boundary cases, and manual Obsidian checks.

## Documentation

- Read `docs/DOCUMENTATION.md` for details on repository structure, where information belongs, doc file responsibilities, clear separation of concerns, and doc file starter templates.
- Run `/log-decision` when a new decision should be recorded in the PRD.
- Run `/update-docs` before every release and before opening a PR.
- Update directly related documentation in the same change.
- Update `CHANGELOG.md` on every commit.
- Do not claim behavior that does not exist; label test-only changes as test-only.
- Record changes to rules, behavior, architecture, public APIs, plugin mappings, limitations, validation status, and follow-ups.
- Do not edit `README.md` unless its existing content is contradictory or outdated; correct it rather than expanding it.
