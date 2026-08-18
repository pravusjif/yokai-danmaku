# H2-06 · The scrapbook's unfinished page pulls returns

- **IF/THEN:** IF the scrapbook shows silhouette→revealed progress per yokai (revealed by standing in the pit at that yokai's banishment), THEN players with a partially filled page (≥3 revealed) return within 7 days at a higher rate than players with none.
- **Source section:** §4.3 Hook 3 — collection
- **Cheapest killing test:** two rungs — (paper, now) reveal-pacing arithmetic: at the designed round/rotation structure, how many sessions does yokai N take to reveal? No yokai may be a ten-hour wall ("a grind disguised as a set" is the hook's documented failure mode). (live, v1) funnel: D7 return of partial-page players vs none.
- **Key metric:** D7 return, partial-page vs empty-page players; no separation = the panel is decoration
- **Mobile-sensitive:** no
- **Tested on:** paper (arithmetic)
- **Parked:** 2026-08-14

## Brief

**Scope: paper rung only.** Settles reveal pacing against the settled v1 slice; the behaviour half (D7 return, ≥3-revealed vs none) stays open for the live v1 funnel whatever today's result.

- **Criterion (external):** under the model below, all three hold at the expected skill case (r = 0.65): **(C1) no wall** — expected sessions to reveal the *last* regular yokai ≤ 8 (and ≤ 15 at every r in the band — a page further out than ~15 sessions is a ten-hour wall, the hook's documented failure mode); **(C2) not spent day one** — the probability of revealing *all* regular yokai inside the first session < 50%; **(C3) cohort sanity** — expected sessions to reach 3 reveals ≤ 4, so the live funnel's ≥3-revealed cohort actually populates inside week 1. Failure looks like: any of C1–C3 fails at r = 0.65 — the pacing is broken and hook 3's tier bands or draw rules need redesign.
- **Kill-check (owner-testable):** the owner reads the model assumptions (tier bands, runs per session) and cannot name one that misrepresents the designed loop.
- **Rung:** paper/arithmetic — structural question (rotation rules × depth distribution → reveal times); no build answers it cheaper.
- **Who tests:** the skill computes (machine-run Monte Carlo); the owner judges the assumptions.
- **Who launches:** n/a — no build.
- **Real:** the model. Slice: 2 tier-1 + 2 tier-2 regular yokai (+1 mega, excluded — it is a calendar page revealed by Friday attendance, paced by construction); sensitivity variant 2+1 (the 3-regular floor). **Assumed tier bands (not yet in §3 — becomes a recommendation): tier 1 = rounds 1–3, tier 2 = rounds 4+.** Run depth ~ geometric, continuation r ∈ {0.55, 0.65, 0.75}; a run reaching round d banishes rounds 1..d−1; each banished round draws uniformly from its tier, preferring yokai not seen this session; a banish you stand through reveals that yokai (solo/small-crowd v0 assumption: the player stands through every banish of their own run). Session = 3 runs (H2-02 observed: 4 runs one sitting; band 2–4 checked).
- **Faked:** everything — no build, no players.
- **Instrumented:** computed table in `## Sessions`.
- **Not building:** anything; NOT settling scrapbook UI, NOT re-deciding the roster slice (§9 owns it), NOT touching the mega's attendance-page design.
- **Sessions:** one computation pass; owner assumption-review rides in the conversation.
- **Task given to the tester:** n/a (arithmetic) — owner is asked: "do the tier bands and runs-per-session read as the designed loop?"
- **Collected per session:** C1–C3 numbers per r and slice variant; the recommended tier-band split.
- **Briefed:** 2026-08-19

## Sessions

**Pass 1 — 2026-08-19, machine-computed (Monte Carlo, 30k players per cell, seeded).**
Model per Brief: slice 2 tier-1 + 2 tier-2 (sensitivity 2+1); tier bands rounds 1–3 / 4+; depth geometric (r); session = 3 runs (sensitivity 2/4); draw prefers unseen-this-session; standing through every own-run banish.

Slice 2+2, 3 runs/session:

| r | E[sessions to last page] (C1 ≤8 exp / ≤15 all) | P(all regulars in session 1) (C2 <0.50 exp) | E[sessions to 3 reveals] (C3 ≤4 exp) |
|---|---|---|---|
| 0.55 | 6.05 | 0.15 | 3.98 |
| **0.65 (expected)** | **2.98 ✓** | **0.32 ✓** | **2.24 ✓** |
| 0.75 | 1.73 | 0.57 | 1.47 |

Sensitivities: 3-regular slice (2+1) at r=0.65 → E[last]=2.26, P(all s1)=0.44 (near the C2 line), and 0.68 at r=0.75 — the smaller slice is measurably worse on the spent-day-one axis. Runs/session 2→4 at r=0.65 moves P(all s1) 0.22→0.41.

**All three criteria pass at the expected case — verdict direction is validated.** The finding worth keeping: the risk is not the wall the header feared, it is the opposite — **the regular book is a fast book.** At skilled/crowd play (r=0.75) a majority finishes all regular pages in one session; the v1 scrapbook's pull past session ~3 rests on the mega's calendar page and on content drops, not on the regular pages. The arithmetic also gives a concrete reason to prefer the 4-regular slice over the 3-regular floor (C2: 0.32 vs 0.44), feeding H2-07's fork. Tier-band assumption (1–3 / 4+) put to owner via kill-check before the verdict is written.

## Verdict

**Verdict:** validated — paper rung: no wall exists (last regular page ~3 expected sessions at r=0.65, ≤6 worst case); not spent day one at the expected case (P=0.32 < 0.50); the ≥3-revealed funnel cohort populates in ~2 sessions · 2026-08-19 · tested on: paper (arithmetic)

Owner confirmed the assumptions 2026-08-19 (kill-check held): tier bands rounds 1–3 / 4+ — now the recommended §3 parameter — and ~3 runs per sitting. Standing findings: **the regular book is a fast book** — at skilled/crowd play (r=0.75) a majority finishes all regular pages in one session, so past session ~3 the scrapbook's pull rests on the mega's calendar page and on content drops, and hook 3 must be sold that way; the 4-regular slice beats the 3-regular floor on the spent-day-one axis (0.32 vs 0.44), a concrete argument for the 4th yokai in H2-07's fork. Scope: this validates pacing viability only — the behaviour half (D7 return, ≥3-revealed vs none; no separation = the panel is decoration) remains open for the live v1 funnel.
