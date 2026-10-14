# Skill Template

## Goal

[Clear, concise statement of what this skill does. One or two sentences.]

## Steps

[Ordered, numbered steps the agent performs. Each step should:

- Start with an action verb
- End with a clear completion criterion
- Be testable and deterministic
  ]

1. [First step with completion criterion]
2. [Second step with completion criterion]
3. [Continue as needed]

## Reference

[Optional: definitions, rules, facts consulted on demand. Use for:

- Key terms and leading words
- Rules or constraints
- Decision criteria
- Common patterns
  ]

### Leading Words

[Define any compact concepts or terms that anchor agent behavior. These are tokens that recruit priors from pretraining.]

### Rules

[List any hard constraints or invariants the skill enforces.]

## Common Mistakes

[What goes wrong when agents use this skill incorrectly, and how to fix it.]

## Examples

[Optional: concrete examples of the skill in action, showing before/after or correct usage.]

---

## Writing Guidelines

### Frontmatter Fields

**Required:**

- `name`: Lowercase with hyphens, must match the directory name (e.g., `name: assumptions` for `assumptions/SKILL.md`)
- `description`: Third-person, starts with "This skill should be used when the user asks to...", includes trigger phrases in quotes, max 1024 chars

**Recommended:**

- `user-invocable`: `true` if users should be able to call this skill with `/name` slash command

#### Complete Frontmatter Example

Here is a complete, copy-pasteable example showing all fields together:

```yaml
---
name: assumptions
description: This skill should be used when the user asks to "list assumptions", "surface assumptions", or needs to explicitly state assumptions before proceeding.
user-invocable: true
---
```

### File Structure

**Minimum viable skill:**

```
skill-name/
└── SKILL.md
```

**Full skill with progressive disclosure:**

```
skill-name/
├── SKILL.md              # Main instructions (keep under 2000 words)
├── references/           # Detailed reference material
│   ├── leading-words.md
│   └── rules.md
├── examples/             # Usage examples
│   └── basic.md
└── scripts/              # Executable scripts (optional)
    └── setup.sh
```

### Progressive Disclosure

**Keep SKILL.md concise:**

- Target: under 2000 words
- Move detailed reference material to `references/` folder
- Reference external files inline: "See [references/leading-words.md](references/leading-words.md) for details"

**Example pattern:**

```
### Leading Words

- **Assumption**: A statement taken to be true without verification.
- **High-risk assumption**: An assumption that would invalidate your approach if false.

See [references/leading-words.md](references/leading-words.md) for extended definitions and examples.
```

**When to disclose:**

- Inline: What every branch needs
- Behind pointer: What only some branches reach
- Separate file: Reference material that's consulted on demand

### Information Hierarchy

1. **Steps** are primary — what the agent does, in order
2. **In-file reference** — consulted on demand (definitions, rules, facts)
3. **Disclosed reference** — lives in `references/`, reached by context pointer

### Completion Criteria

Each step must end on a criterion that is:

- **Clear**: can the agent tell done from not-done?
- **Demanding**: requires thorough work, not just surface compliance
- **Checkable**: observable and verifiable

### Pruning

- **Single source of truth**: one authoritative place per meaning
- **No no-ops**: delete lines the model already obeys by default
- **Positive framing**: state what to do, not what to avoid (unless hard guardrail)
- **Leading words**: use compact tokens that recruit pretrained priors

### Testing (TDD for Skills)

Before deploying a skill:

1. Run pressure scenarios WITHOUT the skill — document baseline failures
2. Write the skill to address those specific failures
3. Run same scenarios WITH the skill — verify compliance
4. Refactor to close new loopholes agents find

**No skill without a failing test first.**
