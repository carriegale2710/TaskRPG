# TaskRPG: Plugins, integrations and development tools

For coding agents building TaskRPG and Vault Operator agents running it. Read with `AGENTS.md`, `PRD.md`, `BUILD_PLAN.md`, `TESTING.md`.

## 1. Boundaries

| Layer               | Responsibility                                                 |
| ------------------- | -------------------------------------------------------------- |
| Engine              | Game rules, action results, state rebuilt from events          |
| Settings note       | Tunable values, skill definitions, configuration               |
| QuickAdd wrappers   | Call the engine for resolution, undo and other actions         |
| Meta Bind           | Buttons, input fields, displays                                |
| TaskNotes and Bases | Task creation, planning, task fields, task views               |
| Dice Roller         | Approved narrative-table draws                                 |
| Vault Operator      | Narration, personas, story, scoped memory                      |

Rules:

- Engine stays standalone, dependency-free JavaScript. Obsidian-free.
- All vault and file I/O lives in the wrapper layer. A future plugin is a swap, not a rewrite.
- No game rules in templates, plugin settings or macros.
- QuickAdd scripts live in a visible folder.
- Reuse documented plugin features before building custom UI.
- No new plugins, APIs or agent platforms without user approval.
- Do not assume a documented feature works on the installed version.
- Record desktop and mobile results in `TESTING.md`.
- Build one step at a time; stop for user validation.
- Buttons, dice and stats must work without AI.
- TaskNotes owns task creation, planning and task user fields. TaskRPG owns task resolution (`Task done`), undo, and the `done`/`open` status writes those actions make.

## 2. Planned stack

Confirm each plugin is installed, enabled and working before its build step.

| Plugin             | From    | Use                                                                   | Check                                                                |
| ------------------ | ------- | --------------------------------------------------------------------- | -------------------------------------------------------------------- |
| QuickAdd           | Step 0  | Thin wrappers: resolution, undo, recalculate, briefing launch          | Script loading, command invocation, phone behaviour                  |
| Templater          | Step 0  | Scaffold daily notes, habits, personas                                | Template paths; keep game logic out                                  |
| Lazy Plugin Loader | Step 0  | Startup optimisation                                                  | Do not delay dependencies needed at startup                          |
| Meta Bind          | Step 2  | Habit/task buttons, hero panels, settings inputs                      | Bindings, command actions, mobile rendering                          |
| Fit                | Step 2  | Desktop/phone sync                                                    | Log and note sync, conflicts, device-local config                    |
| TaskNotes          | Step 3  | Task creation, planning, task fields, backlog, views                  | Required fields, scheduled dates, completion timestamps, custom props |
| Bases              | Step 3  | Core Obsidian feature used by TaskNotes views                         | Enabled; installed TaskNotes requirements                            |
| Dice Roller        | Step 3  | Narrative outcomes from table notes                                   | Table syntax, weighting, integration method                          |
| Vault Operator     | Step 4  | Narrator, onboarding, chats, summaries, briefing                      | Model connection, agent setup, memory scope, approvals               |

Planned stack, not verified installation status. Do not install two plugins for one role.

## 3. Reusable implementation resources

### QuickAdd

- https://github.com/chhoumann/quickadd
- https://quickadd.obsidian.guide/docs/Examples/

Reuse capture, template and JavaScript-macro examples. Wrappers: `habit-done`, `task-done`, `task-undo`, `recalculate`, `morning-briefing`. Task creation and planning belong to TaskNotes; no `task-new` or `task-plan` wrappers.

Each wrapper:

1. Read and validate the TaskNotes task or settings state.
2. Read event state.
3. Call the engine.
4. Persist the engine event and resolution-related task fields.
5. Display the result.

Never recalculate XP, MP, HP or outcomes in a wrapper.

### Meta Bind

https://github.com/mProjectsCode/obsidian-meta-bind-plugin

Reuse buttons, input fields and view fields for habit/task actions, HP/MP/skill XP and levels, settings controls. `Hero.md` is a derived cache. Editable hero fields must not bypass engine actions.

### TaskNotes and Bases

- https://github.com/callumalpass/tasknotes
- https://tasknotes.dev/obsidian/

TaskNotes is the task layer: create, plan or schedule tasks, store TaskRPG fields.

TaskNotes identifies notes by tag (`taskIdentificationMethod: "tag"`, `taskTag: "task"` in plugin data) and writes no per-task ID. TaskRPG needs an ID that survives renames, so the vault adds one through a TaskNotes body template at `TaskNotes/Templates/template.md` (plugin setting points at `TaskNotes/Templates/template`, no `.md`):

```markdown
---
taskId: { { nano } }
skill:
size:
---
```

`{{nano}}` is a timestamp plus random string, unique per task. Verified on TaskNotes 4.13.8: a new task gets `taskId`, and TaskNotes still adds its own `tags: - task` and `status`. Empty `skill`/`size` only reserve the properties; TaskRPG rejects empty values. The `taskId` user field is defined in TaskNotes settings, so it appears in the task modal.

TaskRPG needs: stable ID, skill, size, urgent/important flags, scheduled date (planned-day MP rule), project link where applicable, completion info written by resolution.

