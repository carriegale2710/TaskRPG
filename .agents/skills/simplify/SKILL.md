---
name: simplify
description: This skill should be used when the user asks to "keep it simple",
  "simplify this", "avoid over-engineering", or notices complexity creeping in
  and wants to choose the simplest viable approach.
user-invocable: true
metadata:
  copilot-enabled-agents: codex,opencode,claude
---

# Simplify Skill

## Goal

Keep solutions as simple as possible while still meeting requirements. Resist unnecessary complexity.

## Steps

1. **Identify the core requirement** — what is the minimum this solution must accomplish?
2. **List candidate approaches** — what are the different ways you could solve this?
3. **Rank by simplicity** — which approach has the fewest moving parts, dependencies, and edge cases?
4. **Check for over-engineering** — are you adding complexity for hypothetical future needs? Strip it out.
5. **Validate simplicity doesn't sacrifice correctness** — ensure the simple solution still meets all requirements.
6. **Document the trade-off** — if you chose simple over fancy, note why (and what you'd need to revisit if requirements change).

## Reference

### Leading Words

- **KISS**: "Keep It Simple, Stupid" — a design principle favoring simplicity over complexity.
- **Over-engineering**: Adding complexity beyond what current requirements demand, often for hypothetical future needs.

### Rules

- Simple is preferred unless there's a concrete, current requirement that demands complexity.
- Future-proofing is over-engineering unless you have evidence the future need is real and near-term.

## Common Mistakes

- **Premature optimization**: Optimizing for scale or performance before you have evidence it's needed.
- **Architecture astronautics**: Designing for hypothetical scenarios that may never materialize.
- **Equating complex with robust**: Complexity doesn't equal quality; often the opposite.

## Examples

**Over-engineered:** "We'll use a microservices architecture with event sourcing in case we need to scale to millions of users."

**KISS:** "We'll start with a monolith. If we hit scaling limits, we'll extract services then."
