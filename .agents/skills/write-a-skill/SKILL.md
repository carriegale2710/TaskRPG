---
name: write-a-skill
description: Creates a new agent skill file right now. Use when the user says
  "create a skill", "write a skill", or "make a skill for X". For skill-writing
  methodology and TDD philosophy, see /writing-skills instead.
metadata:
  copilot-enabled-agents: codex,opencode,claude
---

# Write a Skill

## Process

1. **Gather requirements** — ask the user about:
   - What task/domain does the skill cover?
   - What specific use cases should it handle?
   - Any reference materials to include?

2. **Draft the skill** — write a single `<name>.md` file. If content would exceed ~150 lines, split into `<name>.md` (main) and `<name>-reference.md` (extended reference), with a pointer from the main file to the reference (see `frontend-design.md` + `frontend-design-reference.md` as the model).

3. **Review with user** — present the draft and ask:
   - Does this cover your use cases?
   - Anything missing or unclear?

4. **Deliver** — write the final file to `output/<name>.md` using `execute_code` so the user can download and upload it to their Space.

> **Note:** Space files are flat — skills live directly as `<name>.md`, not inside a subdirectory. Do not create a `skill-name/` folder structure.

## SKILL.md Template

```md
---
name: skill-name
description: Brief description. Use when [specific triggers].
---

# Skill Name

## Quick start
[Minimal working example]

## Workflows
[Step-by-step processes]

## Advanced features
[Link to separate reference file if needed]
```

## Description Requirements

The description is **the only thing the agent sees** when deciding which skill to load.

- Max 1024 chars
- Write in third person
- First sentence: what it does
- Second sentence: "Use when [specific triggers]"
- Describes ONLY triggering conditions — never summarizes the skill's workflow

## Review Checklist

- [ ] Description includes triggers ("Use when...")
- [ ] Main file under 150 lines; extended content in a `-reference.md` sibling
- [ ] No time-sensitive info
- [ ] Consistent terminology
- [ ] Concrete examples included
- [ ] Delivered to `output/<name>.md` for the user to upload