Verify property names and operations against the installed version. Do not invent an API or assume frontmatter survives.

Only the resolution wrapper may update completion fields. Narrator and character agents never edit task records or task state.

TaskNotes Workflows may later call `/task-done` on In Progress → Done. Optional phase 2; do not enable or document as working until validated.

HTTP API, CLI and MCP integration are optional. Verify auth and availability; keep credentials outside Git.

### Dice Roller

https://github.com/Obsidian-TTRPG-Community/dice-roller

Prototype one approved table before generated-table workflows.

- Use supported Markdown table syntax.
- Verify weighted entries.
- Generated tables go live unseen only with user approval.
- Retired entries stay retired through "Not for me".
- A narrative draw never changes the task's XP or MP.

For task rolls, record actual dice values and pass them to the engine. Replay and undo reuse recorded values. Never roll the same action twice.

### Templater

- https://github.com/SilentVoid13/Templater
- https://silentvoid13.github.io/Templater/

Templates build note structure and initial fields, not game maths. Do not duplicate an action in Templater and QuickAdd. Review imported templates before running; they can execute code.

## 4. Optional development tools

These run in the development environment, never in the engine.

### fast-check

- https://github.com/dubzzz/fast-check
- https://fast-check.dev/

Generates varied inputs for invariant and regression tests. Development dependency only; never imported at runtime. Add only if useful beside the existing runner.

Candidate properties:

- Identical recorded inputs produce identical state.
- Replay agrees with incremental processing.
- Task MP cost never falls below the configured minimum.
- Undo appends a correction and cannot re-roll.
- Settings changes do not alter outcomes before their effective date.
- Rest, pause and day-boundary rules hold across event sequences.

Use reproducible seeds; keep counterexamples as regression tests.

### Gitleaks

https://github.com/gitleaks/gitleaks

Detects committed credentials: one-time history scan, local pre-commit check, CLI CI check. Review findings without copying secret values. Rotate exposed credentials before history cleanup. CLI and GitHub Action have separate licence terms; the CLI suffices here.

## 5. Alternatives requiring approval

### Randomness

https://github.com/Obsidian-TTRPG-Community/Randomness

Possible Dice Roller alternative. Do not install alongside Dice Roller or migrate automatically. Consider only for a demonstrated table-generation gap. Test in a disposable vault: syntax, recorded rolls, script integration.

### Other plugins

Only after the trial week and a demonstrated need:

- Dataview if Bases cannot support a required view.
- Calendar or heatmap for an approved habit-history view.
- Mapping tools for an approved campaign feature.
- Presentation plugins after functional validation.
- External calendar/task sync after conflict behaviour is defined.

No second game-rules plugin, no second autonomous AI writer, no workflow swap just to try a new agent tool.

## 6. Agent and data safety

Vault Operator is narration, not the engine.

- Agents write only to designated Story, Campaign, World and Characters areas.
- They never edit task records, Engine state or user journal content.
- Supply only the journal context needed for the current interaction.
- Keep character and campaign memory separate.
- Approval required before campaign events become shared canon.
- Only narrator or game system gives real-talk lines: at most one per day, kind and neutral. Characters stay in fiction and advise only when asked.
- Stronger model for chats and narration; smaller model for summaries.
- Verify approval controls; do not trust prompts alone.
- Treat selected vault content as visible to the model provider.
- "GM-only", hidden folders and ignore rules are not confidentiality controls.

Keep personal data and credentials out of fixtures. Keep plugin settings, tokens, telemetry and agent runtime state out of the repo. Preserve reviewed skills separately. Gitignore does not untrack committed files. Sync is not a backup.

## 7. Build checks and issue dependencies

| Step                   | Issue | Validate                                                              |
| ---------------------- | ----- | --------------------------------------------------------------------- |
| Habit button           | #2    | Button calls QuickAdd; event and hero update; toast; phone result      |
| Task resolution        | #3    | TaskNotes fields and scheduling; resolution, result card, undo; props  |
| Onboarding and tables  | #4    | Quiz resumes; personas reviewed; approved tables integrate             |
| Companion and briefing | #5    | Scoped memory, linked quests, briefing launch or documented fallback   |
| Agent safeguards       | #8    | Write controls, minimal context, campaign isolation, AI-outage recovery |
| Trial week             | #6    | Minimal routine, feedback, continue/adjust/stop                        |
| Expansion              | #7    | Explicit approval; one feature at a time                               |

Order: #2 → #3 → #4 → #5 → #6 → #7. #8 runs alongside #4–#5 and must validate before #6.

Prepare safeguards before agent use. Do not block agent testing on #8 closing first.

If prepared-prompt launch into Vault Operator fails, paste the prompt into narrator chat or invoke the reviewed skill.

## 8. Version and licence hygiene

- Record tested plugin versions and device results in `TESTING.md`.
- Test updates in a disposable vault before real campaign data.
- Prefer official docs and repositories.
- Review imported workflows and scripts before running.
- Check licences before copying or redistributing code.
- Check template, table, generator and artwork licences separately.
- A plugin licence does not cover third-party content.
- Free plugins do not imply free model inference or an open-source host app.
