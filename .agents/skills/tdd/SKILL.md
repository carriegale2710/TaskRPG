---
name: tdd
description: >-
  Test-driven development rules for any behaviour you can verify: the red-green
  loop, what makes a test worth keeping, how to keep a failing suite honest, and
  the manual-check substitute where unit tests cannot reach. Use when
  implementing a feature or fixing a bug that has behaviour to prove, when
  writing or changing tests, when a project requires test-first development, or
  when a suite looks green but may be proving nothing. Not for prose,
  documentation or settings-only edits.
user-invocable: true
---

# Test-Driven Development

Default to test-driven development for any behaviour you can check. Write the check first, watch it fail for the right reason, then make it pass.

TDD earns its place for three reasons, in order of value:

1. **It writes the acceptance criterion down.** The test is the rule in executable form, so "done" has a definition before any code exists. A rule you cannot state as a test is a rule you have not finished deciding.
2. **It checks the design before you build it.** Writing the test first forces the interface, the data and the edge cases to be chosen early, and surfaces a wrong design while it is still cheap. If the test is awkward to write, that is information about the design, not a reason to skip the test.
3. **It keeps the rule fixed afterwards.** The test catches the later change that quietly breaks something.

Test quality matters far more than commit shape. Failing tests are not a problem to hide: a failing test is the clearest to-do item you can leave yourself.

## The loop

1. **Red.** Write the smallest test that states the rule, bug or requirement. Run it and read the output.
2. **Confirm the failure.** It must fail on the assertion you intended, not on a typo, a wrong path, a missing import or a syntax error. A test that has never failed has not been shown to test anything.
3. **Green.** Write the least code that makes it pass. Do not add behaviour the test does not cover.
4. **Reprove.** Confirm the test fails again if the implementation breaks (see "No vanity tests").
5. **Refactor.** With the test green, tidy the code and keep the test green. Do not refactor and change behaviour in one step.
6. **Report.** In your reply, state the failing result you saw, the command you ran, and the passing result.

One slice at a time: one behaviour, one test, one minimal implementation per cycle. Work in **vertical slices** — test, implement, test, implement. Writing all the tests first and then all the implementation ("horizontal slicing") delays the first real feedback and hides design problems until they are expensive to fix.

If writing the test exposes an ambiguity, or a design decision the project's documentation does not answer, stop and confirm with the user rather than baking a guess into the test.

## Test at seams

A **seam** is the public boundary you test at: the interface where you observe behaviour without reaching inside. Tests live at seams, never against internals. Code can change entirely; tests should not. A good test reads like a specification and survives a refactor because it does not care about internal structure.

Where the project already has a convention for which boundaries are under test, follow it. Where it does not, agree the seams with the user before writing tests, and do not write a test at an unconfirmed seam.

## No vanity tests

A test earns its place only if it can fail for the right reason. A suite that would pass against broken code is worse than no suite, because it buys false confidence.

- **Assert behaviour, not current output.** Expected values come from the requirement or from a worked example you can compute by hand — never from whatever the code happens to print today. Copying actual output into `expected` locks in the bug.
- **Prove the test bites.** Once it passes, break the implementation deliberately: flip the boundary, move a threshold by one, change a constant, return early. Confirm the test fails, then restore the code. A test that survives a broken implementation is a vanity test. Do this for every new rule, every new test file, and any test whose subject you cannot reason about confidently.
- **Name the rule, and keep one behaviour per test.** The name should tell a reader which requirement is being protected. A name like `works correctly` protects nothing.
- **Cover the boundaries, not the middle.** The rules live at the edges: the threshold either side, the minimum and the maximum, the empty input, the invalid setting, the day or period boundary. A happy-path test alone rarely catches a real regression.
- **Assert the outcome, not the implementation.** Test what the code returns and records, not the private helper it happens to call. A test that breaks when you rename an internal function is testing the wrong thing. A test that mocks internal collaborators, tests private methods, or verifies through a side channel is implementation-coupled: the tell is that it breaks on a refactor that did not change behaviour.
- **No tautologies.** Do not assert a value against itself, re-implement the rule inside the test to compute the expectation, or assert a constant the test itself just defined. An assertion that recomputes the expected value the way the code does can never disagree with the code.
- **Keep fixtures independent.** No order dependence, no shared mutable state between tests, no state leaking from one test into the next.
- **Make failures legible.** A failure should show the rule, the input and the expectation without needing a debugger. Prefer asserting a whole result object or explicit fields over a bare truthiness check.
- **Treat an instantly-passing test with suspicion.** Either it covers behaviour that already works — fine, but say so — or it is not testing what you meant. Work out which before moving on.
- **Coverage is not the target.** Catching a real break is. One boundary test that bites beats ten that assert the code equals itself.

