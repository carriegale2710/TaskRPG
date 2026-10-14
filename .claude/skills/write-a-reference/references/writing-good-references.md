# Writing Good References

## Purpose

A reference is supporting material that an agent consults when a skill, workflow, or system needs detail. It is not an invocable skill and should not compete with the consuming document as a second source of truth.

See [`writing-for-agents.md`](Projects/skills-library/skills/superpowers/write-a-reference/references/writing-for-agents.md) for a deeper explaination.

## Scope

A good reference answers one narrow question or supports one coherent behavior. It may define terms, explain rules, provide decision criteria, show patterns, or give examples. It should not contain the complete procedure that belongs in the consuming skill.

## Information hierarchy

Keep information at the smallest useful level:

1. Put mandatory behavior and sequence in the consuming skill.
2. Put definitions, detailed rules, criteria, patterns, and selective examples in the reference.
3. Put project-specific facts in the relevant project record or source file.
4. Link to external sources when claims depend on material outside the document.

If an instruction must always be followed, it probably belongs in the skill. If it is consulted only for a particular branch or topic, it probably belongs in a reference.

## Recommended structure

Use the sections that fit the topic; do not add empty boilerplate.

```markdown
# Topic Name

## Purpose

What this reference helps an agent do.

## Scope

What is covered and what belongs elsewhere.

## Definitions

Terms that require consistent interpretation.

## Rules

Constraints or invariants the agent should apply.

## Patterns

Reusable structures, heuristics, or decision criteria.

## Examples

Short examples showing correct application.

## Caveats

Exceptions, uncertainty, version limits, or evidence gaps.

## Checklist

A compact review list when repeated validation is useful.
```

## Writing rules

- Use a descriptive filename and title that match the topic.
- Start with purpose and scope so the agent can decide whether the document applies.
- Use headings that describe retrieval questions, such as `When to use`, `Rules`, or `Examples`.
- Define important terms once and use the same term consistently.
- Write one rule or concept per bullet or paragraph.
- Prefer concrete, positive instructions over abstract advice.
- State conditions and exceptions next to the rule they modify.
- Label facts, assumptions, recommendations, and examples when confusion is possible.
- Keep examples short and representative; mark illustrative examples as illustrative.
- Preserve source links or evidence for factual claims that may need verification.
- Include version, date, or applicability information when the guidance can change.
- Keep the reference shorter than the cost of repeatedly reconstructing the same guidance.

## Boundaries

A reference should not:

- Include skill frontmatter such as `name`, `category`, or slash-command routing unless it is independently an invocable skill.
- Reproduce the consuming skill's goal, steps, or output contract in full.
- Introduce a second conflicting rule for the same concept.
- Hide an important mandatory step that the agent will not reliably discover.
- Make an accepted decision on behalf of the user.
- Present uncertain or project-specific claims as universal facts.

## Retrieval design

Agents often consult references selectively. Make selective reading work:

- Put the most important distinction near the top.
- Use stable headings and explicit keywords.
- Keep related rules together.
- Use tables only when comparison improves retrieval.
- Point from the consuming skill to the exact reference path.
- Point to a subsection when only part of a long reference is relevant.
- Split a reference when unrelated topics create search noise.

## Quality checklist

Before accepting a reference, verify:

- The consuming skill and intended use are clear.
- The scope and boundary are explicit.
- Every section supports the stated purpose.
- Rules are concrete, consistent, and testable.
- Terms are defined once and used consistently.
- Facts have sources or are clearly marked as assumptions.
- Examples demonstrate the intended behavior rather than adding new rules.
- Mandatory behavior remains in the consuming skill.
- No duplicated or contradictory source of truth exists.
- The filename, title, and pointer from the consuming skill agree.
- The document can be skimmed and still retrieved by an agent.

## Example distinction

A consuming skill might say:

> Classify each request using the criteria in `writing-good-references.md`, then produce a focused reference document.

This reference can define the criteria and show examples. It should not repeat the full sequence for creating the document, because that sequence belongs in the skill.
