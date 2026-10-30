# TaskRPG Decision Log

**Last Updated**: 2026-10-27
Newest first. A decision stays active until marked `Superseded`.

Statuses: **Accepted** (settled; agents follow it), **Provisional** (revisable default), **Superseded** (inactive; link replacement).

## D-033—A duplicate taskId blocks Undo and Task done; nothing is saved

- **Status:** Accepted
- **Decision:** If more than one note in the configured tasks folder carries the same `taskId`, `Task done` and `Undo last` stop before any write. Neither appends an event, edits a note or rewrites `Hero.md`. The Notice tells the user to change the `taskID` to remove the duplicate and says nothing was saved. A missing note or a missing tasks folder does not block: Undo still saves its correction and says what was not found.
- **Context:** `findTaskPath` silently used the first matching note, so Undo could reopen the wrong note (issue #18). Issue #15 left "first match vs error" undecided. The first version of PR #22 saved the undo event and warned; the user chose to save nothing instead.
- **Rationale:** With two notes sharing an ID, neither script can tell which note the event belongs to. Saving a correction that cannot be applied to the right note leaves the log and the vault disagreeing. Refusing keeps them aligned and sends the user to the cause.
- **Alternatives considered:** Use the first match and warn (may edit the wrong note); save the undo event and warn (log and notes disagree until fixed by hand).
- **Implications:** One shared lookup, `findTaskNote()` in `task-utils.js`, returns `found`, `not_found`, `folder_missing` or `ambiguous`; both scripts call it. The lookup scans only the top level of the tasks folder, so a duplicate in a subfolder is not detected. Covered by `undo.test.js`, `task-done.test.js` and `task-utils.test.js`.
- **Revisit when:** TaskNotes writes its own unique ID, or the lookup must search subfolders.

## D-032—AI agent host stays undecided and docs stay host-agnostic

- **Status:** Accepted
- **Decision:** TaskRPG does not depend on a named Obsidian AI plugin. All documentation, prompts, personas and rules describe an "AI agent host" defined only by capabilities: persistent persona or system prompt, selected vault context, scoped writes with approval, and a selectable model. The candidate set is Obsidian Copilot, Text Generator and Vault Operator; the final choice is deferred to the Step 4 host check.
- **Context:** D-005 named Vault Operator as the narrator host. The user has not settled on it and may use Obsidian Copilot or Text Generator. Naming one plugin across the PRD, architecture and build plan would make every host swap a documentation rewrite and imply unverified behavior.
- **Rationale:** The host is replaceable infrastructure around fixed plain-Markdown persona and prompt contracts. Capability-based requirements keep the engine, file ownership and safety rules unchanged whichever plugin wins.
- **Alternatives considered:** Keep Vault Operator as the default and note alternatives in one place (leaves host-specific claims scattered through the docs); pick Copilot or Text Generator now (premature before the host check).
- **Implications:** No doc may assert host-specific features as working. `docs/PLUGINS.md` section 5 holds the candidate list and required capabilities. Step 4 validates the chosen host and records version, tested features and gaps in `docs/TESTING.md`. Persona files and prompts stay host-neutral Markdown. `gm_bridge.py` remains an optional terminal fallback and is not the host.
- **Revisit when:** A host is chosen and validated in Step 4, or a required capability is missing from every candidate.

## D-031—Undo has no confirmation step

- **Status:** Accepted
- **Decision:** `Undo last` runs immediately with no prompt. One Notice reports what was reversed and what could not be found.
- **Context:** PRD 3.17 already removed confirmation from Done to preserve instant reward; undo was silent on the question. User confirmed no confirmation for undo.
- **Rationale:** Undo is recoverable by pressing Done again, creates a fresh logged roll, and never rewrites the log, so a prompt adds friction without preventing loss.
- **Alternatives considered:** Confirm-only-when-loot-drops; block undo once more than one action happened that day.
- **Implications:** No modal, no second QuickAdd step. Undo cost has no performance target; measure after real use and record the number here if it needs one.
- **Revisit when:** Undo starts touching irreversible effects, or measured replay time becomes noticeable.

## D-030—Undoing a task removes loot gifted from it and reduces that affinity

- **Status:** Accepted
- **Decision:** When undo reverses a `task_done` that produced an item which was later gifted, the item is removed from the recipient and the affinity raised by that gift is reduced by the same amount. The gift line stays in the event log and replays as void. A gift is still never an undo target itself.
- **Context:** PRD line 372 said gifts cannot be undone. User chose that undoing the source task must also remove the gifted item rather than leave a phantom item or block the undo.
- **Rationale:** State must match the log. If the item never existed, the gift could not have happened, so affinity earned from it cannot stand.
- **Alternatives considered:** Refuse undo of a task whose loot was gifted; leave the item with the recipient; make the gift line ineligible and leave affinity.
- **Implications:** PRD 3.17 and the Build defaults Undo row now state the cascade. Engine replay must skip a gift whose source item was undone and subtract its affinity. Not implementable yet: no gift event, inventory, or companion affinity code exists (`TaskRPG/Scripts` has no matches). Tracked in `docs/BUILD_PLAN.md` Step 3 undo substeps.
- **Revisit when:** Gifts, inventory, and companions are built, or gifting is cut from scope.

## D-029—Story prose rolls back on undo, matched by event tag

- **Status:** Accepted
- **Decision:** The narrator tags each line it writes in response to a resolved action with a trailing `<!-- evt:<eventId> -->` comment in `Story/`, `Campaign/`, `World/`, and `Characters/` notes. Undo removes every line carrying the target event ID and collapses the resulting blank-line gap. Untagged prose, tables, and links stay, even when they mention the undone action; the Notice reports the removed count and what was left.
- **Context:** PRD 3.17 previously rewrote hero and note state only, and BUILD_PLAN asked to "restore Story state" with no rule or mechanism. Story files contain no tags today, and prose has no natural identity to match.
- **Rationale:** A trailing HTML comment is invisible in reading view, survives inside tables, and needs no snapshot or timestamp matching. Line-level removal is deterministic and testable with a pure helper like `removeHabitLogLine`.
- **Alternatives considered:** Whole-file snapshots (deletes unrelated canon, breaks shared multi-campaign canon); date matching (removes correct prose when two actions share a day); narrator rewriting history after undo (nondeterministic, fails offline); block-level tags (no table support).
- **Implications:** Narrative text written without a tag survives undo forever. No backfill for existing prose: dates in `Campaign/02 Story So Far` cannot be mapped to event IDs reliably. A line covering two actions is tagged with both IDs and is removed when either is undone, an accepted over-removal. Event log and dice stay; removed prose stays in git history. Graph and backlink checks belong in manual verification.
- **Revisit when:** Narrator output is generated by a fixed template that could carry block IDs, or untagged prose drift becomes a problem.

## D-028—Undo reverses derived state and uses the original action's rules

- **Status:** Accepted
- **Decision:** Undo recomputes state by replaying the log with the target event excluded, so MP, HP, skill XP, skill levels, habit cost tier, Wounded and Tired, focus effect, inventory, loot, and companion XP and affinity all return to pre-action values. A level gained by the undone action is reversed with its MP discount. Rules come from the settings in force at the target action's timestamp, not current settings.
- **Context:** PRD 3.17 listed only MP, XP, HP, and loot. BUILD_PLAN said "restore Hero state" without naming derived values, and PRD 3.23 says a settings change never rewrites the past.
- **Rationale:** Replay is the only source of truth; stored deltas would drift. Per-event rules keep old days under old rules.
- **Alternatives considered:** Subtract stored deltas from the action result (misses threshold effects); recompute with current settings (contradicts 3.23).
- **Implications:** `recalculate()` already replays; undo must render `Hero.md` from that result. Hooks needed for habit cost tier and, later, companion affinity. Tests must cover a level-up reversal and an undo after a settings change.
- **Revisit when:** A derived value cannot be recomputed from the log, or replay cost becomes measurable.

## D-027—Undo targets tasks and habits only, newest first, repeatable

- **Status:** Accepted
- **Decision:** Only `task_done` and `habit_done` are undoable. Boss challenges, gifts, rest days, pause and resume, focus project, arc completion, settings change, and missed deadlines are never targets and never block an older eligible action. Each press reverses one action; repeated presses unwind the same game day's stack, newest first, until empty. An `undo` event is never itself undone. Same day uses the configured day boundary.
- **Context:** PRD 3.17 said "newest eligible action" without defining eligible, and "one at a time" could be read as one undo per day. Eligibility lived only in a Build defaults row.
- **Rationale:** Stack semantics match the engine's `lastActionByDay` and let a mis-clicked pair be corrected without touching unrelated actions. Undoing an undo would re-apply an effect the user rejected.
- **Alternatives considered:** One undo per day (strands a second mistake); undo any event type (reverses administrative actions with no user-visible meaning); undo-of-undo as redo.
- **Implications:** Engine validation rejects a target that is not the stack top or not from the same game day. `undo.js` reads the top of the stack. Nothing-to-undo writes nothing and says so.
- **Revisit when:** A redo action is wanted, or an event type gains a user-visible effect that undo should cover.

## D-026—Undo removes the habit history line it added

- **Status:** Accepted
- **Decision:** `undo.js` removes the one habit-note line whose timestamp matches the undone `habit_done` event. Other lines in that note, other habit notes, and task notes stay untouched. If no note or line matches, the undo still logs and says so.
- **Context:** `habit-done.js` appends a line per press, but undo only appended a correcting event, leaving the note claiming a completion the engine had reversed.
- **Rationale:** The habit body is a visible log, not the event log, so it must match engine state. Timestamp matching removes exactly the line that press added without needing a history ID. PRD 3.17 keeps the event log append-only.
- **Alternatives considered:** Leave the note (visible drift); rebuild the whole history from events (more code, rewrites user editing); mark the line undone instead of removing (note keeps a false entry).
- **Implications:** `removeHabitLogLine()` in `task-utils.js`; habit lookup by `habitId` in `TaskRPG/Engine/Habits/`. Notice text changes from "Habit notes are unchanged" to removed-or-not-found.
- **Revisit when:** Habit presses need a durable per-line ID, or users want undone entries kept and struck through.

## D-025—The task result card is a Notice, not a modal

- **Status:** Accepted
- **Decision:** `task-done.js` shows the result card in a single 15-second `Notice`. QuickAdd's `obsidian.Modal` and the modal fallback wrapper are removed.
- **Context:** The modal was never observed: every run produced the Notice fallback. `obsidian` is not reliably a global in a QuickAdd user script loaded by read/eval, and the `try`/`catch` hid which branch ran. User asked for the Notice only.
- **Rationale:** One display path, no swallowed error, no dependency on an unavailable global. The Notice already carries the full card (roll, outcome, table result, XP/MP, loot) and clicking dismisses it (PRD 3.15).
- **Alternatives considered:** Keep the modal with an explicit error Notice in `catch`; report the global from QuickAdd to inject `Modal`.
- **Implications:** The result-card acceptance criteria in PRD 3.15 say Notice. `task-done.test.js` asserts exactly one Notice containing `**Outcome:**`. The "result modal untested" gap closes; mobile Notice rendering stays unverified.
- **Revisit when:** A modal is wanted for readability and QuickAdd exposes `obsidian` to user scripts.

## D-024—`Task done` always writes `status: done`

- **Status:** Accepted
- **Decision:** `task-done.js` overwrites the note's `status` with `done` and stamps `completedDate`. Prior status is not preserved.
- **Context:** The script preserved whatever status the note held, so a resolved task could still read `open`/`in-progress`. User confirmed TaskNotes detects a status written straight to frontmatter, so no plugin API call is needed.
- **Rationale:** One rule: a resolved RPG turn means a completed note. Symmetric with undo writing `open` (D-021). `done` is configured with `isCompleted: true` in this vault.
- **Alternatives considered:** Keep status untouched (note and log disagree); read `customStatuses` and write whichever entry is completed (more code, same result here).
- **Implications:** Removes the "TaskRPG preserves TaskNotes status" claim from PRD 3.9, `TESTING.md`, `CHANGELOG.md`. Test starts the note at `open`. Write stays frontmatter-only via `updateTaskStatus`.
- **Revisit when:** `done` is renamed or removed, or a different completion value is configured.

## D-023—Task identity is a `taskId` frontmatter field, not the file path

- **Status:** Accepted
- **Decision:** Every task note carries a stable `taskId`. New notes get it from the TaskNotes body template (`taskId: {{nano}}`).
- **Context:** TaskNotes 4.13.8 writes no per-task ID and identifies tasks by tag; its identity is the file path. Events need an identity that survives renames for undo matching.
- **Rationale:** A field travels with the note, survives moves, and does not depend on folder layout. `{{nano}}` comes from TaskNotes, so TaskRPG invents nothing.
- **Alternatives considered:** Vault-relative path (fragile on rename); writing the field on first resolution (mutates the note beyond status).
- **Implications:** Both scripts read `taskId` from frontmatter; no script change was needed. Body-template merge verified on 4.13.8 (2026-10-21): `taskId` written, `tags`/`status` preserved. Backfill script is dry-run by default because `TaskNotes/` is gitignored. Notes also need `skill` and `size`.
- **Revisit when:** TaskNotes writes its own stable ID or the template cannot set frontmatter.

## D-022—A task note is identified by TaskNotes' tag, not a `type` field

- **Status:** Accepted
- **Decision:** A note is a task when it carries the configured `taskTag` (from `data.json`, fallback `task`) and a non-empty `taskId`. No `type` requirement.
- **Context:** The script required `type: task`, but TaskNotes 4.13.8 writes no such field and identifies by tag. 0 of 11 real notes had `type`, so every real note was refused.
- **Rationale:** Uses the plugin's identification, follows renamed tags, needs no migration.
- **Alternatives considered:** Add `type: task` via template and backfill (duplicate identity that can drift); keep and ask the user to edit notes (breaks existing notes).
- **Implications:** `taskTag()` mirrors `taskFolder()`. A note with `type: task` but no tag is refused; leftover `type` is harmless. Covered by tests, not run on a live note with `skill`/`size`.
- **Revisit when:** TaskNotes adds a type field or changes `taskIdentificationMethod`.

## D-021—Undo restores the TaskNotes default `open` status

- **Status:** Accepted
- **Decision:** `Undo last` sets the matching note to `open` and clears `completedDate`. No previous-status lookup; event schema unchanged.
- **Context:** Undo cleared only `completedDate`, leaving the note Done while the log treated the task as unresolved (issue #19).
- **Rationale:** `open` is the plugin default, keeps the note consistent with unresolved state, and avoids storing a guessed prior status.
- **Alternatives considered:** Preserve status; restore it from the event log (schema change).
- **Implications:** `open` lives once as `OPEN_TASK_STATUS` in `task-utils.js`; the edit goes through the frontmatter-only writer (issue #14). Verified against 4.13.8.
- **Revisit when:** Configured statuses or `defaultTaskStatus` change.

## D-020—Event log as source of truth

- **Status:** Accepted
- **Decision:** One shared append-only event log is the source of truth for shared progression.
- **Context:** v1 used the daily journal, which made reconstruction and correction hard.
- **Rationale:** Auditable progression, replay, undo without history rewriting, game state separate from journal prose.
- **Alternatives considered:** Daily journal as truth; JSON state store.
- **Implications:** Hero note is a derived cache; every meaningful action appends an event; recalculation replays events.
- **Revisit when:** Log size or concurrent edits make Markdown impractical.

## D-019—Immersion is the v1 priority

- **Status:** Accepted
- **Decision:** Prioritise an immersive RPG layer before external integrations.
- **Context:** Boredom and lack of novelty are the main reasons projects and routines are abandoned.
- **Rationale:** Immersion sustains productive behaviour; external sync does not fix motivation.
- **Alternatives considered:** Productivity mechanics with a story wrapper; immediate external sync.
- **Implications:** v1 focuses on narrator, characters, dice, tables, memory, progression; sync is deferred.
- **Revisit when:** The core loop is stable and external tasks become the main friction.

## D-018—Use TaskNotes as the task layer

- **Status:** Accepted
- **Decision:** TaskNotes owns task creation, planning, scheduling and user fields (`skill`, `size`, `urgent`, `important`). TaskRPG owns resolution, undo, and the two status writes (`done`, `open`; D-024).
- **Context:** Duplicating task management in QuickAdd would create competing sources of truth.
- **Rationale:** Reuse avoids duplicate UI, status logic and scheduling logic.
- **Alternatives considered:** Custom QuickAdd New task and Plan task scripts.
- **Implications:** TaskRPG reads configured TaskNotes fields; custom task-creation macros are removed from v1. Status ownership changed in D-024.
- **Revisit when:** TaskNotes cannot support a required workflow.

## D-017—Separate task completion from RPG resolution

- **Status:** Accepted
- **Decision:** TaskRPG owns resolution and undo. Marking Done in TaskNotes does not itself resolve the RPG turn in phase 1; the user runs `Task done` on an open task, and `Undo last` appends a correction (D-008).
- **Context:** Automatic TaskNotes Workflows integration is unverified.
- **Rationale:** Manual resolution avoids an untested trigger and keeps the first slice reliable.
- **Alternatives considered:** Resolve automatically on In Progress → Done.
- **Implications:** `Task done` requires an open TaskNotes task; duplicate protection uses recorded RPG resolution, not TaskNotes status. Automatic triggering may come in phase 2.
- **Revisit when:** TaskNotes Workflows integration is validated.

## D-016—Dice and tables decide what happens

- **Status:** Accepted
- **Decision:** Dice and random tables determine events; AI narrates presentation.
- **Context:** Pure AI generation feels arbitrary and is hard to audit.
- **Rationale:** Real dice and plain table notes preserve surprise, reproducibility and user control, with narrative personalisation.
- **Alternatives considered:** AI chooses every story event.
- **Implications:** Tables are notes; usage is tracked; narrator output follows rolled results.
- **Revisit when:** Table upkeep becomes burdensome or randomness quality drops.

## D-015—Layered character memory

- **Status:** Accepted
- **Decision:** Core facts, recent sessions, monthly digests, pinned moments, campaign logs, shared canon.
- **Context:** Long-term continuity can exceed context limits.
- **Rationale:** Keeps characters manageable over months while preserving continuity.
- **Alternatives considered:** Full transcripts; one summary.
- **Implications:** Agents compress old sessions; pinned moments are protected; originals stay in GitHub history.
- **Revisit when:** Memory quality or context use becomes problematic.

## D-014—Shared progression, isolated campaign story

- **Status:** Accepted
- **Decision:** Player progression is shared across campaigns; campaign story state is isolated by campaign ID.
- **Context:** Multiple campaigns may share one world.
- **Rationale:** Real tasks reflect one player; plot continuity should not leak between campaigns.
- **Alternatives considered:** Separate progression per campaign.
- **Implications:** A campaign-linked task awards progression once; campaign events need approval to become shared canon.
- **Revisit when:** Campaign isolation requirements change.

## D-013—10 MP daily budget

- **Status:** Accepted
- **Decision:** 10 MP, refilled each morning.
- **Context:** v1 modelled real daily energy, adding input burden and guilt.
- **Rationale:** A fixed in-game budget encourages prioritisation without health data.
- **Alternatives considered:** Real-energy input; no MP limit.
- **Implications:** Task size, planning, urgency, importance, overdraft and Wounded interact with MP.
- **Revisit when:** Real use shows the budget too tight or too loose.

## D-012—Task Done is a dice-based game turn

- **Status:** Accepted
- **Decision:** Completing a task triggers a 2d6 roll and instant table result.
- **Context:** v1 gave a story beat after work, with less immediate novelty.
- **Rationale:** Immediate randomness makes completion feel like a turn and reinforces the loop.
- **Alternatives considered:** AI-written story on every Done press.
- **Implications:** Dice affect story only; XP and MP follow deterministic rules.
- **Revisit when:** Live narration becomes reliable and desirable.

## D-011—Habits stay dice-free

- **Status:** Accepted
- **Decision:** Habit completion shows a one-line status, no dice roll or story beat.
- **Context:** Habits are frequent and must stay low-friction.
- **Rationale:** A toast preserves momentum without making every routine narratively expensive.
- **Alternatives considered:** Dice rolls and story beats for habits.
- **Implications:** Habits still give HP and XP; narrative development stays in tasks and sessions.
- **Revisit when:** Users want richer habit feedback.

## D-010—Five fixed skills

- **Status:** Accepted
- **Decision:** Focus, Vitality, Craft, Mind, Presence.
- **Context:** Broad coverage of work and life without excessive complexity.
- **Rationale:** Five covers deep work, wellbeing, making, learning/admin and social life while keeping progression legible.
- **Alternatives considered:** More granular skills; user-defined skills.
- **Implications:** Every task and habit maps to one skill; companions and perks align to these.
- **Revisit when:** A required domain does not fit.

## D-009—HP is habit-driven

- **Status:** Accepted
- **Decision:** Core habits restore HP; missed blocks cost HP, capped at 2/day.
- **Context:** A gentle consequence loop for routines without punishing task backlog.
- **Rationale:** HP links wellbeing routines to game state and gives a recovery path.
- **Alternatives considered:** HP from task completion; no HP loss.
- **Implications:** Wounded affects dice and task MP; habits are exempt from the Wounded surcharge.
- **Revisit when:** HP penalties feel punitive or ineffective.

## D-008—Undo is a correcting event

- **Status:** Accepted
- **Decision:** Undo appends a correction; it never deletes or rewrites history.
- **Context:** The event log must stay auditable.
- **Rationale:** Corrections preserve the original action, support replay, prevent data loss.
- **Alternatives considered:** Delete or edit the original event.
- **Implications:** Undo is same-day eligible actions only and cannot re-roll.
- **Revisit when:** A richer correction workflow is needed.

## D-007—Engine stays dependency-free

- **Status:** Accepted
- **Decision:** Plain, dependency-free JavaScript, no Obsidian API.
- **Context:** An in-vault AI host cannot run a terminal; a future plugin port is possible.
- **Rationale:** A pure engine runs in QuickAdd, terminal tests and a future plugin without rewriting rules.
- **Alternatives considered:** Build against Obsidian APIs.
- **Implications:** All file I/O in wrappers; tests run without Obsidian.
- **Revisit when:** A hard requirement forces direct Obsidian integration.

## D-006—Notes are the storage format

- **Status:** Accepted
- **Decision:** `Events.md`, `Settings.md`, `Hero.md` stay Markdown notes.
- **Context:** Must remain readable and portable inside Obsidian.
- **Rationale:** Markdown preserves readability, vault compatibility and future plugin compatibility.
- **Alternatives considered:** JSON or JSONL as the primary format.
- **Implications:** Terminal tests may use equivalent JSONL; live vault stays Markdown.
- **Revisit when:** Performance, concurrency or querying justify migration.

## D-005—AI agent host runs narrator and characters

- **Status:** Superseded by D-032
- **Decision:** Narrator and character agents run in an Obsidian AI agent host, not in a terminal workflow.
- **Context:** User wants in-vault character interaction, not a terminal workflow. The original entry named Vault Operator; that choice is no longer settled.
- **Rationale:** Sidebar chat, vault access and persona agents without a custom framework.
- **Alternatives considered:** Custom plugin; external chat app; terminal agent.
- **Implications:** Desktop-only; provider data terms apply; controlled write permissions required.
- **Revisit when:** Superseded by D-032; host choice revisited there.

## D-004—One agent per character

- **Status:** Accepted
- **Decision:** One narrator agent, one agent per recurring character, each with a persona file.
- **Context:** Continuity and voice need isolated persona and memory.
- **Rationale:** Easier to reason about persona, memory and relationships.
- **Alternatives considered:** One multi-character agent.
- **Implications:** Summaries and memory writes are character-scoped; campaign context is selected explicitly.
- **Revisit when:** Agent count or provider limits make it impractical.

## D-003—Tutorial arc

- **Status:** Accepted
- **Decision:** Introduce mechanics gradually through a tutorial arc.
- **Context:** Many interacting mechanics.
- **Rationale:** Staged unlocks lower initial load and teach the loop through play.
- **Alternatives considered:** Everything from day one.
- **Implications:** Locked rules stay visible but inactive; a skip-ahead command may unlock early.
- **Revisit when:** Onboarding feels too slow or restrictive.

## D-002—Projects, arcs and quests

- **Status:** Accepted
- **Decision:** Long-term work is projects; stages are arcs; real tasks are quests.
- **Context:** Multi-week work needs narrative structure.
- **Rationale:** Connects real progress to story progression without changing task ownership.
- **Alternatives considered:** Fixed-length seasons; flat task lists.
- **Implications:** Arcs and quest backlogs; threat rises with finished arcs; focus projects get an XP bonus.
- **Revisit when:** The workflow proves too heavy.

## D-001—Boss challenges are real-world criteria

- **Status:** Accepted
- **Decision:** Engine-checked real-world challenges, not dice fights.
- **Context:** Milestone challenges must tie to actual behaviour.
- **Rationale:** Engine checks prevent honour-system completion and connect rewards to progress.
- **Alternatives considered:** Dice-based boss combat.
- **Implications:** Fixed engine-owned type menu; rewards may include one small perk per skill.
- **Revisit when:** More variety is needed.
