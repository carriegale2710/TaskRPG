---
name: log-progress
description: This skill should be used when the user asks to "log this", "keep a record", "document what we did", or needs to create an auditable record of work and decisions.
user-invocable: true
---

# Log-Progress Skill

## Goal

Create a structured, timestamped record of work, decisions, and outcomes for future reference and accountability.

## Steps

1. **Start with timestamp and context** — when is this? What project/task?
2. **Record what was done** — what specific work was completed?
3. **Note decisions made** — what choices were made and why?
4. **Document outcomes** — what was the result? (success, failure, partial)
5. **Capture learnings** — what did you learn that's worth remembering?
6. **List blockers or issues** — what problems emerged that need attention?
7. **Link to related artifacts** — what tickets, PRs, docs, or conversations relate to this?
8. **Review and summarize periodically** — what patterns emerge from multiple log entries?

## Reference

### Leading Words

- **Log**: A timestamped, chronological record of work and decisions.
- **Artifact**: A related document, ticket, PR, or conversation linked from the log.

### Rules

- Logs should be written daily (or per work session) while details are fresh.
- Use consistent format so entries are scannable and searchable.
- Link to artifacts liberally — the log is an index, not the source of truth.

## Common Mistakes

- **Too verbose**: Logs should be concise. Capture essentials, not every detail.
- **Inconsistent format**: Without structure, logs become hard to scan.
- **No links**: A log without links to artifacts is an island. Connect to the work.
- **Writing logs from memory days later**: Details fade. Log daily or per session.

## Examples

**Log entry:**

```
2026-08-28 | Activity Feed Project

Done:
- Implemented PostgreSQL schema for activity events
- Wrote migration script with rollback
- Added indexes on user_id and created_at

Decisions:
- Chose JSONB for event payload (flexible schema for event types)
- Deferred real-time notifications to v2 (focus on core feed first)

Outcomes:
- Schema migration tested successfully on staging
- Load test: 10k events inserted in 2.3s ✓

Learnings:
- JSONB queries are slower than expected — need to benchmark more

Blockers:
- Waiting on API design for feed endpoint

Links:
- PR: #42
- Spec: docs/activity-feed-spec.md
- Ticket: PROJ-123
```
