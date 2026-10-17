# TaskRPG: Plugins, integrations and development tools

Audience: coding agents building TaskRPG and Vault Operator agents running it.

Read with: AGENTS.md, PRD.md, BUILD_PLAN.md and TESTING.md.

## 1. Architecture and boundaries

TaskRPG separates responsibilities:

| Layer               | Responsibility                                                 |
| ------------------- | -------------------------------------------------------------- |
| Engine              | Game rules, action results and state reconstructed from events |
| Settings note       | Tunable values, skill definitions and configuration            |
| QuickAdd wrappers   | Call the engine for task resolution, undo and other actions    |
| Meta Bind           | Buttons, input fields and displays                             |
| TaskNotes and Bases | Task creation, planning, statuses, task fields and task views  |
| Dice Roller         | Approved narrative-table draws                                 |
| Vault Operator      | Narration, personas, story and scoped memory                   |

Rules:

- Keep the engine a standalone, dependency-free JavaScript module.
- Keep engine Obsidian-free. All vault and file I/O in wrapper layer. A later plugin is a swap, not a rewrite (see `PRD.md`).
- Do not put game rules in templates, plugin settings or macros.
- Keep QuickAdd scripts in a visible folder.
- Reuse documented plugin capabilities before building custom UI.
- Do not add plugins, APIs or agent platforms without user approval.
- Do not assume a documented feature works with the installed version.
- Record desktop and mobile integration results in TESTING.md.
- Build one step at a time and stop for user validation.
- Buttons, dice and stats must remain usable without AI.
- **TaskNotes owns task creation, planning, statuses, and task user fields. TaskRPG owns task resolution (`Task done`) and undo.**

## 2. Planned plugin stack

Confirm each plugin is installed, enabled and working before its build step.

| Plugin             | Needed from | TaskRPG use                                                                       | Integration checks                                                                                   |
| ------------------ | ----------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| QuickAdd           | Step 0      | Thin action wrappers for task resolution, undo, recalculation and briefing launch | Verify script loading, command invocation and phone behaviour                                        |
| Templater          | Step 0      | Scaffold daily notes, habits, personas and other starter notes                    | Verify template paths; keep game logic out of templates                                              |
| Lazy Plugin Loader | Step 0      | Startup optimisation where useful                                                 | Do not delay dependencies in a way that breaks startup processing or buttons                         |
| Meta Bind          | Step 2      | Habit/task buttons, hero panels and settings inputs                               | Verify bindings, command actions and mobile rendering                                                |
| Fit                | Step 2      | Desktop/phone vault sync                                                          | Verify event-log and note sync, conflict handling and device-local configuration                     |
| TaskNotes          | Step 3      | Task creation, planning, statuses, task user fields, backlog and task views       | Verify required fields, scheduled dates, completion timestamps and preservation of custom properties |
| Bases              | Step 3      | Core Obsidian feature used by TaskNotes views                                     | Enable it and verify the installed TaskNotes version's requirements                                  |
| Dice Roller        | Step 3      | Narrative outcomes from table notes                                               | Verify table syntax, weighting and the supported integration method                                  |
| Vault Operator     | Step 4      | Narrator, onboarding, character conversations, summaries and briefing             | Verify model connection, agent setup, memory scope and approval controls                             |

The table describes the planned stack, not verified installation status.

Do not install multiple plugins to perform the same role.

## 3. Reusable implementation resources

### QuickAdd

Resources:

- Repository: https://github.com/chhoumann/quickadd
- Examples: https://quickadd.obsidian.guide/docs/Examples/

Reuse capture, template and JavaScript-macro examples.

Suggested wrappers:

- habit-done
- task-done
- undo-last
- recalculate
- morning-briefing

Task creation and planning belong to TaskNotes. Do not add `task-new` or `task-plan` QuickAdd wrappers.

Each action wrapper should:

1. Read and validate the required TaskNotes task or settings state.
2. Read the required event state.
3. Call the engine.
4. Persist the engine-produced event and resolution-related task fields.
5. Display the result.

Do not independently recalculate XP, MP, HP or outcomes in a wrapper.

### Meta Bind

Repository: https://github.com/mProjectsCode/obsidian-meta-bind-plugin

Reuse buttons, input fields and view fields for:

- Habit and task actions.
- HP, MP, skill XP and levels.
- Settings controls.

The hero note is a derived-state cache, not an independent source of truth.
Do not use editable hero fields to bypass engine actions.

### TaskNotes and Bases

Resources:

- Repository: https://github.com/callumalpass/tasknotes
- Documentation: https://tasknotes.dev/obsidian/

Use TaskNotes as the task layer: create tasks, plan or schedule them, manage statuses, and store the TaskRPG user fields.

TaskRPG needs task metadata for:

- A stable task ID.
- Skill.
- Size.
- Urgent and important flags.
- A scheduled date, used for the planned-day MP rule.
- Project association where applicable.
- Completion information written by task resolution.

Verify actual property names and supported operations against the installed
version. Do not invent an API or assume frontmatter fields are preserved.

Only the task-resolution wrapper may update resolution-related completion fields.
Narrator and character agents must not edit task records or task state.

TaskNotes Workflows may later invoke `/task-done` automatically on an
In Progress → Done change. Treat this as optional phase 2; do not enable or
document it as working until separately validated.

The HTTP API, CLI and MCP integration are optional. Do not enable them merely
because they exist. If needed, verify authentication and availability
requirements and keep credentials outside Git.

### Dice Roller

Repository: https://github.com/Obsidian-TTRPG-Community/dice-roller

Prototype a small, approved table before building generated table workflows.

