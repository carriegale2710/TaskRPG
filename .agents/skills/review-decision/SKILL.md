---
name: review
description: This skill should be used when the user asks to "review this decision", "was this the right call", "what did we learn", or needs to evaluate a past decision and extract lessons.
user-invocable: true
---

# Review Skill

## Goal

Evaluate past decisions to learn what worked, what didn't, and how to improve future decisions.

## Steps

1. **State the original decision** — what was decided, when, and by whom?
2. **Review the rationale** — why was this decision made? What criteria and information were used?
3. **Compare outcome vs. expectation** — what actually happened vs. what was expected?
4. **Identify what went well** — which aspects of the decision or execution were successful?
5. **Identify what went wrong** — which assumptions were wrong? What was missed?
6. **Extract lessons** — what should you do differently next time?
7. **Decide on action** — does this decision need to be revisited or reversed? What changes are needed?
8. **Document the review** — record findings so the team can learn from this decision.

## Reference

### Leading Words

- **Decision review**: A retrospective evaluation of a past decision to extract lessons.
- **Outcome vs. expectation**: The gap between what was predicted and what actually occurred.

### Rules

- Review decisions at meaningful intervals (e.g., after launch, after 30 days, after a quarter).
- Focus on the decision process, not just the outcome — good processes can have bad outcomes due to luck.
- Blame the process, not the person — decisions are made with the information available at the time.

## Common Mistakes

- **Hindsight bias**: Judging the decision based on information that wasn't available at the time.
- **Outcome bias**: Assuming a good outcome means a good decision (or vice versa).
- **Skipping the review**: Not learning from past decisions means repeating mistakes.
- **Blaming individuals**: Decisions are systemic; focus on improving the process.

## Examples

**Original decision (3 months ago):** Use MongoDB for activity feed.

**Rationale:** High write throughput needed; flexible schema for evolving requirements.

**Outcome:** Write throughput is fine, but query complexity is causing performance issues. Schema flexibility led to inconsistent data.

**Lessons:**

- Underestimated query complexity costs
- Should have prototyped complex queries before committing
- Schema flexibility requires discipline we didn't have

**Action:** Migrate to PostgreSQL for better query support; add schema validation layer.
