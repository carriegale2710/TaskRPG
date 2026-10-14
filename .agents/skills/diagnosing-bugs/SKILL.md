---
name: diagnosing-bugs
description: Systematically diagnose a bug by forming hypotheses, running experiments, and converging on the root cause. Use when the user has a bug they can't explain, mentions unexpected behavior, or asks why something isn't working.
---

# Diagnosing Bugs

Diagnosis is a **hypothesis-experiment loop**. Every run of this skill converges on a root cause by narrowing the hypothesis space one experiment at a time.

## The loop

1. **State the symptom precisely.** What is observed? What was expected? When did it start? Vague symptoms produce vague hypotheses — sharpen the symptom before forming any hypothesis.

2. **Form hypotheses.** List every plausible cause. Don't stop at the first plausible one. A hypothesis is a falsifiable claim: "X causes Y because Z." No just-so stories.

3. **Rank by probability × cheapness.** Test the hypothesis most likely to be true and cheapest to check first. Don't run expensive experiments when a cheap one can eliminate half the list.

4. **Design a decisive experiment.** A good experiment has a clear expected outcome for each hypothesis: "if H1, I expect A; if H2, I expect B." An experiment that confirms nothing regardless of outcome is wasted.

5. **Run it. Read the result.** Don't interpret before reading. What actually happened? Compare to expectations.

6. **Update the hypothesis list.** Eliminate falsified hypotheses. Refine survivors. Add new ones the result surfaced. If the list is empty, the symptom description was wrong — go back to step 1.

7. **Repeat until one hypothesis remains and has been confirmed positively** — not just "everything else is eliminated." Absence of evidence is not evidence of absence.

## Root cause vs. fix

Diagnosis ends at root cause, not fix. When the loop terminates, state:

- **Root cause**: the precise condition that produces the symptom.
- **Why it was hidden**: what made it hard to see.
- **Fix surface**: where in the code the fix belongs — not the fix itself.

Don't jump to a fix mid-diagnosis. A fix applied before the root cause is confirmed treats a symptom and buries the bug.

## Legwork rules

- Read the actual code, logs, and stack traces. Don't reason from memory about what the code probably does.
- When a log or trace is ambiguous, add instrumentation to make it unambiguous. A hypothesis confirmed by a printf is more reliable than one confirmed by reading.
- Reproduce before diagnosing. A bug you can't reproduce reliably will fool every experiment.
- If the bug is intermittent, find the condition that makes it reliable first. That condition is often the root cause.
