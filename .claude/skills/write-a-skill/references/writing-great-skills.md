# Writing Great Skills

A skill exists to wrangle determinism out of a stochastic system. **Predictability** — the agent taking the same _process_ every run — is the root virtue.

## Invocation

Two choices:

- A **model-invoked** skill keeps a **description** so the agent can fire it autonomously. It contributes to **context load**. Omit `disable-model-invocation` and write rich trigger phrasing.
- A **user-invoked** skill strips the description from the agent's reach. Zero context load, but you must remember it exists. Set `disable-model-invocation: true`.

Pick model-invocation only when the agent must reach the skill on its own. If it only ever fires by hand, make it user-invoked.

## Writing the description

- **Front-load the skill's leading word.**
- **One trigger per branch.** Synonyms for the same branch are duplication — collapse them.
- **Cut identity already in the body.** Keep description to triggers only.

## Information hierarchy

Ranked by how immediately the agent needs the material:

1. **In-skill step** — ordered action in `SKILL.md`. Each step ends on a **completion criterion**.
2. **In-skill reference** — definition, rule, or fact in `SKILL.md`, consulted on demand.
3. **External reference** — pushed into a separate file, reached by a **context pointer**, loaded only when needed.

**Progressive disclosure** is the move down the ladder — out of `SKILL.md` into a linked file — so the top stays legible.

## When to split

- **By invocation** — split off a model-invoked skill when you have a distinct leading word that should trigger it on its own.
- **By sequence** — split a run of steps when post-completion steps tempt the agent to rush the current one.

## Pruning

- Keep each meaning in a **single source of truth**.
- Check every line for **relevance**.
- Hunt **no-ops**: does this line change behaviour versus the default? If not, delete it.
- Avoid **negation**: prompt the positive behaviour; don't name the thing you want to avoid.

## Failure modes

- **Premature completion** — ending a step before it's genuinely done.
- **Duplication** — the same meaning in more than one place.
- **Sediment** — stale layers that settle because adding feels safe and removing feels risky.
- **Sprawl** — a skill too long even when every line is live.
- **No-op** — a line the model already obeys by default.
- **Negation** — steering by prohibition backfires; prompt the positive instead.
