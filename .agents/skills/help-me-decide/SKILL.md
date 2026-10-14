---
name: help-me-decide
description: This skill should be used when the user asks to "help me decide", "which should I choose", "make a decision", or needs to systematically evaluate options and make a call.
user-invocable: true
---

# Help-Me-Decide Skill

## Goal

Make a clear, defensible decision by systematically evaluating options against criteria.

## Steps

1. **State the decision** — what exactly are you deciding? Frame it as a question.
2. **List options** — what are the possible choices? (Include "do nothing" if relevant)
3. **Define criteria** — what factors matter for this decision? (cost, time, risk, impact, etc.)
4. **Weight criteria** — which factors are most important? (assign weights if helpful)
5. **Evaluate each option** — how does each option score on each criterion?
6. **Check for dealbreakers** — does any option have a disqualifying flaw?
7. **Make the call** — which option scores highest? That's your decision.
8. **Document rationale** — write 2-3 sentences explaining why you chose this option.

## Reference

### Leading Words

- **Decision**: A choice between options made after systematic evaluation.
- **Criteria**: The factors that determine which option is best.
- **Dealbreaker**: A flaw that disqualifies an option regardless of other merits.

### Rules

- If you can't decide within your time budget, choose the option with the highest expected value.
- Document the decision and rationale — future you will need to remember why.
- Revisit decisions when new information emerges that changes the evaluation.

## Common Mistakes

- **Analysis paralysis**: Endlessly gathering more information. Set a time budget and decide.
- **Hidden criteria**: Deciding based on factors you haven't stated. Surface all criteria.
- **Option fixation**: Falling in love with one option and ignoring others. Evaluate all fairly.
- **Decision without documentation**: Forgetting why you decided. Write it down.

## Examples

**Decision to make:** Which database for our activity feed?

**Options:** PostgreSQL, MongoDB, Redis

**Criteria:** Query complexity (30%), write throughput (30%), operational complexity (20%), team familiarity (20%)

**Evaluation:**

- PostgreSQL: High query complexity ✓, Medium write throughput ✓, Low ops complexity ✓, High familiarity ✓
- MongoDB: Medium query complexity, High write throughput ✓, Medium ops complexity, Low familiarity
- Redis: Low query complexity, Very high write throughput ✓✓, High ops complexity, Low familiarity

**Decision:** PostgreSQL — best balance of query flexibility and team familiarity for our use case.
