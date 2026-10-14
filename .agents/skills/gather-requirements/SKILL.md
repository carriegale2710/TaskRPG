---
name: gather-requirements
description: This skill should be used when the user asks to "gather requirements", "what are the requirements", "define requirements", or needs to understand and capture what a feature or project must accomplish.
user-invocable: true
---

# Gather-Requirements Skill

## Goal

Gather, analyze, and document clear requirements that define what a feature or project must accomplish to be successful.

## Steps

1. **Identify stakeholders** — who has input on requirements? (users, customers, team, leadership)
2. **Conduct discovery** — interview stakeholders, observe users, review existing data.
3. **Categorize requirements** — separate functional (what it does) from non-functional (how it performs).
4. **Write user stories or use cases** — capture requirements from the user's perspective.
5. **Define acceptance criteria** — how will you verify each requirement is met?
6. **Prioritize** — which requirements are must-have vs. nice-to-have? (MoSCoW: Must, Should, Could, Won't)
7. **Validate with stakeholders** — review requirements to ensure completeness and accuracy.
8. **Document and version** — record requirements in a living document; track changes.

## Reference

### Leading Words

- **Functional requirement**: What the system must do (features, behaviors).
- **Non-functional requirement**: How the system must perform (performance, security, usability).
- **Acceptance criteria**: Conditions that verify a requirement is satisfied.

### Rules

- Requirements must be testable — if you can't verify it, it's not a requirement.
- Use clear, unambiguous language — avoid "should", "might", "user-friendly".
- Requirements are living — update them as you learn, but track changes.

## Common Mistakes

- **Confusing requirements with solutions**: Requirements state the problem, not the implementation.
- **Vague requirements**: "Fast" is vague. "Loads in under 200ms" is testable.
- **Missing non-functional requirements**: Performance, security, and usability matter too.
- **No prioritization**: Without priorities, everything is urgent and nothing gets done.

## Examples

**Bad requirement:** "The system should be fast and easy to use."

**Good requirements:**

**Functional:**

- Users can log in with email and password
- Users can reset password via email link
- Users can view their activity feed

**Non-functional:**

- Login completes in under 500ms (p95)
- System supports 10k concurrent users
- All data encrypted at rest and in transit

**Acceptance criteria (for login):**

- Given valid credentials, user is logged in within 500ms
- Given invalid credentials, user sees error: "Invalid email or password"
- Given locked account, user sees error: "Account locked. Contact support."

**Prioritization:**

- Must: Email/password login, password reset
- Should: Remember me option
- Could: Social login (Google, GitHub)
- Won't (this sprint): SSO, 2FA
