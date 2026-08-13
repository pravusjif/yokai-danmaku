# H1-02 · Deflect feels fair

- **IF/THEN:** IF the deflect window is generous (≥0.4 s) and incoming bullets telegraph clearly, THEN the owner lands at least 7 of 10 intended deflects in a greybox wave.
- **Source section:** §3 Core Loop — DEFLECT step
- **Cheapest killing test:** same desktop Explorer greybox as H1-01, owner self-test counting 10 deliberate deflect attempts
- **Key metric:** deflect success rate on intended attempts; below 70% = failed
- **Mobile-sensitive:** yes
- **Tested on:** desktop
- **Parked:** 2026-08-13

## Brief

- **Criterion (external):** deflect success rate on intended attempts in one greybox wave — at least 7 of 10 (≥70%), with at least 10 intended attempts made; below 70% = failed. An intended attempt is an E press while the deflect is off cooldown (presses during recharge do nothing and are not counted — established H1-01 pass 1→2); a success is a press while a bullet is telegraphing blue. Failure looks like: the owner deliberately hunts deflects and still whiffs more than 3 presses in 10 — the window reads as luck, not timing.
- **Kill-check (owner-testable):** before pressing E, the owner can predict whether the deflect will land — a landed deflect feels earned by timing, not granted by chance. If deflects feel like coin flips even when they succeed, the claim is dead.
- **Verdict ceiling (pre-registered):** unlike H1-01, the criterion here is *mechanically counted* (HUD attempt/success counters, agent-verified in the H1-01 smoke) and the claim's subject is the owner themselves — so a measured ratio ≥7/10 may close **`validated`** (desktop; renders *mobile pending* since `Mobile-sensitive: yes`). If the ratio holds but the kill-check fails (numbers pass, feel says lucky), that conflict is raised, never blended into one verdict.
- **Note on the verb:** this tests the **aimed** deflect — camera-direction ricochet, kept by owner decision 2026-08-13 (`decisions.md`) — not the auto-return version H1-01's passes 1–4 played. Prior ratios (40/43 auto-return, 13/17 mid-look-see) are context, not evidence.
- **Rung:** desktop Explorer — the window/telegraph feel cannot be settled by arithmetic; mobile (touch) is a separate open question, deliberately left as *mobile pending*.
- **Who tests:** both — agent MCP smoke first (scene running, counters zeroed, no errors), then the owner by hand; only the owner's pass counts.
- **Who launches:** agent — preview server already running; agent launches desktop Explorer via deep link (owner requested).
- **Real:** the full deflect chain as decided: single lane-threat telegraph (nearest approaching bullet whose path passes within 1.2 m, acquired at 3.5 m, sticky to 4.3 m, ~0.9 s of blue ≈ 0.7 s to impact — satisfies the IF's ≥0.4 s window), 1.5 s cooldown, camera-aimed outgoing direction at 6 m/s.
- **Faked:** everything H1-01 faked — greybox arena, no art, no other players, no progression/score/reward.
- **Instrumented:** existing HUD counters (attempts/successes, smoke-verified), `SMOKE deflect attempt` log lines, click-to-copy panel. Counters zeroed by the fresh Explorer launch.
- **Not building:** nothing — the build exists. Explicitly out of scope: tuning window, cooldown, lane width or bullet speed mid-pass (any tuning is an instrument change, logged between passes); new mechanics; scoring.
- **Sessions:** owner alone; one wave per pass (~40 s), one pass may settle it; up to 2–3 passes with logged instrument fixes.
- **Task given to the tester:** "Play one full wave and deliberately try to deflect — at least 10 attempts. When a bullet flashes blue, press E; aim your camera to choose where it flies. When the wave ends, click the HUD panel and paste the line."
- **Collected per session:** deflect attempts and successes (the metric) · whether you could tell before pressing if it would land · times hit, min FPS (riders) · anything said unprompted.
- **Briefed:** 2026-08-13



## Sessions

**smoke: agent MCP run · 2026-08-13 · passed.** Same build as H1-01 pass 4 plus the aimed-deflect decision (no other mechanics changes; instrument itself unchanged and already agent-verified in the H1-01 smoke). Fresh server + fresh Explorer launch after a mid-setup crash (owner killed a hung client; preview server had also died and was restarted — no build change involved). Verified via MCP: scene `Running`/`isReady`, `runningStatus: Good`, no errors in logs, counters zeroed by the fresh load. E-press still not machine-checkable (no key tool in the MCP surface) — owner confirms deflect + aim in their first seconds, as in H1-01.

**pass 1: owner self-test · 2026-08-13.** Counter line (HUD click-to-copy): `H1-01 wave=1 completed=1 deflects=12/13 timesHit=2 bullets=8 fps=37 minFps=35`. One full wave, 13 intended attempts (≥10 required), 12 landed — 92%, against the pre-registered ≥70%. Kill-check asked and held: owner reports they could tell before pressing whether the deflect would land — timing read as earned, not chance. No instrument findings; one pass settles it (unambiguous result, stop early). Riders: hit twice; tick-rate 37/min 35 (not render FPS — H1-03 note stands).

## Verdict

**Verdict:** validated — 12/13 intended deflects (92% vs pre-registered ≥70%), HUD-counted over one full wave, kill-check also held (owner predicted landings before pressing) · 2026-08-13 · tested on: desktop

First `validated` in the log: the criterion was mechanically measured (HUD attempt/success counters, agent-verified instrument), not judged by feel — the pre-registered ceiling in the Brief anticipated exactly this. Scope: the **aimed** deflect verb (camera-direction ricochet, `decisions.md` 2026-08-13) with the single lane-threat telegraph (~0.9 s of blue, ~0.7 s to impact) and 1.5 s cooldown. `Mobile-sensitive: yes` and only desktop tested — the touch version of aim-and-press is untested, so the index renders *mobile pending*; the QR mobile check is minutes and is offered at core-loop stage close.
