---
name: write-a-plan
description: Use when you have a spec or requirements for a multi-step task, before touching code
---

# Writing Plans

## Overview

Write comprehensive implementation plans assuming the engineer has zero context for the codebase and questionable taste. Document everything they need to know: which files to touch for each task, code, testing, docs they might need to check, how to test it. Give them the whole plan as bite-sized tasks. DRY. YAGNI. TDD. Frequent commits.

**Save plans to:** Follow the `MEMORY_ENGINE.md` B.2 convention — write to the sandbox as `PLAN.md` (archiving any existing plan to `plans/PLAN-NNN.md` first). Also commit a copy to the repo under the project's existing plan convention (e.g. `docs/plans/`, `docs/superpowers/plans/`, `plans/`). If no convention exists, use `docs/plans/YYYY-MM-DD-<feature-name>.md`.

## Scope Check

If the spec covers multiple independent subsystems, suggest breaking this into separate plans — one per subsystem. Each plan should produce working, testable software on its own.

## File Structure

Before defining tasks, map out which files will be created or modified and what each one is responsible for.

- Design units with clear boundaries and well-defined interfaces.
- Prefer smaller, focused files over large ones that do too much.
- Files that change together should live together.

## Task Right-Sizing

A task is the smallest unit that carries its own test cycle and is worth a fresh reviewer's gate. Each task ends with an independently testable deliverable.

## Bite-Sized Task Granularity

**Each step is one action (2-5 minutes):**

- "Write the failing test" — step
- "Run it to make sure it fails" — step
- "Implement the minimal code to make the test pass" — step
- "Run the tests and make sure they pass" — step
- "Commit" — step

## Plan Document Header

**Every plan MUST start with this header:**

```markdown
# [Feature Name] Implementation Plan

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about approach]

**Tech Stack:** [Key technologies/libraries with versions confirmed from registry]

**Spec:** [path or GitHub issue URL this plan implements]

## Global Constraints

[Project-wide requirements — version floors, dependency limits, naming rules — one line each.]

---
```

## Task Structure

```markdown
### Task N: [Component Name]

**Files:**

- Create: `exact/path/to/file.py`
- Modify: `exact/path/to/existing.py:123-145`
- Test: `tests/exact/path/to/test.py`

**Interfaces:**

- Consumes: [what this task uses from earlier tasks]
- Produces: [what later tasks rely on]

- [ ] **Step 1: Write the failing test**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Write minimal implementation**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit via GitHub MCP `push_files`**
```

## No Placeholders

Every step must contain the actual content an engineer needs. Never write:

- "TBD", "TODO", "implement later"
- "Add appropriate error handling"
- "Write tests for the above" (without actual test code)
- Steps that describe what to do without showing how
