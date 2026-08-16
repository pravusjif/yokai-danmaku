# H2-02 · The 10th wave is still fun (solo floor)

- **IF/THEN:** IF the greybox has the full loop structure (life bar, ramp, wipe reset, clean streak), THEN the owner voluntarily plays ≥10 waves across ≥2 runs in one sitting and quits by choice, not boredom.
- **Source section:** §3 Core Loop — "why is the 10th repetition still fun"
- **Cheapest killing test:** the same H2 greybox build as H2-01/H2-03, owner self-test, one sitting
- **Key metric:** waves played voluntarily and runs started; stopping before 10 waves out of boredom = failed
- **Scope note:** this tests the **solo floor** only (rising difficulty + skill expression). The strongest claimed source — other players as the variety — cannot be self-tested; it stays open until v1 external testers exist.
- **Mobile-sensitive:** no
- **Tested on:** desktop
- **Parked:** 2026-08-14

## Brief
<!-- owned by /pre-prod-proto -->

- **Criterion (external):** the existing counters, machine-logged: **≥10 waves completed across ≥2 runs in one voluntary sitting** (`wavesCompleted` and `runs` on the HUD line). Failure looks like: the owner stops before 10 waves and names boredom/repetitiveness as the reason. Note on verdict size: the counts are measurable, but the load-bearing half of the THEN — *quits by choice, not boredom* — is owner-feel, so the expected best outcome at v0 is **`survived`**, never `validated`.
- **Kill-check (owner-testable):** at quit, the owner's stated reason is not boredom or "it's all the same" — and they would sit down again tomorrow. **Baseline warning, pre-registered:** the owner already reported *"I think it gets pretty repetitive"* on the pre-change build (2026-08-17) — the claim is under live threat; this sitting decides whether the two levers below moved it.
- **Rung:** desktop Explorer (Creator Hub preview, already running) — same H2 greybox; `Mobile-sensitive: no`.
- **The two levers under test (owner-directed, provisional — trial, not decision):** (1) **wall entrances reroll to a fully random azimuth every volley** — the deterministic 80°/volley sweep was learnable and read as repetitive; camper luck stays ~33%/volley (two 60° entrances), volleys now independent. (2) **A banish no longer pauses play** — the next yokai opens fire immediately, the "ROUND N: DENSER" banner hangs over live play; wave rest (5 s) and wipe rest keep their breather. If the sitting still reads repetitive, registered further levers (not built): the aimed bomb bullet and distance-scaled deflect damage (`ideas.md`), and the density/ramp tunables.
- **Scope note (from the header, binding):** solo floor only — rising difficulty + skill expression. The crowd source of variety cannot be self-tested; whatever the verdict, that half stays open for v1 external testers.
- **Standing-law rider:** the random-reroll change keeps expected camper pressure unchanged by arithmetic, but if H2-02 closes positive, one cheap camping-meter re-probe re-confirms H2-03's law under the new tunables (per the standing anti-camping law in `decisions.md`).
- **Real:** the full validated stack — H1 verb, H2-01 round structure, H2-03 anti-camping law with the two levers above.
- **Faked / not building / instrumented:** unchanged from H2-03's brief; no new mechanics for this test.
- **Who tests / who launches:** owner plays; agent smoked via Explorer MCP. Preview server and Explorer already live.
- **Task given to the tester:** "Play a normal sitting — as long as you feel like, stop whenever you want. Then click the panel, paste the line, and tell me in one sentence why you stopped."
- **Collected per session:** HUD line at quit (wavesCompleted, runs, deepest, streak) · the owner's unprompted quit reason (the kill-check) · whether the no-pause banish reads as momentum or as denied reward-beat (rider) · bullets peak + minFps.
- **Briefed:** 2026-08-17

## Sessions
<!-- owned by /pre-prod-proto -->

**smoke: agent MCP run · 2026-08-17 · passed (partial).** Random gap azimuths verified live in the running scene: volley sequence 13° → 281° → 15° → 318°, no progression. Banish-continuity change compiled and hot-reloaded but is not observable without gameplay — the first banish of pass 1 is its visual check. Instrument (wave/run counters, HUD click-to-copy line) unchanged and already proven through H2-01/H2-03.

**pass 1: owner sitting, three levers landing mid-sitting · 2026-08-17 · desktop (Creator Hub/CLI preview, agent watching via Explorer MCP).** One continuous evening sitting with hot-reload changes between segments — segments logged separately because the instrument changed between them.

- **Segment A** (levers 1+2: random entrances, no banish pause): 11 waves / 3 runs, deepest round 3, 94/106 deflects (89%), 13 hits all spiral — **0 wall hits in 52 volleys** (a static player would have expected ~35: the owner reads the random entrances fluently). Owner stayed in flow and directed a third lever: the spiral must not hold while a wall spawns — "now there is a pause whenever the wall is generated."
- **Lever 3 mid-sitting:** `EMIT_PAUSE_AFTER_VOLLEY` 2.5 → 0 — spiral fires straight through wall volleys. Perf held: minFps 36 at peak 96 bullets, well under the 150 budget.
- **Segment B** (all three levers): 4 waves / 1 run, two banishes to round 3, 0 wall hits in 15 volleys, 38/40 deflects. Owner's words, unprompted: *"I think removing that pause improved a lot the fun."*
- **Meter personality note (no criterion implication):** the camping meter read segment B's home-base-and-dart-to-the-entrance play as 82% camp despite zero wall hits — statically impossible at those odds ((1/3)^15 ≈ 10⁻⁷). The meter anchors on a home spot; the H2-03 law discriminates on movement, not parking, which is its design role.
- **Quit, owner's words:** "by choice not boredom" · would play again tomorrow: "yes."

Sitting total: **15 voluntary waves across 4 runs** — the pre-registered counts met — against a pre-registered baseline in which the same owner had called the pre-change build "pretty repetitive."

## Verdict
<!-- owned by /pre-prod-proto -->

**Verdict:** survived — kill-check held: quit by choice, not boredom, would replay tomorrow (owner self-test; 15 waves / 4 runs voluntary, counts machine-logged) · fun criterion not machine-measurable · 2026-08-17 · tested on: desktop

What turned the baseline "pretty repetitive" into "improved a lot the fun" was pacing, not content: (1) wall entrances reroll to a random azimuth every volley — the deterministic 80° sweep was learnable; (2) a banish never pauses play — the next yokai opens fire immediately, banner over live action; (3) the spiral never holds during wall volleys. All three are recorded in `decisions.md` as keepers; anti-camping arithmetic is unchanged by them (~33% camper luck per volley, volleys independent), with a cheap camping-meter re-probe registered as a rider for insurance. Scope honesty, unchanged from the brief: this is the **solo floor** only — the design's strongest claimed variety source, other players, cannot be self-tested and stays open for v1 external testers (re-test appends to this file). Registered levers if the solo floor thins at deeper rounds: the aimed bomb bullet and distance-scaled deflect damage (`ideas.md`).
