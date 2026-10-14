---
name: to-issues
description: Break a plan, spec, or PRD into independently-grabbable issues on
  the project issue tracker using tracer-bullet vertical slices.
disable-model-invocation: true
metadata:
  copilot-enabled-agents: codex,opencode,claude
---

# To Issues

Break a plan into independently-grabbable issues using vertical slices (tracer bullets).

## Process

### 1. Gather context

Work from whatever is already in the conversation context. If the user passes an issue reference as an argument, fetch it from the issue tracker.

### 2. Explore the codebase (optional)

If you have not already explored the codebase, do so. Issue titles and descriptions should use the project's domain glossary vocabulary.

### 3. Draft the issues

Break the plan into **tracer bullet** issues following the **Vertical slice rules** below.

### 4. Quiz the user

Present the proposed breakdown as a numbered list. For each slice, show:

- **Title**: short descriptive name
- **Blocked by**: which other slices must complete first
- **User stories covered**: which user stories this addresses

Iterate until the user approves the breakdown.

### 5. Publish to the issue tracker

Publish in dependency order (blockers first). Link each slice to its parent as a native sub-issue where supported.

## Vertical slice rules

Each issue is a thin vertical slice that cuts through ALL integration layers end-to-end:

- Each slice delivers a narrow but COMPLETE path through every layer (schema, API, UI, tests)
- A completed slice is demoable or verifiable on its own

## Issue body template

```
## What to build

A concise description of this vertical slice.

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Blocked by

- None - can start immediately
```
