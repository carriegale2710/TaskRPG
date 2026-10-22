# TaskRPG Documentation Guide

## Scope

How documentation is written: each file's job, writing rules, templates, and where new documentation goes. Finding existing information is `AGENTS.md` ("Repository map", "Where to find information").

## File responsibilities

| File                    | Job                   | Contains                                                       | Never contains                                     |
| ----------------------- | --------------------- | -------------------------------------------------------------- | -------------------------------------------------- |
| `README.md`             | First-time setup      | Purpose, value, features, requirements, setup, basic usage     | Full spec, agent rules, architecture, build status |
| `AGENTS.md`             | Agent contract        | Authority, workflow, safety, file map                          | Product spec, onboarding                           |
| `CHANGELOG.md`          | Change history        | Dated Added/Changed/Fixed/Removed entries                      | Status, gaps, plans, rules                         |
| `docs/BUILD_PLAN.md`    | Build order and state | Roadmap, steps, acceptance criteria, done/not-done, gaps       | Ad-hoc todos, change history                       |
| `docs/PRD.md`           | What TaskRPG must do  | Behavior, rules, scope, settled decisions, success criteria    | Build order, current status                        |
| `docs/ARCHITECTURE.md`  | How the system works  | Event/state model, ownership, boundaries, storage, invariants  | Roadmap, build sequence                            |
| `docs/DECISIONS.md`     | Why choices were made | Decision, context, rationale, alternatives, implications       | Status, implementation steps                       |
| `docs/PLUGINS.md`       | Plugin reference      | Stack, roles, permissions, integration constraints             | General architecture, product behavior             |
| `docs/TESTING.md`       | How to verify         | Commands, test layout, rule map, manual checks                 | Product rules, decisions, status                   |
| `docs/DOCUMENTATION.md` | How docs are written  | Responsibilities, writing rules, templates, placement          | Project content                                    |

## Where new documentation goes

Reuse before creating.

1. Match content to an existing responsibility. Rules, status, tests, decisions and changes go in their file. No new file.
2. New file only when the content has a job no current file owns.
3. Specs, contracts, decision logs and test guides go in `docs/`. Root guides (`README.md`, `AGENTS.md`, `CHANGELOG.md`) stay at root. Narrative and vault content stays under `TaskRPG/` (PRD ownership).
4. `docs/` names: `UPPER_SNAKE.md`, job-stating (`PRD`, `ARCHITECTURE`, `DECISIONS`, `BUILD_PLAN`, `PLUGINS`, `TESTING`). No version, date or author suffix.
5. Every new file opens with a purpose line: title, then one sentence on what it is and is not for.
6. Register it in `AGENTS.md` in the same change: repository map and information table.
7. Link, do not copy.
8. No document for a one-off note. Park it in `TaskRPG/Backlog/` or record it in `CHANGELOG.md`.

## README.md

Landing page for a first-time reader: what TaskRPG is, why it exists, requirements, setup. Agent rules belong in `AGENTS.md`; product rules in `docs/PRD.md`.

### Contains

- One-paragraph introduction
- Purpose and user value
- Who it is for
- Core features
- Screenshot or demo placeholder
- Requirements
- Installation and setup steps
- Basic usage flow
- Links to detailed docs

### Never contains

Full spec, complete game rules, agent workflow, architecture detail, test coverage, decision history, build status, mini todos, plugin reference, implementation plan.

### Template

```md
# TaskRPG

[One paragraph: what it is and what it gives the user.]

## Why TaskRPG

[Problem and promise, two or three sentences.]

## Core features

- [Feature]

## Requirements

- [Requirement]

## Setup

1. [Exact, testable step]

## How it works

[Short loop description.] Links: [PRD](docs/PRD.md), [Architecture](docs/ARCHITECTURE.md), [Decisions](docs/DECISIONS.md), [Testing](docs/TESTING.md), [Plugins](docs/PLUGINS.md), [Changelog](CHANGELOG.md).

## Status

[One line.] See [CHANGELOG.md](CHANGELOG.md).

## License

[Licence or "private".]
```

### Rules

- First-time orientation and setup only. Do not duplicate PRD, architecture, testing or plugins.
- Setup steps exact and testable. Mark unimplemented steps clearly.
- Touch the README only when install, usage, purpose or linked docs change.

## CHANGELOG

Run `/changelog`. Change history only: meaningful code, test and doc changes, one dated entry may cover several commits. Current status, gaps and plans belong in `docs/BUILD_PLAN.md`.

## BUILD_PLAN.md

Short roadmap for orientation, detailed build order for execution.

| Section      | Purpose             | Contains                                       | Never contains    |
| ------------ | ------------------- | ---------------------------------------------- | ----------------- |
| Roadmap      | High-level sequence | 5–7 milestones, one outcome line each          | Tasks, files, criteria |
| Objective    | Goal                | v1 objective and source links                  | Status            |
| Build order  | Execution truth     | Ordered steps, dependencies, acceptance criteria | Ad-hoc todos, history |
| Build status | Current progress    | Done/not-done per step, gaps, validation       | Change history    |

### Template

```md
# TaskRPG Build Plan

## Roadmap

1. **[Milestone]** — [one-line outcome]

## Objective

Build TaskRPG v1 per `docs/PRD.md`, `docs/ARCHITECTURE.md` and `docs/DECISIONS.md`.

## Build order

### Milestone 1 — [Name]

1. [Step]

**Acceptance criteria**

- [Testable outcome]

## Build status

[Done/not-done table, gaps, validation status.]
```

### Rules

- Roadmap: 5–7 milestones, one line each. Not a task list.
- Build order is the implementation source of truth. Follow milestone order unless the user changes it.
- Record completion, gaps and validation only in Build status.
- Stop and ask on a PRD, architecture or decision conflict.

## Decision log format

One `docs/DECISIONS.md`, newest first.

```md
## D-001 — [Title]

- **Status:** Accepted | Provisional | Superseded
- **Date:** YYYY-MM-DD
- **Decision:** [What was decided]
- **Context:** [Problem or constraint]
- **Rationale:** [Why this option won]
- **Alternatives considered:** [Options and why rejected]
- **Implications:** [What this requires or prevents]
- **Revisit when:** [Trigger]
```

Statuses: **Accepted** (settled, agents follow it), **Provisional** (revisable default), **Superseded** (inactive; link replacement).

## PRD rationale pattern

PRD holds current truth plus short rationale; full reasoning lives in the decision log.

```md
### MP budget

**Settled:** MP is earned only through completed tasks.

Rationale: [D-004](./DECISIONS.md#d-004--mp-economy).
```
