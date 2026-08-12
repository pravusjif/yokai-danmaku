# H1-03 · A readable bullet-hell density actually runs

- **IF/THEN:** IF a wave renders ~150 simultaneous moving glowing projectiles, THEN the scene holds ≥60 fps in desktop Explorer on recommended hardware.
- **Source section:** §3 Core Loop — pattern density is what makes the genre read as bullet hell
- **Cheapest killing test:** instrumented desktop greybox — spawn N projectiles on a curve, log fps; agent-measurable, no playtest needed
- **Key metric:** fps at 150 projectiles; below 60 on recommended desktop = failed (then find the max N that holds)
- **Mobile-sensitive:** yes
- **Tested on:** —
- **Parked:** 2026-08-13

## Brief
<!-- owned by /pre-prod-proto -->

## Sessions
<!-- owned by /pre-prod-proto -->

## Verdict
<!-- owned by /pre-prod-proto -->
