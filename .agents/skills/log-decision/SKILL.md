---
name: log-decision
description: This skill should be used when the user asks to "write a log-decision", "document this decision", "create a proposal", or needs to capture decisions and rationale for asynchronous review.
user-invocable: true
---

# Log-Decision Skill

## Goal

Write a clear, concise log-decision that captures a decision, proposal, or analysis for asynchronous review and future reference.

## Steps

1. **State the purpose** — what is this log-decision about? (decision, proposal, analysis, update)
2. **Provide context** — what background does the reader need? (problem, history, constraints)
3. **Present the recommendation or decision** — what are you proposing or what was decided?
4. **Explain the rationale** — why this option? What criteria and trade-offs were considered?
5. **List alternatives considered** — what other options were evaluated? Why were they rejected?
6. **Describe implications** — what happens if this is approved/adopted? (timeline, resources, risks)
7. **Call to action** — what do you need from readers? (approval, feedback, awareness by when?)
8. **Append supporting details** — what data, analysis, or references support this? (links, attachments)

## Reference

### Leading Words

- **log-decision**: A written document for asynchronous decision-making or information sharing.
- **Rationale**: The reasoning behind a decision or recommendation.

### Rules

- log-decisions should be scannable — use headings, bullets, and bold text for key points.
- Lead with the recommendation or decision — don't bury the lede.
- Keep it concise: 1-2 pages max. Details go in appendices or links.

## Common Mistakes

- **No clear recommendation**: log-decisions that explore without concluding waste readers' time.
- **Missing context**: Readers can't evaluate without understanding the problem.
- **Too long**: If it's more than 2 pages, move details to appendices or links.
- **No call to action**: Readers should know what you need from them and by when.

## Examples

**Log-Decision structure:**

```
# Log-Decision: Choose PostgreSQL for Activity Feed

## Purpose
Recommend database selection for activity feed feature.

## Context
Building activity feed to show users recent actions from followed accounts.
Expected scale: 10k writes/day, 1M reads/day.

## Recommendation
Use PostgreSQL for the activity feed database.

## Rationale
- Team has PostgreSQL expertise (lower operational risk)
- Complex queries needed for feed ranking (PostgreSQL excels here)
- Write volume is moderate (PostgreSQL handles this easily)

## Alternatives Considered
- MongoDB: Better write throughput, but query complexity is a concern
- Redis: Fastest reads, but persistence and query flexibility are limited

## Implications
- Timeline: +1 week for schema design and migration
- Resources: 1 backend engineer for implementation
- Risks: Query performance at scale — will monitor and optimize

## Call to Action
Please review and approve by EOD Friday. Ping me with questions.

## Appendix
- Benchmark results: [link]
- Schema draft: [link]
```
