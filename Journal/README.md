# Journal Agent Rules

## Purpose

Daily notes are the user's journal and a readable view of planned work and logged game turns. The event log in `Engine/` is the source of truth for game state.

## Daily note behavior

- Preserve existing frontmatter, plans, reflections and formatting. Do not infer, overwrite or recalculate HP, MP, XP, habits or task state in a daily note.
- Keep the user's own journal content verbatim. Never replace or summarize it unless asked.
- Show planned tasks under the day's plan and generated game feedback under `## Today's turns`. The turns view comes from the engine event log; it is not an independent record.
- Task and habit Done actions get immediate engine feedback. Do not add a separate story beat after each action. The narrator's briefing and campaign story belong in the relevant campaign notes.
- Do not prune daily notes here. Any retention or backup operation must follow the PRD and preserve the event log as the game-state source.

## Continuity and model context

- When a narrator interaction needs context, use the selected campaign's story log and only the relevant recent journal details. Do not read the whole journal by default.
- No vault file or folder is private by guarantee. Any content supplied to an AI provider may be sent to that provider; do not store content here that the user would not consent to sending.
- Characters remain in fiction and give advice only when asked. Only the narrator or game system may provide the brief, kind, neutral real-talk described in the PRD.

## Safety

- Ask before editing or deleting user-authored journal content or changing note structure.
- Never treat a journal entry as permission to alter game state, complete a task or advance campaign canon.
