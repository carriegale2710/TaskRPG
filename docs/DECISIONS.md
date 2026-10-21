# TaskRPG Decision Log

**Last Updated**: 2026-10-20
Newest first. A decision remains active until marked `Superseded`.

Statuses:

- **Accepted**—settled; agents must follow it.
- **Provisional**—reasonable default, explicitly revisable.
- **Superseded**—no longer active; link to the replacement decision.

## D-021—Undo restores the TaskNotes default `open` status

- **Status:** Accepted
- **Decision:** `Undo last` sets the matching TaskNotes task note's status to the TaskNotes default `open` and clears `completedDate`. No previous-status lookup is added and the event schema is unchanged.
- **Context:** Undo previously cleared only `completedDate`, leaving the note reading Done while the RPG log treated the task as unresolved (issue #19).
- **Rationale:** `open` is the plugin's own default, keeps the note consistent with the unresolved RPG state, and avoids storing or guessing a prior status.
- **Alternatives considered:** Preserve the status; look up and restore the status from the event log (schema change).
- **Implications:** The `open` value lives once as `OPEN_TASK_STATUS` in `Scripts/task-utils.js`; the note edit goes through the frontmatter-only writer from issue #14. Verified against TaskNotes 4.13.8.
- **Revisit when:** The configured TaskNotes statuses or `defaultTaskStatus` change.

## D-020—Use event log as source of truth

- **Status:** Accepted
- **Decision:** Use one shared append-only event log as the source of truth for shared player progression.
- **Context:** v1 used the daily journal as the source of truth, making state reconstruction and corrections difficult.
- **Rationale:** An event log makes progression auditable, supports recalculation, enables undo without history rewriting, and separates game state from journal prose.
- **Alternatives considered:** Keep daily journal as source of truth; store state in JSON.
- **Implications:** Hero note becomes a derived cache; every meaningful action must append an event; recalculation must replay events.
- **Revisit when:** Event-log size or concurrent-edit behaviour makes the Markdown format impractical.

## D-019—Make immersion the v1 priority

- **Status:** Accepted
- **Decision:** Prioritise an immersive RPG layer before external integrations.
- **Context:** Boredom and lack of novelty are the primary reasons projects and routines are abandoned.
- **Rationale:** Immersion is the mechanism through which productivity behaviour is sustained; external sync does not solve the core motivation problem.
- **Alternatives considered:** Productivity mechanics first with a story wrapper; immediate external sync.
- **Implications:** v1 focuses on narrator, characters, dice, tables, memory, and progression; external sync is deferred.
- **Revisit when:** The core loop is stable and external-task sources become a major friction point.

## D-018—Use TaskNotes as the task layer

- **Status:** Accepted
- **Decision:** TaskNotes owns task creation, planning, scheduling, statuses, and task user fields (`skill`, `size`, `urgent`, `important`).
- **Context:** Duplicating task management in QuickAdd would create competing sources of task truth.
- **Rationale:** Reusing TaskNotes avoids duplicate UI, status logic, and scheduling logic.
- **Alternatives considered:** Custom QuickAdd New task and Plan task scripts.
- **Implications:** TaskRPG must read configured TaskNotes fields and statuses; custom task-creation macros are removed from v1.
- **Revisit when:** TaskNotes cannot support a required workflow after validation.

## D-017—Separate task completion from RPG resolution

- **Status:** Accepted
- **Decision:** TaskRPG owns only task resolution and undo. Marking a TaskNotes task Done does not itself resolve the RPG turn in phase 1; the user runs `Task done`, which resolves an open TaskNotes task through the engine, and `Undo last` appends a correcting engine event (D-008).
- **Context:** Automatic integration with TaskNotes Workflows is unverified.
- **Rationale:** Manual resolution avoids depending on an untested trigger and keeps the first slice reliable.
- **Alternatives considered:** Automatically resolve on In Progress → Done transition.
- **Implications:** `Task done` requires an open TaskNotes task; duplicate protection must use recorded RPG resolution, not TaskNotes status. Automatic triggering may be added in phase 2 after validation.
- **Revisit when:** TaskNotes Workflows integration is validated.

## D-016—Use dice and tables for what happens

- **Status:** Accepted
- **Decision:** Dice and random tables determine events; AI narrates their presentation.
- **Context:** Pure AI generation can feel arbitrary and makes randomness harder to audit.
- **Rationale:** Real dice and plain table notes preserve surprise, reproducibility, and user control while still allowing narrative personalisation.
- **Alternatives considered:** Let the AI choose every story event directly.
- **Implications:** Tables must be maintained as notes; table usage must be tracked; narrator output follows rolled results.
- **Revisit when:** Table maintenance becomes too burdensome or randomness quality declines.

## D-015—Use layered character memory

- **Status:** Accepted
- **Decision:** Use core facts, recent sessions, monthly digests, pinned moments, campaign story logs, and shared canon.
- **Context:** Long-term character continuity can exceed practical context limits.
- **Rationale:** Layered memory keeps each character manageable over months while preserving important continuity.
- **Alternatives considered:** Load full transcripts; retain only a single summary.
- **Implications:** Agents must compress old sessions into digests; pinned moments must be protected; original summaries remain in GitHub history.
- **Revisit when:** Memory quality or context use becomes problematic.

## D-014—Separate shared progression from campaign story

- **Status:** Accepted
- **Decision:** Player progression is shared across campaigns; campaign story state is isolated by campaign ID.
- **Context:** Multiple campaigns may exist in one world.
- **Rationale:** Real tasks and habits reflect one player, while plot continuity should not leak between campaigns.
- **Alternatives considered:** Separate progression per campaign.
- **Implications:** A campaign-linked task awards shared progression once; campaign-specific events require approval to become shared canon.
- **Revisit when:** Campaign isolation requirements change.

## D-013—Use a 10 MP daily budget

- **Status:** Accepted
- **Decision:** Use a 10 MP daily budget that refills each morning.
- **Context:** v1 modelled real daily energy, which added input burden and guilt dynamics.
- **Rationale:** A fixed in-game budget encourages prioritisation without requiring health or energy data.
- **Alternatives considered:** Real-energy input; no MP limit.
- **Implications:** Task size, planning, urgency, importance, overdraft, and Wounded state all interact with MP.
- **Revisit when:** Real-world use shows the budget is too restrictive or too permissive.

## D-012—Make task Done a dice-based game turn

- **Status:** Accepted
- **Decision:** Completing a task triggers a 2d6 roll and instant table result.
- **Context:** v1 provided a story beat after real work, with less immediate novelty.
- **Rationale:** Immediate randomness makes completion feel like a game turn and reinforces the core novelty loop.
- **Alternatives considered:** AI-written story on every Done press.
- **Implications:** Dice result affects story only; XP and MP follow deterministic task rules.
- **Revisit when:** Live narration becomes reliable and desirable.

## D-011—Keep habits dice-free

- **Status:** Accepted
- **Decision:** Habit completion shows a one-line status rather than a dice roll or story beat.
- **Context:** Habits occur frequently and should remain low-friction.
- **Rationale:** A quick toast preserves habit momentum without making every routine completion narratively expensive.
- **Alternatives considered:** Give habits dice rolls and story beats.
- **Implications:** Habits still award HP and XP; narrative development is concentrated in tasks and sessions.
- **Revisit when:** Users want richer habit feedback.

## D-010—Use five fixed skills

- **Status:** Accepted
- **Decision:** Use Focus, Vitality, Craft, Mind, and Presence as the five skills.
- **Context:** The system needs broad coverage of real work and life domains without excessive complexity.
- **Rationale:** Five skills cover deep work, wellbeing, making, learning/admin, and social life while keeping progression legible.
- **Alternatives considered:** More granular skills; user-defined skills.
- **Implications:** Every task and habit maps to exactly one skill; companions and perks align to these skills.
- **Revisit when:** A required domain does not fit the five skills.

## D-009—Make HP habit-driven

- **Status:** Accepted
- **Decision:** Core habits restore HP; missed blocks cost HP, capped at 2 per day.
- **Context:** The system needs a gentle consequence loop for routines without punishing task backlog.
- **Rationale:** HP links wellbeing routines to game state and creates a recovery path through habit completion.
- **Alternatives considered:** HP driven by task completion; no HP loss.
- **Implications:** Wounded state affects dice and task MP cost; habits remain exempt from the Wounded MP surcharge.
- **Revisit when:** HP penalties feel punitive or ineffective.

## D-008—Use undo as a correcting event

- **Status:** Accepted
- **Decision:** Undo appends a correcting event rather than deleting or rewriting history.
- **Context:** The event log must remain auditable.
- **Rationale:** Correcting events preserve the original action, support replay, and prevent accidental data loss.
- **Alternatives considered:** Delete or edit the original event.
- **Implications:** Undo is limited to same-day eligible actions and cannot re-roll.
- **Revisit when:** A richer correction workflow is needed.

## D-007—Keep the engine dependency-free

- **Status:** Accepted
- **Decision:** Keep the engine as plain, dependency-free JavaScript with no Obsidian API access.
- **Context:** Vault Operator cannot run a terminal, and a future plugin port is possible.
- **Rationale:** A pure engine can run in QuickAdd, terminal tests, and a future plugin without rewriting rules.
- **Alternatives considered:** Build directly against Obsidian APIs.
- **Implications:** All file I/O remains in wrappers; engine tests run without Obsidian.
- **Revisit when:** A hard requirement makes direct Obsidian integration unavoidable.

## D-006—Keep notes as storage format

- **Status:** Accepted
- **Decision:** Keep `Events.md`, `Settings.md`, and `Hero.md` as Markdown notes.
- **Context:** The system must remain readable and portable inside Obsidian.
- **Rationale:** Markdown preserves human readability, vault compatibility, and future plugin compatibility.
- **Alternatives considered:** JSON or JSONL as the primary vault format.
- **Implications:** Terminal tests may use an equivalent JSONL path, but the live vault format remains Markdown.
- **Revisit when:** Performance, concurrency, or querying requirements justify migration.

## D-005—Use Vault Operator for narrator and characters

- **Status:** Accepted
- **Decision:** Run narrator and character agents in Vault Operator inside Obsidian.
- **Context:** The user wants in-vault character interaction rather than a terminal workflow.
- **Rationale:** Vault Operator provides sidebar chat, vault access, and persona-based agents without building a custom agent framework.
- **Alternatives considered:** Custom plugin; external chat app; terminal agent.
- **Implications:** Desktop-only; provider data terms apply; agents require controlled write permissions.
- **Revisit when:** Vault Operator limitations block required interactions.

## D-004—Use one agent per character

- **Status:** Accepted
- **Decision:** Use one narrator agent and one agent per recurring character, each with its own persona file.
- **Context:** Character continuity and voice require isolated persona and memory.
- **Rationale:** Separate agents make persona, memory, and relationship tracking easier to reason about.
- **Alternatives considered:** One multi-character agent.
- **Implications:** Session summaries and memory writes are character-scoped; campaign context must be explicitly selected.
- **Revisit when:** Agent count or provider limits make separate agents impractical.

## D-003—Use a tutorial arc

- **Status:** Accepted
- **Decision:** Introduce mechanics gradually through a tutorial arc.
- **Context:** The full system has many interacting mechanics.
- **Rationale:** Staged unlocks reduce initial cognitive load and let the user learn the loop through play.
- **Alternatives considered:** Enable all mechanics from day one.
- **Implications:** Locked rules remain visible in settings but inactive; a skip-ahead command may unlock features early.
- **Revisit when:** Onboarding feels too slow or too restrictive.

## D-002—Use projects, arcs, and quests

- **Status:** Accepted
- **Decision:** Represent long-term work as projects, work stages as arcs, and real tasks as quests.
- **Context:** TaskRPG needs a narrative structure for multi-week work.
- **Rationale:** This mapping connects real project progress to story progression without changing task ownership.
- **Alternatives considered:** Fixed-length seasons; flat task lists.
- **Implications:** Projects have arcs and quest backlogs; threat level rises with completed arcs; focus projects receive an XP bonus.
- **Revisit when:** Project workflow proves too heavy.

## D-001—Use boss challenges as real-world criteria

- **Status:** Accepted
- **Decision:** Boss challenges are engine-checked real-world challenges, not dice fights.
- **Context:** The system needs meaningful milestone challenges tied to actual behaviour.
- **Rationale:** Engine-checked criteria prevent honour-system completion and connect rewards to real progress.
- **Alternatives considered:** Dice-based boss combat.
- **Implications:** Challenges use a fixed engine-owned type menu; rewards may include one small perk per skill.
- **Revisit when:** More challenge variety is needed.