## Failing tests are the to-do list

Unfinished work should be visible in the suite rather than in your head.

- **Failing tests for unbuilt or half-built features are welcome on a feature branch.** They document the acceptance criteria, confirm the intended design, and list what is left. Keep them clear enough that the failure message alone tells you what to build.
- **The one hard line is the merge to the default branch.** The default branch does not merge with failing tests for the feature it delivers — either the tests pass, or the unfinished ones are moved out into the backlog or an issue, with the reason recorded. Failing tests elsewhere on the branch are fine.
- **Do not silence a red test to make a run green.** Converting a failing test to `skip` or `todo` deletes the reminder and hides the gap. If a test genuinely must stand down (flaky, blocked by an unverified integration), skip it with a comment naming the reason and the follow-up, and record it where the project keeps its test notes. A skipped test with no reason is a deleted test.
- **When you work a red test, satisfy it.** Make the implementation meet the test, or openly record that the expectation was wrong and why. Never quietly rewrite the test to match the code.
- **Keep the list readable from outside the code.** The project's test notes say what is failing, what it is for and what remains.

## Rules that keep it honest

- **Do not weaken a test to get a pass.** No deleting, skipping, loosening or inverting assertions, and no widening tolerances to match current output. If the expected value is genuinely wrong, say so and why before changing it.
- **A rule change starts with the test.** When the requirement changes, change the test first, then the implementation, and record the change in the project's changelog.
- **Read the whole failing run.** Fix the cause, not the symptom. If a change breaks an unrelated test, chase it before moving on.
- **Bugs get a failing regression test first.** Reproduce the reported behaviour as a test that fails, then fix it. Do not fix from a description alone when the behaviour is reachable from the code.
- **Keep tests deterministic.** Fixed inputs, fixed clock, fixed randomness, following the existing test files, so the result is identical on any machine and time zone.
- **Keep tests out of the way of live data.** Tests use frozen configuration and fixtures; they never write to live records.
- **Report honestly what is proven.** Separate "automated test passes" from "verified in the real application" from "assumed". Do not let a green unit test stand in as proof that an integration works.

## Tests and commits

Commit shape is not the goal, and history is not the artefact — the tests are. Where it is cheap and honest, land the test as its own `test:` commit before the implementation, then the `feat:`, `fix:` or `refactor:` commit that makes it pass. That ordering removes any doubt about whether a test was shaped to fit finished code. When the split is awkward, commit them together; ceremony serves nobody. Squash the branch before merge if that is the project's habit.

Two things do still matter:

- **A commit holding failing tests must say so.** If a commit contains tests for a feature that is not built yet, the commit message and the changelog line describe the tests as pending. Never let a commit message claim behaviour that does not exist.
- **Do not settle a disagreement by editing the assertion.** If a test is wrong, say what is wrong with it and why, then change it. Reaching for the expected value to end a red run is the failure mode this whole workflow exists to prevent.

## Where tests go and how to run them

Use the project's own convention; do not invent a second one. In general:

- Tests live beside the code they cover, named for the module or rule under test.
- Use the project's runner and the project's own command. Add a new test file to the command list in the project's test notes so a fresh reader runs the same suite.
- When you add a test for a rule, add its row to the project's rule-to-test table so the acceptance criteria stay in one place.
- When you change a rule, change its test in the same edit.

## Where TDD cannot reach

Some behaviour cannot be unit tested: anything that only exists inside an application, a plugin, a device or a user interface. The equivalent of a test-first step is still available — write the acceptance criteria down before building, then check against them.

1. Before coding, write the steps, the exact command or button, and the expected notice, log line and file change into the project's test notes or step file. This is the acceptance criterion; it is what makes the slice "done".
2. Build the slice, then run that manual check and record the real result, including the exact error when it fails.
3. Until it is run, describe the integration as unverified. A described manual check is not evidence.
4. Humility applies more here, not less: this is the part you cannot prove with a test, so report it as assumed rather than letting a green unit-test run imply that the integration works.

Point a first integration check at a throwaway fixture or scratch record, never at live data.

## When not to test first

- Prose, documentation and configuration changes, and settings edits a person makes by hand. Nothing to assert; get the docs in sync instead.
- Exploratory spikes where you genuinely do not know the shape of the answer yet. Spike, throw the spike away, then write the test and the real implementation. Say that you are spiking rather than quietly skipping the test.
- One-line mechanical edits with a directly related existing test that already covers them. No new test is needed; the existing test is the check.
