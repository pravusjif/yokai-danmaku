# H2-04 · The Day-2 sentence: board defense brings them back

- **IF/THEN:** IF the weekly small-league haunting board shows each player's deepest round, THEN players who place a mark on Day 1 return on Day 2 at a visibly higher rate than players who never placed.
- **Source section:** §4.1 Day-2 sentence (and §4.3 hook 1)
- **Cheapest killing test:** two rungs — (paper, now) league-size arithmetic: at expected concurrency, is a league small enough that a mid-table player can still move this week? (live, v1) instrument the funnel: D2 return rate of board-placers vs non-placers.
- **Key metric:** D2 return, placers vs non-placers; no separation = the board is decoration, the sentence failed
- **Mobile-sensitive:** no
- **Tested on:** paper (arithmetic)
- **Parked:** 2026-08-14

## Brief

**Scope: paper rung only.** This experiment settles the league-size parameter and the viability sub-claim ("a league exists in which a mid-table player can still move this week"). The behaviour half of the IF/THEN (D2 return, placers vs non-placers) is not measurable on paper and stays open for the live v1 funnel whatever today's result.

- **Criterion (external):** a league size **K in [10, 25]** (rim-board legibility bounds) is viable iff, under the expected scenario (100 weekly placers, per-round survival r = 0.65) AND both sensitivity cases (r = 0.55, r = 0.75), all three hold: **(C1)** ≥75% of placers land in a bracket holding ≥K/2 members (sequential fill, last bracket partial); **(C2) mid-table mobility:** the median-ranked player has ≥3 bracket-mates strictly deeper than them but within 2 rounds — climbable targets exist this week; **(C3) contested top:** on average ≥2 players sit at or within 1 round of the bracket's deepest mark (no runaway podium). Failure looks like: **no K in [10, 25] passes C1–C3 in the expected scenario** — the small-league board is decoration on paper and §4.1's Day-2 anchor needs redesign. The pessimistic scenario (30 placers/week) is pre-registered as informative only: it drives a degenerate-case mitigation note, not the pass/fail.
- **Kill-check (owner-testable):** the owner reads the assumption table and cannot name an assumption that is off by an order of magnitude against their experience of DCL traffic — if "100 placers/week" reads as fantasy to the person who will run this World, the arithmetic is decoration.
- **Rung:** paper/arithmetic — because the question is structural (population → bracket composition), and no build can answer it cheaper than a model can.
- **Who tests:** the skill computes (machine-run arithmetic, not mental math); the owner judges the assumptions.
- **Who launches:** n/a — no build.
- **Real:** the bracket-fill and depth-distribution model. Depth model: deepest weekly round per player ~ geometric with per-round continuation r (each next round reached by a fraction r of those who reached the previous), which matches the ramp-to-wipe structure; r band 0.55–0.75.
- **Faked:** everything else — no build, no players.
- **Instrumented:** a computed table (scenario × K → C1/C2/C3) written into `## Sessions`.
- **Not building:** anything; also NOT settling matchmaking details (how brackets group by skill) — v1 groups by arrival order per the 2026-08-14 decision.
- **Sessions:** one computation pass; owner assumption-review rides in the same conversation.
- **Task given to the tester:** n/a (arithmetic) — owner is asked: "here are the assumptions; is any of them off by an order of magnitude?"
- **Collected per session:** the C1–C3 table; the recommended K.
- **Briefed:** 2026-08-18

## Sessions

**Pass 1 — 2026-08-18, machine-computed (Monte Carlo, 20k brackets per cell, seeded).**
Model: deepest weekly round per player ~ geometric, per-round continuation r; brackets fill sequentially with K players in first-placement order (v1 decision: arrival order, no skill matching).

C1 — fraction of placers in a bracket holding ≥K/2 members:

| N placers \ K | 10 | 15 | 20 | 25 |
|---|---|---|---|---|
| 30 | 1.00 | 1.00 | 1.00 | 0.83 |
| 100 | 1.00 | 1.00 | 1.00 | 1.00 |
| 300 | 1.00 | 1.00 | 1.00 | 1.00 |

**C1 passes everywhere** (threshold ≥0.75).

C2 — median player's climbable targets (mates deeper by 1–2 rounds), mean / P(≥3), full bracket:

