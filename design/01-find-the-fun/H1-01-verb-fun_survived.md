# H1-01 · The verb is fun

- **IF/THEN:** IF the core verb is weave-through-a-bullet-pattern plus a timed deflect, THEN the owner voluntarily replays at least 3 consecutive greybox waves with no score, reward or goal attached.
- **Source section:** §3 Core Loop — "why the first repetition feels good"
- **Cheapest killing test:** greybox in desktop Explorer (one arena, one repeating pattern, hit = knockback), owner self-test, ~30 min build
- **Key metric:** consecutive waves played unprompted; fewer than 3 = failed
- **Mobile-sensitive:** no
- **Tested on:** desktop
- **Parked:** 2026-08-13

## Brief

- **Criterion (external):** consecutive greybox waves voluntarily replayed, unprompted, with no score, reward or goal attached — fewer than 3 = failed. Failure looks like: the owner drops in, survives a wave or two, and quits out of boredom before wave 3 with nothing pulling them back in.
- **Kill-check (owner-testable):** weaving through the pattern and landing a timed deflect reads as a pull to its own inventor — if the owner does not *want* a third wave, the verb is dead. (Note: the criterion here is itself owner-observed, so at v0 the verdict ceiling is `survived`/`failed` — voluntary-replay evidence from the inventor is feel evidence, never `validated`.)
- **Rung:** desktop Explorer (Creator Hub default) — a fun/feel hypothesis settles here; arithmetic cannot answer "is the verb fun" and mobile answers nothing extra for a `Mobile-sensitive: no` claim.
- **Who tests:** both — agent MCP smoke first (scene runs, bullets move, deflect fires, counters record), then the owner by hand for the feel verdict. Only the owner's pass counts toward the criterion.
- **Who launches:** to be asked at handover, never assumed — recommendation: agent runs the preview server for the smoke pass; owner launches via Creator Hub for their own sessions.
- **Real:** the verb under test — avatar weaving (default DCL locomotion) through one repeating radial bullet pattern; slow fat glowing spheres (~4 m/s, ~0.6 m diameter); a timed deflect on E with a clear telegraph (bullet flashes blue while inside deflect range, window ≥ 0.4 s per H1-02's riding claim); deflected bullet visibly ricochets back through the pattern; hit = knockback + brief screen-edge flash, no death.
- **Faked:** arena is greybox primitives (flat pit + walkway ring); yokai/art/neon are absent; other players absent; progression, score, rewards, persistence: none — the wave just repeats, which *is* the test.
- **Instrumented:** HUD counters — current wave number (the criterion number, read at the moment the owner quits), deflect attempts vs. successes (rides for H1-02), live projectile count + FPS (rides for H1-03; FPS = engine ticks per wall-second).
- **Not building:** shooting or combat of any kind; a second pattern; score/rewards/menus; yokai art or neon polish; multiplayer; mobile controls; audio.
- **Sessions:** owner alone, self-testing; one pass ≈ 5 min, up to 2–3 passes with instrument fixes logged between them.
- **Task given to the tester:** "Drop into the arena and play for as long as you feel like. Move with WASD. When a bullet flashes blue, press E. Stop whenever you want."
- **Collected per session:** wave count at voluntary quit (the metric) · deflect attempts/successes · projectile count + minimum FPS seen · anything the owner says unprompted.
- **Briefed:** 2026-08-13

## Sessions
<!-- owned by /pre-prod-proto -->

**smoke: agent MCP run · 2026-08-13 · passed.** Build lives in the scene repo working tree (`src/`, `scene.json`, 2×2 parcels). Verified in desktop Explorer (v0.167.0-alpha) via MCP: scene `Running/isReady`, no errors in logs; spiral pattern emits and bullets traverse the pit; hit detection + knockback real (player displaced (10,16)→(6.2,20.7) by hits, `SMOKE hit` log lines); i-frames spacing hits ≥0.8 s; wave clock and rest countdown cycle (waves observed advancing unattended); HUD counters all record. Riders: render FPS avg 108.8 / min 47.5, 0 hiccup frames at ~35 bullets (`get_performance_stats`); **the HUD "fps" number is the scene-tick rate (~36 vs target 40), not render FPS — H1-03 must be judged on render FPS, not the HUD line.** Not machine-checkable: the E-press itself (no key tool in the MCP surface) — deflect/telegraph code path proven indirectly (every logged hit requires a prior telegraph-ring crossing); owner confirms the blue flash and deflect connect in their first seconds. Instrument fixes during smoke, before any owner pass: HUD clipped at screen edge → repositioned/fixed width; `SMOKE` console lines added for hit/deflect/wave. Scene reloaded to zero all counters before handoff. §7 screenshot captured → `H1-01-greybox.png`.

**pass 1: owner self-test · 2026-08-13.** Ended early on a degenerate strategy: standing still and spamming E deflects every incoming bullet — no reason to weave, and the owner reports that state is not fun. Wave count at quit not recorded (the pass ended on the instrument flaw, not on boredom with the verb). Verdict-relevant either way: with free deflect spam available, the verb did not pull.

**Instrument change between passes 1 → 2** (criterion unchanged): E now starts a 1.5 s cooldown on any press; presses during cooldown do nothing and do not count as attempts (protects the H1-02 ratio's meaning — it still measures intended deflects); HUD deflect line greys and shows "(recharging)" while E is down. Reason: pass 1's spam strategy bypassed the weave verb — "timed press" was not actually timed. Per-bullet telegraph window is untouched (~0.9 s, still ≥ 0.4 s per H1-02's claim).

**pass 2: owner self-test · 2026-08-13.** Played with the cooldown; ended with instrument-clarity feedback, wave count again not recorded: (a) several bullets light up blue at once but E only deflects one — feedback over-promises (selection is nearest-distance, not aim); (b) the cooldown state needs to read on the bullets themselves, not only the HUD line. Two further ideas surfaced and were parked in `design/ideas.md` (wave difficulty ramp + death reset; boss life bar) — both are goal/loop structure outside this experiment's scope.

**Instrument change between passes 2 → 3** (criterion unchanged): telegraph and deflect target unified — exactly **one** bullet glows blue, the one E will actually send back (nearest approaching bullet inside 3.5 m, sticky until 4.3 m so it doesn't flicker), and **no bullet glows while E is recharging**. Blue now literally means "press E now and this one goes". Attempts/window semantics unchanged.

**pass 3: owner self-test · 2026-08-13.** Wave count not recorded. Finding: bullets "not that close" were qualifying for the deflect — cause identified in the acquisition rule: "approaching" only required a shrinking distance, so side-passing bullets that would never hit the player could turn blue at full telegraph range (and stickiness let them be deflected out to 4.3 m).

**Instrument change between passes 3 → 4** (criterion unchanged): added a lane-threat requirement — a bullet only qualifies as the deflect target if its flight path passes within **1.2 m** of the player ("would hit or graze"). Blue now means "coming at you", not "nearby". Time-to-player from acquisition ≈ 0.7 s at 4 m/s, so H1-02's ≥ 0.4 s window claim still holds.

**Instrument addition for pass 4** (data capture, no mechanics change): clicking the HUD panel copies all counters as one line to the clipboard (`copyToClipboard`, `~system/RestrictedActions`) — pass results paste straight into this log. Also parked in `ideas.md` during this exchange: anti-camping pressure (owner). **No pass has recorded a wave count yet** — passes 1–3 all ended on instrument findings; the criterion still has zero data points. Pass 4 pending, build ready in the working tree (compiles clean). To resume: serve the scene (Creator Hub Preview with the MCP checkbox, or `npm run start -- --mcp`), owner plays the pre-registered task, clicks the panel at quit, pastes the line here.

**pass 4: owner self-test · 2026-08-13.** First pass with a criterion read. Counter line (HUD click-to-copy): `H1-01 wave=3 completed=3 deflects=40/43 timesHit=5 bullets=4 fps=37 minFps=30`. Owner completed 3 consecutive waves and quit **by choice** ("had enough") — voluntary quit at exactly the threshold, nothing attached pulling them on. No new instrument findings. Riders: 40/43 intended deflects landed (93% — cooldown gating from pass 1→2 means every counted attempt was deliberate; direct evidence toward H1-02's ≥70% claim); hit 5 times; HUD fps 37 / min 30 is the **scene-tick rate**, not render FPS (smoke note stands — H1-03 must be judged on render FPS via `get_performance_stats`).

## Verdict

**Verdict:** survived — kill-check held: the verb pulled its inventor through 3 voluntary consecutive waves, quit by choice, no score/reward/goal (owner self-test) · criterion not measured beyond owner feel (pre-registered ceiling) · 2026-08-13 · tested on: desktop

The version of the verb that survived is **not** the version first built: passes 1–3 killed free deflect spam (1.5 s cooldown added), an over-promising telegraph (exactly one bullet glows — the one E will send back), and lane-irrelevant targets (only bullets whose path passes within 1.2 m of the player qualify). The pull appeared only once the deflect was scarce and the telegraph honest. Whether the verb pulls players who did not invent it is untested — that lives with H1-04's fresh-eyes protocol, not here.
