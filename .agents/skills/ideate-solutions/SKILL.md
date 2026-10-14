---
name: ideate-solutions
description: This skill should be used when the user asks to "brainstorm ideas",
  "generate options", "what are our choices", or needs to explore the solution
  space creatively.
user-invocable: true
metadata:
  copilot-enabled-agents: codex,opencode,claude
---

# Ideate-Solutions Skill

## Goal

Generate a diverse set of creative ideas and solutions to address a problem or opportunity.

## Steps

1. **State the problem or opportunity** — what are you trying to solve or explore?
2. **Set constraints** — what are the boundaries? (time, resources, technical limits)
3. **Diverge: generate ideas** — brainstorm freely without judgment. Aim for quantity (10-20+ ideas).
4. **Look for patterns** — group similar ideas; identify themes or clusters.
5. **Combine and build** — can ideas be merged or extended? Build on promising directions.
6. **Converge: select top candidates** — which 3-5 ideas are most promising? Why?
7. **Flesh out top ideas** — add detail to the top candidates: how would they work?
8. **Document for next steps** — record ideas and rationale for prototyping or further exploration.

## Reference

### Leading Words

- **Diverge**: Expand the solution space by generating many ideas without judgment.
- **Converge**: Narrow the solution space by selecting the most promising ideas.
- **Ideation**: The process of generating and exploring creative ideas.

### Rules

- Defer judgment during divergence — criticism kills creativity.
- Quantity leads to quality — the first few ideas are obvious; the gold is deeper.
- Build on others' ideas — "yes, and..." not "yes, but..."

## Common Mistakes

- **Premature convergence**: Judging ideas too early kills creativity. Diverge first, converge later.
- **Settling for obvious ideas**: The first 3-5 ideas are cliches. Push for 10-20+.
- **Ideation without constraints**: Unbounded ideation produces impractical ideas. Set constraints.
- **No documentation**: Ideas evaporate. Capture them for later evaluation.

## Examples

**Problem:** Improve user onboarding completion rate (currently 40%)

**Ideas (divergent):**

1. Gamify with progress bars and badges
2. Reduce steps from 10 to 5
3. Add video tutorials
4. Offer live chat support during onboarding
5. Pre-fill data from social profiles
6. Let users skip and complete later
7. Add social proof ("10,000 users completed this")
8. Personalize based on user type
9. Add a progress email sequence
10. Create an interactive tour

**Top 3 (convergent):**

- Reduce steps (biggest friction)
- Let users skip and complete later (reduces abandonment)
- Add progress email sequence (re-engages dropouts)
