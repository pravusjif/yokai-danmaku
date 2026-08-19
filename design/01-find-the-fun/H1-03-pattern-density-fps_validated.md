# H1-03 · A readable bullet-hell density actually runs

- **IF/THEN:** IF a wave renders ~150 simultaneous moving glowing projectiles, THEN the scene holds ≥60 fps in desktop Explorer on recommended hardware.
- **Source section:** §3 Core Loop — pattern density is what makes the genre read as bullet hell
- **Cheapest killing test:** instrumented desktop greybox — spawn N projectiles on a curve, log fps; agent-measurable, no playtest needed
- **Key metric:** fps at 150 projectiles; below 60 on recommended desktop = failed (then find the max N that holds)
- **Mobile-sensitive:** yes
- **Tested on:** desktop
- **Parked:** 2026-08-13

## Brief

- **Criterion (external):** average **render FPS** (Explorer's performance sampler over a ≥10 s window, `get_performance_stats`) while ~150 pooled glowing projectiles are simultaneously alive and moving — ≥60 = held; below 60 = failed, and the follow-up duty is to find the max N that holds ≥60. Explicitly NOT the HUD "fps" line, which the H1-01 smoke proved is the scene-tick rate. Failure looks like: the density the genre needs turns the client into a slideshow, and the pattern design must live under a lower bullet budget.
- **Kill-check (owner-testable):** standing at the walkway at full density, the arena still reads as a game, not a stutter — a glance test, optional; the criterion is machine-measured either way.
- **Verdict ceiling (pre-registered):** agent-instrumented mechanical evidence → **`validated`** or **`failed`** on the numbers alone, no owner pass required. `Mobile-sensitive: yes`, desktop-only test → closes *mobile pending*.
- **Hardware honesty:** "recommended desktop hardware" is proxied by the one machine available — the owner's Mac running Explorer v0.167+. The verdict records this; a different machine class re-tests by appending to this file.
- **Rung:** desktop Explorer — arithmetic cannot answer a rendering-cost question; this is the cheapest rung that renders.
- **Who tests:** agent via MCP end to end (smoke + measurement). Owner optional for the glance test.
- **Who launches:** agent — preview server and Explorer already running from H1-02.
- **Real:** 150 pooled sphere entities with emissive PBR materials, each moved every frame by the existing bullet system — the actual render + per-frame-transform cost under test.
- **Faked:** the pattern itself — a temporary maintain-N spawner (`DENSITY_TEST` const) bypasses the wave clock and keeps ~150 alive, spiral angles preserved; this is an instrument, not a pattern design, and is reverted after the experiment.
- **Instrumented:** `get_performance_stats` render FPS avg/min/hiccup frames (the criterion) · `stats.bullets` HUD count + SMOKE logs proving N ≈ 150 during the sample · screenshot for the record.
- **Not building:** pattern variety at density; any optimization (LOD, mesh swap, material batching) before a failing number says it is needed; mobile measurement.
- **Sessions:** agent runs; one 10 s sample at N=150 (after a settle period), repeated once for stability; if <60, bisect N (100, 75, …) to find the holding max.
- **Task given to the tester:** — (no human task; agent protocol above is the session).
- **Collected per session:** render FPS avg/min/hiccups at the sampled viewpoint · live bullet count during sample · any scene errors.
- **Briefed:** 2026-08-13

## Sessions

**smoke + measurement: agent MCP run · 2026-08-13.** Instrument: `DENSITY_TEST = 150` maintain-N spawner in `src/game.ts` (bypasses the wave clock, tops up ≤3 bullets/frame after an instrument fix — the first version spawned all 150 in one frame, which traveled as a single cohort ring instead of a spread pattern; fixed before sampling, criterion untouched). Scene `Running`/`Good`, no errors, HUD confirmed `bullets: 150` throughout, spread spiral verified visually via MCP screenshot (inline agent capture, not persisted to disk). Two 10 s render-FPS samples via `get_performance_stats`, camera overlooking the full pit from the walkway:

| sample | avg FPS | min | max | hiccup frames |
|---|---|---|---|---|
| 1 | 112.4 | 55.9 | 136.8 | 0 |
| 2 | 112.3 | 48.3 | 136.4 | 0 |

Rider: scene-tick rate at 150 bullets ≈ 35.7/40 target — same as at ~35 bullets (H1-01 pass 4 logged 37), so scene logic is not density-bound either; the HUD "fps" line remains tick-rate, criterion judged on the sampler's render FPS as pre-registered. Hardware: owner's MacBook Pro (Apple silicon), Explorer v0.167+ — the brief's stated proxy for "recommended desktop". Instrument reverted after measurement (`DENSITY_TEST = 0`, knob kept in code for the mobile re-test).

## Verdict

**Verdict:** validated — 112 avg render FPS at 150 simultaneous projectiles (pre-registered bar ≥60), two 10 s samples, 0 hiccup frames · 2026-08-13 · tested on: desktop

Momentary minima dipped to 48–56 within the samples with zero hiccup frames — honest but comfortably inside the criterion, which was pre-registered on the average. Headroom is large enough that pattern design is not FPS-constrained at genre density on desktop. `Mobile-sensitive: yes`, desktop only → *mobile pending*; the QR mobile check re-tests by appending to this file with `DENSITY_TEST = 150` re-enabled.

**mobile rung, pass 1: owner QR self-test · 2026-08-19 · no measurement.** Owner ran the scene on their phone during the H1-02 mobile pass; no FPS number was read (the broken mobile HUD took the session). Verdict unchanged; *mobile pending* stays true. Next mobile pass re-enables `DENSITY_TEST = 150` and reads min FPS against the program's 30 fps minimum-hardware bar.
