---
name: improve-codebase-architecture
description: Scan a codebase for deepening opportunities, present them as a visual HTML report, then grill through whichever one you pick.
disable-model-invocation: true
---

# Improve Codebase Architecture

Surface architectural friction and propose **deepening opportunities**: refactors that turn shallow modules into deep ones. The aim is testability and AI-navigability.

## Design vocabulary

Use these terms exactly in every suggestion — do not drift into "component," "service," "API," or "boundary":

- **module** — a named unit with an interface and an implementation
- **interface** — the surface through which a module is used
- **depth** — ratio of implementation complexity to interface complexity (deep = good)
- **seam** — a boundary where behaviour can be varied without editing the calling code
- **adapter** — code that converts between two seam forms
- **leverage** — a small interface change that unlocks many call-site simplifications
- **locality** — related logic living close together, reducible to a single read path

**Design principles:**

- The deletion test: would deleting this module concentrate complexity, or just move it? "Concentrates" = signal worth keeping.
- "The interface is the test surface" — test through the interface, not the implementation.
- "One adapter = hypothetical seam, two = real" — two adapters justify extracting the seam.

The domain language in `CONTEXT.md` gives names to good seams; ADRs in `docs/adr/` record decisions this command should not re-litigate.

## Process

### 1. Explore

**Scope before you scan: YAGNI.** Deepening pays off on hot spots — code that keeps changing.

- If the user named a direction (a module, a subsystem, a pain point), take it.
- Otherwise, use GitHub MCP `list_commits` to find the hot spots: files and areas that keep coming up in recent history. Let those paths pull your attention first.

Read the project's domain glossary (`CONTEXT.md`) and any ADRs in the area you're touching first. Then read the hot-spot files via GitHub MCP `get_file_contents`, exploring organically. Note friction where you experience it:

- Where does understanding one concept require bouncing between many small modules?
- Where are modules **shallow**, with an interface nearly as complex as the implementation?
- Where have pure functions been extracted just for testability, but the real bugs hide in how they're called (no **locality**)?
- Where do tightly-coupled modules leak across their seams?
- Which parts are untested, or hard to test through their current interface?

Apply the **deletion test** to anything you suspect is shallow.

### 2. Present candidates as an HTML report

Write a self-contained HTML file to the OS temp directory using `execute_code`: resolve the path as `os.environ.get('TMPDIR', '/tmp')` and write to `<tmpdir>/architecture-review-<timestamp>.html` so each run gets a fresh file. Copy it to `output/` so the user can download it.

The report uses **Tailwind via CDN** for layout and styling, and **Mermaid via CDN** for diagrams. Each candidate gets a **before/after visualisation**.

For each candidate, render a card with:

- **Files**: which files/modules are involved
- **Problem**: why the current architecture is causing friction
- **Solution**: plain English description of what would change
- **Benefits**: explained in terms of locality and leverage, and how tests would improve
- **Before / After diagram**: side-by-side, illustrating the shallowness and the deepening
- **Recommendation strength**: one of `Strong`, `Worth exploring`, `Speculative`

End the report with a **Top recommendation** section.

Do NOT propose interfaces yet. Ask the user: "Which of these would you like to explore?"

### 3. Grill loop

Once the user picks a candidate, invoke the `/grill` skill to walk the decision tree with them.