| r \ K | 10 | 15 | 20 | 25 |
|---|---|---|---|---|
| 0.55 | 2.66 / 0.56 | 3.69 / 0.79 | 5.31 / 0.94 | 6.25 / 0.97 |
| 0.65 | 2.36 / 0.44 | 3.29 / 0.71 | 4.67 / 0.90 | 5.61 / 0.96 |
| 0.75 | 1.91 / 0.29 | 2.66 / 0.54 | 3.79 / 0.79 | 4.55 / 0.89 |

**C2 (the header's actual paper question) passes at K=20 and K=25 for all three r** (mean ≥3); K=15 fails the r=0.75 sensitivity; K=10 fails broadly. Because the depth distribution is bottom-heavy, threateners-from-below are at least as numerous as targets-above, so mark *defense* pressure is implied wherever C2 passes.

C3 — mean players at or within 1 round of the bracket's deepest mark:

| r | any K (K-independent) |
|---|---|
| 0.55 | ~2.48 |
| 0.65 | ~1.92 |
| 0.75 | ~1.54 |

**C3 fails at r=0.65 and r=0.75 for every K** (threshold ≥2): the geometric tail makes the bracket's #1 usually a runaway outlier, 2+ rounds clear of #2, regardless of league size.

**Pass 2 — 2026-08-19, after owner assumption correction (return to Brief, openly recorded).**
Owner killed the population assumption per the kill-check: DCL-realistic traffic is 2–3 concurrent typical, 5–10 at events, ~20 rare — converting to **~15–40 unique weekly placers**, not 100. Re-registered scenarios: N ∈ {15 pessimistic, 30 expected, 60 optimistic}. The correction also reshapes the parameter: at this traffic there is only ever one or two brackets, so the operative rule is what happens to the remainder. Modeled rule: **brackets of 20; the remainder folds into the last bracket** (a bracket is 20–39 people; below 40 placers the board is simply one league — no runt brackets, ever).

C2 under the merge rule (mean climbable targets / P(≥3), by realized board size B):

| r | B=15 (N=15) | B=30 (N=30, merged) | B=20 (N=60 → 20+20+20) |
|---|---|---|---|
| 0.55 | 3.70 / 0.79 | 7.81 / 0.99 | 5.30 / 0.93 |
| 0.65 | 3.29 / 0.71 | 7.01 / 0.99 | 4.69 / 0.90 |
| 0.75 | 2.66 / 0.53 | 5.71 / 0.96 | 3.81 / 0.80 |

**Expected scenario (N=30 → one board of 30) passes C2 at every r** (5.7–7.8 climbable targets). Optimistic (N=60, three brackets of 20) passes at every r. Pessimistic (N=15) passes at r ≤ 0.65 and goes marginal (2.66) only at the high-survival sensitivity — informative, not blocking, per the pre-registration. C1 is structurally satisfied by the merge rule. C3's runaway-top finding is unchanged (K-independent) and stands as a design fact.

**Issue raised to owner before verdict (recorded, not silently edited):** C3 was an agent-added condition and, on inspection, does not follow from the IF/THEN — the Day-2 anchor claims *defense of your own mark*, not a contested podium, and brief sanity-check 4 (criterion must follow from the IF/THEN) cuts both ways. The pre-registered conjunction as written therefore fails on C3 alone, while the header's own paper question (mid-table mobility, C2) passes solidly at K=20. Owner asked to rule: judge the conjunction as written (→ failed), or accept an openly-recorded re-registration judging the paper rung on C1+C2, with C3's finding kept as a standing design fact (bracket tops are usually runaways — never sell "beat the #1" as the hook). Assumption check also put to owner: 30/100/300 weekly placers, r 0.55–0.75.

## Verdict

**Verdict:** validated — paper rung: viable board at owner-corrected traffic (15–40 weekly placers); parameter settled: brackets of 20, remainder folds into the last bracket (single board below 40 placers/week); expected case gives the median player ~7 climbable marks, ≥3 bar held at every skill sensitivity · 2026-08-19 · tested on: paper (arithmetic)

Owner ruling 2026-08-19: judged on C1+C2; C3 (contested podium) struck as a condition that never followed from the IF/THEN — its numbers stand as a **design fact**: the bracket's #1 is usually a runaway outlier (2+ rounds clear of #2, league-size-independent), so the board's drama is mid-table mark defense and the hook must never be sold as "beat the #1". Scope: this validates the viability sub-claim and settles the parameter only — the behaviour half of the IF/THEN (D2 return, placers vs non-placers; no separation = the board is decoration) remains open for the live v1 funnel.
