---
name: define-scope
description: This skill should be used when the user asks to "define scope",
  "what's in scope", "what's out of scope", or needs to clarify boundaries for a
  project, feature, or sprint.
user-invocable: true
metadata:
  copilot-enabled-agents: codex,opencode,claude
---

# Define-Scope Skill

## Goal

Define clear boundaries for what is included (in scope) and excluded (out of scope) to prevent scope creep and align expectations.

## Steps

1. **State the objective** — what is this project/feature/sprint trying to accomplish?
2. **List in-scope items** — what specific deliverables, features, or work is included?
3. **List out-of-scope items** — what explicitly is NOT included? (Be specific — this prevents assumptions)
4. **Identify constraints** — what are the time, budget, resource, or technical limits?
5. **Define success criteria** — how will you know the scope was successfully delivered?
6. **Document assumptions** — what are you assuming to be true that could affect scope?
7. **Review with stakeholders** — ensure everyone agrees on what's in and out.

## Reference

### Leading Words

- **Scope**: The boundaries of what work is included and excluded in a project or feature.
- **Scope creep**: The gradual expansion of scope without corresponding adjustments to time, budget, or resources.

### Rules

- Out-of-scope items are as important as in-scope items — they prevent misunderstandings.
- If it's not explicitly in scope, it's out of scope by default.
- Changes to scope require explicit agreement and corresponding adjustments to time/budget.

## Common Mistakes

- **Vague scope**: "Build a good user experience" is vague. "Implement onboarding flow with 3 screens" is specific.
- **Implicit scope**: Assuming something is included without stating it. Write it down.
- **Scope without constraints**: Scope is meaningless without time/budget/resource limits.

## Examples

**In scope:**

- User login with email/password
- Password reset flow
- Session management (7-day expiry)

**Out of scope:**

- Social login (Google, GitHub)
- Two-factor authentication
- SSO integration

**Constraint:** 2 weeks, 1 developer
