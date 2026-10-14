---
name: write-a-reference
description: Creates a supporting agent reference document. Use when the user asks to "write a reference", "create reference guidance", or move detailed definitions, rules, criteria, patterns, or examples out of a skill; use the consuming skill or a decision/memo skill instead when the request is primarily procedural or records an accepted decision.
disable-model-invocation: true
---

# Write a Reference

## Goal

Create one focused, retrievable Markdown reference that strengthens an existing skill, workflow, or agent without becoming a second skill or conflicting source of truth.

## Process

1. **Identify the consumer** — name the skill, workflow, or agent that will use the reference, and state the behavior or decision it supports. If no consumer exists, ask whether the document should instead be an invocable skill or standalone project record.

2. **Define the boundary** — write a one-sentence purpose and a short scope statement. Identify what belongs in the consumer, another reference, or a project record.

3. **Select the material** — include only on-demand detail such as definitions, rules, criteria, patterns, examples, caveats, or source-linked facts. Keep mandatory sequence and completion criteria in the consuming skill.

4. **Design retrieval** — order the material by usefulness, use descriptive headings and stable terms, group related rules, and add keywords an agent could search for. Split unrelated topics into separate references.

5. **Draft the reference** — use concrete positive language. Label facts, assumptions, recommendations, decisions, and illustrative examples whenever their status could be misunderstood.

6. **Add provenance** — preserve source links, evidence, version/date context, or applicability limits for claims that may change or require verification.

7. **Run pressure checks** — test at least three likely shortcuts: duplicating the skill, hiding a mandatory instruction in the reference, and treating an assumption or example as a universal rule. Revise the document to close each identified loophole.

8. **Run the quality checklist** — apply the checklist in `writing-good-references.md`. Confirm that every required check passes and that no duplicate or contradictory source of truth remains.

9. **Integrate and deliver** — provide the exact filename and add a precise context pointer from the consuming skill, such as `[references/writing-good-references.md](references/writing-good-references.md)`. Deliver one Markdown file unless another format is requested.

## Reference

Read [`writing-good-references.md`](writing-good-references.md) for the reference structure, retrieval design, provenance rules, pressure checks, and review checklist.

## Output contract

The output contains:

- A descriptive title.
- Purpose and scope.
- Organized, on-demand guidance.
- Examples or patterns when they improve application.
- Caveats, provenance, or version context when relevant.
- A reviewable structure without skill frontmatter or slash-command routing.

## Failure modes to catch

- **Second skill:** the reference contains a complete workflow or invocable behavior. Move sequence into the consumer.
- **Hidden requirement:** a mandatory step exists only in the reference. Move it into the consumer and leave detail here.
- **Duplicate authority:** the same rule appears in multiple files. Choose one source of truth and link to it.
- **Retrieval failure:** headings are vague or unrelated topics are mixed. Rename sections or split the document.
- **Status confusion:** examples, assumptions, and recommendations look like facts. Label their status.
- **Premature completion:** the file is drafted without testing likely agent shortcuts. Run pressure checks before delivery.
