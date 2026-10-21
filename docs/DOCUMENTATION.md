# TaskRPG Documentation Guide

## Scope

This file governs **how** documentation is written: each file's job, what belongs in it, and the templates to follow. It also governs where **new** documentation goes.

It does not list where to find existing information. That is in `AGENTS.md` ("Repository map" and "Where to find information").

## File responsibilities

| File                   | Single responsibility                   | Contains                                                                                                                              | Does not contain                                                      |
| ---------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `README.md`            | First-time introduction and setup       | Project purpose, user value, core features, requirements, setup, basic usage, links                                                   | Full product spec, agent rules, architecture detail, build status     |
| `AGENTS.md`            | Agent working contract                  | Authority order, workflow rules, safety rules, file map                                                                               | Product specification or user onboarding                              |
| `CHANGELOG.md`         | Change history                          | Dated change entries (Added/Changed/Fixed/Removed)                                                                                    | Current status, done/not-done steps, known gaps, plans, product rules |
| `docs/BUILD_PLAN.md`   | How to build TaskRPG and current status | Mini roadmap, milestones, build order, step-by-step instructions, acceptance criteria, dependencies, done/not-done status, known gaps | Ad-hoc todos outside the build, change history                        |
| `docs/PRD.md`          | What TaskRPG must do                    | Product behavior, game rules, scope, settled decisions, success criteria                                                              | Implementation order or current status                                |
| `docs/ARCHITECTURE.md` | How the system is structured            | Event/state model, engine ownership, module boundaries, storage, plugin permissions, invariants                                       | Product roadmap or build sequence                                     |
| `docs/DECISIONS.md`    | Why choices were made                   | Accepted/provisional/superseded decisions, rationale, alternatives, implications                                                      | Current status or implementation steps                                |
| `docs/PLUGINS.md`      | Plugin integration reference            | Plugin stack, responsibilities, permissions, integration constraints                                                                  | General architecture or product behavior                              |
| `docs/TESTING.md`      | How to verify the build                 | Commands, test layout, rule-to-test mapping, boundary cases, manual checks                                                            | Product rules, architecture decisions, status updates                 |
| `docs/DOCUMENTATION.md`| How documentation is written            | File responsibilities, writing rules, templates, placement of new documentation                                                       | Any project content (rules, status, design, history)                  |

## Where to place new documentation

Reuse before creating. Most documentation work belongs in a file that already exists.

1. **Match the content to an existing responsibility.** If the new material is a rule, status, test note, decision, or change, add it to that file (see the table above). Do not create a new file.
2. **One responsibility per file.** Create a new file only when the content has a job no current file owns.
3. **Put it in `docs/`** when it is a specification, contract, decision log, or test/verification guide. Repository-level guides (`README.md`, `AGENTS.md`, `CHANGELOG.md`) stay at the root. Narrative and vault-area content stays under `TaskRPG/` per the PRD ownership rules.
4. **Name for the job.** `docs/` files use `UPPER_SNAKE.md` and a name that states the responsibility (`PRD`, `ARCHITECTURE`, `DECISIONS`, `BUILD_PLAN`, `PLUGINS`, `TESTING`). Do not add version, date, or author suffixes.
5. **Give every new file a purpose line.** Title, then one sentence stating what it is for and what it is not for.
6. **Register it in `AGENTS.md` in the same change.** Add the file to the "Repository map" tree and to the "Where to find information" table. A document no one is pointed to does not exist.
7. **Link, do not copy.** Point to the owning file instead of restating its content elsewhere.
8. **Do not create a document for a one-off note.** Park disposable material in `TaskRPG/Backlog/` or record the change in `CHANGELOG.md`.

## README.md

`README.md` is the repository’s main landing page. It introduces TaskRPG to someone who knows nothing about it, explains its main purpose, and shows how to set it up and run it.

It is written for a first-time reader, not for the AI agent. Agent-specific rules belong in `AGENTS.md`; detailed product rules belong in `docs/PRD.md`.

### README responsibilities

| Contains                                     | Does not contain           |
| -------------------------------------------- | -------------------------- |
| One-paragraph project introduction           | Full product specification |
| Main purpose and user value                  | Complete game rules        |
| Who it is for                                | Agent workflow rules       |
| Core features at a glance                    | Detailed architecture      |
| Screenshot or demo placeholder, if available | Test coverage details      |
| Requirements                                 | Decision history           |
| Installation and setup steps                 | Current build status       |
| How to run TaskRPG                           | Mini todos                 |
| Basic usage flow                             | Full plugin reference      |
| Links to detailed docs                       | Implementation plan        |

### README template