- Use the plugin's supported Markdown table syntax.
- Verify weighted-entry behaviour.
- Require user approval before generated tables become active.
- Preserve retired entries through the "Not for me" workflow.
- Do not let a narrative-table draw alter the real task's XP or MP.

For task rolls, record the actual dice values and supply them to the engine.
Replay and undo must use recorded values rather than generate a new roll.

Do not roll the same task action independently in both the engine and plugin.

### Templater

Resources:

- Repository: https://github.com/SilentVoid13/Templater
- Documentation: https://silentvoid13.github.io/Templater/

Use templates for note structure and initial fields, not game calculations.

Avoid implementing the same action in both Templater and QuickAdd.
Review imported templates before execution; templates can run code.

## 4. Optional development tools

These run in the development environment, not inside the production engine.

### fast-check

Resources:

- Repository: https://github.com/dubzzz/fast-check
- Documentation: https://fast-check.dev/

Purpose: generate varied inputs for engine invariant and regression tests.

Add only if useful alongside the existing test runner. Keep it a development
dependency; do not import it into runtime code.

Candidate properties:

- Identical recorded inputs produce identical reconstructed state.
- Replay agrees with incremental action processing.
- Task MP cost never falls below its configured minimum.
- Undo appends a correction and cannot generate a new roll.
- Settings changes do not modify outcomes before their effective date.
- Rest, pause and day-boundary rules remain consistent across event sequences.

Use reproducible seeds when investigating failures and preserve important
counterexamples as regression tests.

### Gitleaks

Repository: https://github.com/gitleaks/gitleaks

Purpose: detect accidentally committed credentials.

Recommended uses:

- A one-time scan of available Git history and branches.
- A local pre-commit check.
- A CLI-based CI check.

Review findings without copying secret values into issues or documentation.
Rotate exposed credentials before considering history cleanup.

The CLI and the official GitHub Action have separate usage/licensing terms.
Check the wrapper's requirements before adopting it; using the CLI directly
is sufficient for the proposed workflow.

## 5. Alternatives requiring approval

### Randomness

Repository: https://github.com/Obsidian-TTRPG-Community/Randomness

Possible alternative to Dice Roller, with compatibility features and
additional generator capabilities.

Do not install it alongside Dice Roller or migrate automatically.

Consider it only if a demonstrated table-generation requirement is difficult
to support with the selected plugin. Test migration in a disposable vault,
including table syntax, recorded rolls and script integration.

### Other plugins

Consider these only after the trial week and a demonstrated need:

- Dataview if Bases cannot support a required view.
- Calendar or heatmap tools for an approved habit-history view.
- Mapping tools for an approved campaign feature.
- Presentation plugins after functional validation.
- External calendar/task sync after conflict behaviour is defined.

Do not add another game-rules plugin or another autonomous AI writer.
Do not replace the existing coding workflow solely to try a new agent tool.

## 6. Agent and data safety

Vault Operator is the narrative layer, not the game engine.

- Narrator and character agents write only to their designated Story,
  Campaign, World and Characters areas.
- They never edit task records, Engine state or user-authored journal content.
- Supply only the journal context needed for the current interaction.
- Keep character and campaign memory separate.
- Require approval before promoting campaign events into shared world canon.
- Only the narrator or game system gives real-talk lines: at most one per day,
  kind and neutral. Characters stay in fiction and advise only when asked.
- Use the configured stronger model for chats and narration and a smaller
  model for summaries where supported.
- Verify approval controls rather than assuming prompts enforce isolation.
- Treat selected vault content as potentially visible to the model provider.
- "GM-only", hidden folders and ignore rules are not confidentiality controls.

Keep real personal data and credentials out of development fixtures.

Keep local plugin settings, tokens, telemetry and agent runtime state out of
the repository. Preserve reviewed reusable skills separately.

Gitignore does not untrack previously committed files.
Sync is not a substitute for an independently recoverable backup.

## 7. Build checks and issue dependencies

| Step                   | Issue | Validate                                                                                            |
| ---------------------- | ----- | --------------------------------------------------------------------------------------------------- |
| Habit button           | #2    | Button calls QuickAdd; event and hero state update; toast works; phone result recorded              |
| Task resolution        | #3    | TaskNotes fields and scheduling; task resolution, result card and undo; custom properties preserved |
| Onboarding and tables  | #4    | Quiz resumes; personas are reviewed; approved tables integrate with task completion                 |
| Companion and briefing | #5    | Scoped memory, linked quests and briefing launch or documented fallback                             |
| Agent safeguards       | #8    | Write controls, minimal context, campaign isolation and AI-outage recovery                          |
| Trial week             | #6    | Minimal routine, feedback and continue/adjust/stop decision                                         |
| Expansion              | #7    | Explicit continue approval; add one feature at a time                                               |

Order:

#2 → #3 → #4 → #5 → #6 → #7

#8 runs alongside #4–#5 and must be validated before #6.

Prepare safeguard policies before agent use. Do not create a circular
dependency by requiring #8 to close before the agents needed to test it exist.

If prepared-prompt launch into Vault Operator is unsupported, use the
build brief's fallback: paste the prompt into narrator chat or invoke the
reviewed skill.

## 8. Version and licence hygiene

- Record tested plugin versions and device results in TESTING.md.
- Test updates in a disposable vault before using real campaign data.
- Prefer official documentation and repositories.
- Review imported workflows and scripts before execution.
- Check licences before copying or redistributing source code.
- Check template, table, generator and artwork licences separately.
- Do not assume a plugin's licence covers third-party content.
- Free/open-source plugins do not imply free model inference or an
  open-source host application.
