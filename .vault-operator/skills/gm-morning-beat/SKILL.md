---
name: gm-morning-beat
description: Generate a capacity-aware SecondBrainRPG morning quest framing.
keywords:
  - morning beat
  - morning quest
  - start the day
---

# Morning Beat

## Read context

Read only:

1. Today's Journal note
2. `[[Campaign/01 Campaign Rules]]`
3. `[[Campaign/02 Story So Far]]`
4. The active quest linked from today's note
5. Its linked project, region, and NPC notes, if relevant

Do not scan the entire vault. If context is missing, ask.

## Workflow

1. Read today's MP, energy, capacity, habits, and Today's plan.
2. Apply the scale from Campaign Rules:
   - MP 1–4: Rest/Scout; 1–2 stated tasks; no major plot advancement
   - MP 5–7: Standard; 2–3 stated tasks
   - MP 8–10: Deep/Bold; 3–4 stated tasks
3. Draft a 100–150 word quest framing.
4. Do not create real-world tasks.
5. Do not write to the vault yet.

## Output

Return only:

- Capacity assessment
- Selected mode
- Draft quest framing
- Notes or contradictions that need user clarification

```markdown
## Capacity assessment

- MP: <value>
- Energy: <value>
- Stated capacity: <value>
- Selected mode: Rest/Scout | Standard | Deep/Bold
- Reason: <one sentence>

## Quest framing

<100–150 word quest framing>

## Constraints applied

- Stated-task limit: <1–2 | 2–3 | 3–4>
- Major plot advancement: <allowed | not allowed>
- Notes requiring clarification: <none | list>
```

## Write rule

Only after an explicit request, append the approved framing under
`## Quest / story update` in today's Journal note.

Show the exact diff and wait for approval.