```md
# TaskRPG

TaskRPG turns your real-life tasks, habits, and projects into a lightweight
role-playing game inside Obsidian. Completing meaningful work earns resources,
advances your character, and helps you make progress on long-term goals.

## Why TaskRPG

TaskRPG is for people who want more motivation and structure around their
tasks without turning productivity into another complicated app.

It connects everyday work to a simple RPG loop:

- Complete tasks and habits
- Earn resources and progress
- Face projects, quests, and bosses
- Review progress through your vault

## Core features

- Task and habit tracking with RPG rewards
- Event-based progress history
- Hero progression and resources
- Projects, arcs, quests, and bosses
- Morning briefing and reminders
- Undo and correction support
- Obsidian integration through macros and plugins

## Requirements

- Obsidian
- [Add required Obsidian plugins]
- [Add required runtime, e.g. Node.js version]
- [Add any other requirement]

## Setup

1. Install Obsidian.
2. Create or open your vault.
3. Copy the `TaskRPG/` folder into your vault.
4. Install and enable the required plugins.
5. Enable community plugins if prompted.
6. Open the TaskRPG settings note and configure your hero and preferences.
7. Run the engine smoke check: `node TaskRPG/Scripts/engine-smoke.js`
8. Start using TaskRPG from your daily notes or task lists.

## How it works

TaskRPG records meaningful actions as events. The engine derives your current
hero state from that event history, so progress remains auditable and
correctable without rewriting history.

For a deeper explanation, see:

- [Product requirements](docs/PRD.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Decision log](docs/DECISIONS.md)
- [Testing](docs/TESTING.md)
- [Plugins](docs/PLUGINS.md)
- [Changelog](CHANGELOG.md)

## Status

TaskRPG is under active development.

See [`CHANGELOG.md`](CHANGELOG.md) for current status, recent changes, and
remaining work.

## License

[Add license information or state that the project is private/unlicensed.]
```

### README rules

- Keep the README focused on first-time orientation and setup.
- Do not duplicate the PRD, architecture, testing, or plugin documentation.
- Link to detailed docs instead of copying them.
- Keep setup steps exact and testable.
- If a setup step cannot yet be completed, mark it clearly as not yet implemented.
- Update the README only when installation, usage, project purpose, or linked documentation changes.

## CHANGELOG

Run `/changelog` skill to update CHANGELOG.md, template is given by skill. `CHANGELOG.md` is change history only: record meaningful code changes, tests, and documentation updates. Multiple small commits may be summarized as one dated entry. Keep current status, done/not-done steps, and known gaps out of this file; those live in `docs/BUILD_PLAN.md`.

## BUILD_PLAN.md

`docs/BUILD_PLAN.md` is the implementation plan for building TaskRPG. It contains a short roadmap for orientation and a detailed build order for execution.

### BUILD_PLAN.md responsibilities

| Section      | Purpose                   | Contains                                                     | Does not contain                             |
| ------------ | ------------------------- | ------------------------------------------------------------ | -------------------------------------------- |
| Roadmap      | High-level sequence       | 5–7 milestones, one-line outcome each                        | Individual tasks, files, acceptance criteria |
| Objective    | Implementation goal       | v1 objective and source-document links                       | Current status (see Build status)            |
| Build order  | Execution source of truth | Ordered milestones, steps, dependencies, acceptance criteria | Ad-hoc todos, change history                 |
| Build status | Current progress          | Done/not-done per step, known gaps, validation status        | Change history                               |

### BUILD_PLAN.md template

```md
# TaskRPG Build Plan

## Roadmap

1. **Engine foundation** — event log, state derivation, undo, terminal tests
2. **Core task loop** — tasks, habits, rewards, macros
3. **Progression** — hero, skills, projects, arcs, quests
4. **Visibility** — morning briefing, quest board, reminders
5. **Polish and release** — settings, edge cases, documentation, validation

The detailed build order below is the source of truth for implementation sequence.

## Objective

Build TaskRPG v1 according to `docs/PRD.md`, using the architecture in
`docs/ARCHITECTURE.md` and respecting decisions in `docs/DECISIONS.md`.

## Build order

### Milestone 1 — Engine foundation

1. Implement append-only event log.
2. Implement hero-state derivation from events.
3. Add undo/correction support.
4. Add terminal-run engine tests.

**Acceptance criteria**

- Engine runs without Obsidian.
- Every engine rule has an automated test.
- Undo restores prior state without rewriting event history.

### Milestone 2 — Core task loop

1. Implement task completion events.
2. Implement habit completion and HP effects.
3. Add macro integrations.
4. Add regression tests for replay and undo.

**Acceptance criteria**

- [Testable outcome]
- [Testable outcome]
```

### BUILD_PLAN.md rules

- Keep the Roadmap to 5–7 milestones.
- Each Roadmap milestone must be one line: name plus main outcome.
- Use the Roadmap to understand the high-level sequence.
- Use **Build order** as the source of truth for what to implement next.
- Do not treat the Roadmap as a task list.
- Follow milestone order unless the user explicitly changes it.
- Record step completion and current status in the **Build status** section of `docs/BUILD_PLAN.md`; keep `CHANGELOG.md` to change history.
- Update the **Build status** section whenever done/not-done status, known gaps, or validation status changes.
- If implementation reveals a PRD, architecture, or decision conflict, stop and ask.

## Decision log format

Use one `docs/DECISIONS.md`, newest first.

```md
# Decision Log

Newest first. A decision remains active until marked `Superseded`.

## D-001 — [Decision title]

- **Status:** Accepted | Provisional | Superseded
- **Date:** YYYY-MM-DD
- **Decision:** [What was decided]
- **Context:** [Problem or constraint]
- **Rationale:** [Why this option won]
- **Alternatives considered:** [Options and why rejected]
- **Implications:** [What this requires or prevents]
- **Revisit when:** [Condition that would justify revisiting]
```

Decision statuses:

- **Accepted** — settled; agents must follow it.
- **Provisional** — reasonable default, explicitly revisable.
- **Superseded** — no longer active; link to the replacing decision.

## PRD rationale pattern

Keep the PRD as current truth. Keep short rationale beside settled decisions, and link full rationale to the decision log.

```md
### MP budget

Users gain MP from completed tasks and spend it on rewards.

**Settled:** MP is earned only through completed tasks.

Rationale: see [D-004 — MP economy](./DECISIONS.md#d-004--mp-economy).
```
