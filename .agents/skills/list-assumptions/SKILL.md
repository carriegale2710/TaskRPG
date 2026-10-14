---
name: list-assumptions
description: This skill should be used when the user asks to "list assumptions",
  "what are we assuming", "surface assumptions", or needs to explicitly state
  assumptions before proceeding with analysis, planning, or implementation.
user-invocable: true
metadata:
  copilot-enabled-agents: codex,opencode,claude
---

# List-Assumptions Skill

## Goal

Surface and document all assumptions underlying your analysis, plan, or implementation to make them explicit and testable.

## Steps

1. **Identify the decision or analysis at hand** — what are you trying to decide, analyze, or build?
2. **List all assumptions** — write down every assumption you're making, including:
   - Technical assumptions (e.g., "the API will return data in this format")
   - Business assumptions (e.g., "users will prefer feature X over Y")
   - Constraint assumptions (e.g., "we have 2 weeks to ship this")
   - Context assumptions (e.g., "the existing codebase follows this pattern")
3. **Mark each assumption as verified or unverified** — which assumptions do you have evidence for? Which are guesses?
4. **Identify high-risk assumptions** — which assumptions, if wrong, would invalidate your entire approach?
5. **Document in context** — add assumptions to your plan, spec, or ticket so they're visible to reviewers and future you.

## Reference

### Leading Words

- **Assumption**: A statement taken to be true for the purpose of analysis or planning, without (yet) having verified it.
- **High-risk assumption**: An assumption that, if proven false, would invalidate the core approach or conclusion.

### Rules

- Never proceed with high-stakes decisions without surfacing assumptions first.
- Unverified assumptions should be flagged for validation before committing to a path.

## Common Mistakes

- **Hidden assumptions**: Proceeding as if something is certain when it's actually assumed. Always surface assumptions explicitly.
- **Treating assumptions as facts**: Mark unverified assumptions clearly; don't conflate them with verified information.
- **Skipping assumption surfacing under time pressure**: This is when assumptions are most dangerous. Slow down to surface them.

## Examples

**Before:** "We'll use the existing auth system."

**After:** "Assumption: The existing auth system supports OAuth2 flows required for this integration. Status: Unverified. Risk: High — if false, we need to build auth from scratch."
