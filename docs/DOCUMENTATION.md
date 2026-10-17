# TaskRPG Documentation Structure

## Decision

Use this documentation structure:

- `README.md` — main landing page, project introduction, and setup guide
- `AGENTS.md` — agent working rules, authority order, file map, safety rules
- `CHANGELOG.md` — change history only
- `docs/BUILD_PLAN.md` — mini roadmap, full implementation plan, milestones, build order, acceptance criteria, and build status (done vs not done)
- `docs/PRD.md` — product behavior, game rules, scope, settled decisions, success criteria
- `docs/ARCHITECTURE.md` — system structure, data model, ownership, boundaries, invariants
- `docs/DECISIONS.md` — decision log, rationale, alternatives, implications, status
- `docs/PLUGINS.md` — plugin and integration boundaries
- `docs/TESTING.md` — test commands, layout, rule-to-test mapping, manual checks

## Repository layout

```text
/
├── AGENTS.md
├── README.md
├── CHANGELOG.md
├── LICENSE
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── DECISIONS.md
│   ├── BUILD_PLAN.md
│   ├── PLUGINS.md
│   └── TESTING.md
└── TaskRPG/
    ├── Scripts/
    └── Engine/
```

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

## AGENTS.md file map

```md
## File map

Open the relevant file before working on that area.

| Need                                            | File(s)                                                                              |
| ----------------------------------------------- | ------------------------------------------------------------------------------------ |
| Project introduction and setup                  | `README.md`                                                                          |
| Product behavior, scope, settled decisions      | `docs/PRD.md`                                                                        |
| System structure, data, ownership, invariants   | `docs/ARCHITECTURE.md`                                                               |
| Why a decision was made; alternatives; status   | `docs/DECISIONS.md`                                                                  |
| Build roadmap, implementation plan, build order | `docs/BUILD_PLAN.md`                                                                 |
| Current status, done/not-done steps             | `docs/BUILD_PLAN.md`                                                                 |
| Change history                                  | `CHANGELOG.md`                                                                       |
| Plugin and integration boundaries               | `docs/PLUGINS.md`                                                                    |
| Test commands, layout, manual checks            | `docs/TESTING.md`                                                                    |
| Engine implementation and tests                 | `TaskRPG/Scripts/engine.js`, `engine.test.js`, `task-utils.js`, `task-utils.test.js` |
| Live vault state                                | `TaskRPG/Engine/Settings.md`, `Hero.md`, `Events.md`, `State.json`                   |
| Macros and integrations                         | `TaskRPG/Scripts/task-done.js`, `habit-done.js`, `undo-last.js`, `gm_bridge.py`      |
| Vault-area rules                                | `AGENTS.md` in `TaskRPG/Campaign/`, `TaskRPG/Journal/`, `TaskRPG/World/`             |
```

## AGENTS.md build workflow

```md
## Build workflow

Before starting or resuming implementation:

1. Read `docs/PRD.md`.
2. Read `docs/ARCHITECTURE.md`.
3. Read relevant entries in `docs/DECISIONS.md`.
4. Read `docs/BUILD_PLAN.md` for the roadmap, milestone sequence, detailed build order, and Build status.
5. Read `CHANGELOG.md` for recent changes.
6. Read `docs/TESTING.md` before writing or changing tests.

After completing a unit of work:

- Update the **Build status** section of `docs/BUILD_PLAN.md` with progress, known gaps, and validation status.
- Update `CHANGELOG.md` with the change.
```

## AGENTS.md engine-change rule

```md
## Engine changes

Before changing engine behavior, read:

1. `docs/PRD.md`
2. `docs/ARCHITECTURE.md`
3. Relevant entries in `docs/DECISIONS.md`
4. `docs/BUILD_PLAN.md`
5. `CHANGELOG.md`
6. `docs/TESTING.md`

Do not change architecture boundaries or supersede a decision without user confirmation.
```

## AGENTS.md README rule

```md
## README

`README.md` is the first-time reader landing page.

- Use it to explain what TaskRPG is, who it is for, and how to set it up.
- Do not use it for agent rules, detailed product rules, architecture, testing procedures, or current build status.
- Link to `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, `docs/PLUGINS.md`, `docs/TESTING.md`, and `CHANGELOG.md`.
- Update it only when installation, usage, project purpose, or linked documentation changes.
```
