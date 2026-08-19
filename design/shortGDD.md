
# Decentraland Experience Proposal

**Creator Success Program — Proposal Template (short GDD)**

| | |
|---|---|
| Experience name | **Yokai Danmaku** |
| Studio / team name | Pravus (solo) |
| Date | 2026-08-19 |
| Contact (Discord + email) | `TBD: Discord handle` + pravus@decentraland.org |

---

## Before you start (read this, then delete it)

- This document should take you **a few focused hours**, not weeks. If a section is hard to answer, that section is telling you the design needs more thought. That is the point of the template.
- **Respect the word caps.** Short writing forces clear thinking. We can always ask for more detail later.
- **A rough sketch or greybox screenshot beats polished concept art.** We fund games, not documents. Do not spend time making this document pretty.
- **Anything playable is a bonus — and the more playable, the bigger the bonus.** You do not need one to apply, but it is the strongest signal you can send, in this order: a rough prototype of your core mechanic (any engine, even a web demo) is *good*; a playable core loop in SDK7 is *great*; a small vertical slice live in a World is *excellent*. One link like this outweighs pages of description — put it in the TL;DR.
- Write simple, direct English (B2 level). Your experience must also work for non-English speakers, so practice here.
- If you don't know something yet, write `TBD:` and how you plan to find out. **An honest gap builds more trust than a vague claim.** If it is something only a playtest can settle, park it in **Appendix A — Hypothesis Log** with the cheapest test that could prove you wrong.
- Every section starts with guidance in *italics*. Replace the guidance with your answers.
- Before writing, read **How the Creator Success Program Works** and **What Makes a Great Experience**. This template assumes you know both.

What we fund: **social-first, replayable, mobile-ready experiences with clear progression.** Program goal: **more than 20% of new players return within 7 days (D7 retention).**

---

## 0. TL;DR

| | |
|---|---|
| **One-line concept** | A shared bullet-hell arena in haunted neo-Tokyo: every avatar survives the same yokai's pattern together, and timed deflects are the only way to banish it. |
| **Team & total hours/week** | Solo (Pravus), ~20h/week |
| **Current status** | Playable core-loop greybox in SDK7 (desktop Explorer) — the H1/H2 experiment builds in this repo: aimed deflect at 92% intended-hit rate, 150 projectiles at 112 fps, anti-camping machine-verified. `TBD: public link before submission` |
| **Live at end of Week 6** | Players drop into a persistent arena to banish escalating yokai together — with a weekly haunting board, a filling scrapbook, and a Friday Great Haunting. |
| **Requested round** | v1 |

---

## 1. The Hook

It's like NieR: Automata's bullet hell, but the arena is shared — you and every other avatar in the plaza survive the same pattern together.

---

## 2. First Session — written as "you"

You spawn on a neon-lit walkway ringing a sunken arena. Below, glowing orbs bloom outward in slow spirals, and a handful of avatars weave between them. A pulsing ring on the floor marks the drop-in point. `[HYPOTHESIS → H1-04]`

You drop in as a new wave starts — wide, slow arcs. You sidestep the first one; a low chime marks the near miss. Then an orb flashes blue as it closes on you — you press, and it ricochets back through the pattern, punching a hole the avatar beside you dives through.

Wave by wave the pattern tightens, and every deflect — yours and everyone else's — chips the yokai's glowing bar above the pit. Three waves in, the bar shatters and the yokai is banished; the arena rim lights up with the next round's name and a preview of its pattern — visibly denser.

The last thing you see before leaving: the rim board catching your name — this week's haunting board, your deepest round sitting on it as a mark, the countdown to Sunday's reset ticking beside it. It will not survive tonight's crowd unless you come back to push it deeper.

---

## 3. Core Loop

*Stage 2 — loop table resolved 2026-08-14. All three loop-structure claims are closed: H2-01 failed, H2-03 validated in its place (the goal-structure break is closed), and H2-02's solo floor survived the owner sitting (both 2026-08-17) — its crowd half waits for v1 testers.*

| # | Step (verb) | What the player does | Why do it again? |
|---|---|---|---|
| 1 | READ | Watch the incoming bullet pattern and find the gap | Every wave draws a new pattern |
| 2 | WEAVE | Move your avatar through the gap | The gap never opens in the same place — wall entrances sweep every volley from a random start, so every wave is a new route (measured: no fixed spot survives — H2-03 validated 2026-08-17) |
| 3 | DEFLECT | A timed press ricochets the flashing bullet wherever your camera points — aim is part of the verb (decided 2026-08-13) — clearing a hole in the pattern **for everyone in the arena** | Your deflect visibly helps the players around you — and it is the only thing that damages the yokai |
| 4 | SURVIVE | Outlast the wave; the next one starts tighter | Empty the yokai's life bar to banish it — the next round summons a denser yokai |

**Goal structure (decided 2026-08-14; risk confirmed real 2026-08-15):** each round summons a yokai with a visible life bar. Deflected bullets are the only damage; emptying the bar banishes it, and the next round's yokai attacks denser. The round is **bar-driven**: waves keep coming and tightening until the bar hits zero, with the bar sized so a competently-deflecting crowd banishes in about 3 waves — a crowd that deflects poorly gets a longer, denser round and slides toward the wipe, so bad play *is* the difficulty curve. Deflect is the win verb — the fiction already says why: you throw the yokai's own fury back at it. **Break found and closed (H2-01 failed 2026-08-15 → H2-03 validated 2026-08-17, owner probes, desktop):** under the original spiral-only law the bar made camping the correct way to play (H2-01: a near-still rim player banished three yokai at 70% camp, zero knockouts). The pattern law now refuses camping by design: alongside the spiral, an **undeflectable wall volley** sweeps the pit every 7 s — 60 unjumpable pillars with two 60° entrances that never open in the same place, threat reaching every radius down to the floor edge, spiral spawn blooming from the core. Measured under deliberate adversarial camping: zero majority-camped rounds banished — rim camping (98% camp) and the dense close band (55% camp) both ended in a knockout inside one wave, while a moving player pays ~1 wall hit per 200 s. Anti-camping is a pattern-design law, not a bolted-on hazard; the harder two-ring volley variant is reserved as a hard-tier yokai signature (`decisions.md`). The 3-hit knockout rule (owner decision 2026-08-15) proved load-bearing in both directions: it forgives a mover's misread volley, and it is exactly the budget the walls spend on a camper.

**Death rule (decided 2026-08-14):** a hit knocks you out for the rest of the current wave — you are thrown back onto the walkway to spectate, and you drop back in when the next wave starts. Your personal **clean streak** (waves survived without a hit) resets to zero; the group's round never rolls back. Ejected players watching from the rim are part of the design — they populate the walkway a newcomer sees in §2 and feed §5's bystander test.

**Reset rule (decided 2026-08-14):** if a wave ends with nobody left standing in the pit, the yokai wins — the haunting resets to round 1. The drop-in ring stays open mid-round, so the arena is always enterable, and the ramp self-corrects to the current crowd's skill: deep rounds die fast, so newcomers mostly arrive at low rounds. A session is therefore a **collective run** — "we got to round 7" — that ends when a wipe breaks the banishment chain. Solo at a dead hour this collapses to "every hit resets the run" — coherent for the genre, but §5's quiet-hour test must look at it.

**Roster mapping (decided 2026-08-14):** the yokai roster is grouped into difficulty tiers; each round summons a **random yokai from that round-band's tier**, preferring ones the pit has not seen today — never a fixed one-yokai-per-round ladder. Every authored pattern in that roster is bound by the **standing anti-camping law (owner decision 2026-08-17)**: every yokai's every wave must carry an anti-camping element — no pattern may be winnable from one 2.5 m spot — with H2-03's camping-meter probe as the acceptance test (a majority-camped round must end in a knockout before the banish). Anti-camping is a per-pattern authoring requirement each new yokai must pass, not a property of the one wall mechanic that proved it. Two runs to round 5 meet different yokai, so authored variety strengthens repetition without becoming its load-bearing source; the scrapbook (§4.3) fills breadth-first at low tiers while deep tiers stay rare, skill-gated pages; Great Haunting mega-yokai are pages too (attendance pages, not depth pages). The v1 roster slice is sized in §9: 3–4 regular yokai across 2 tiers + 1 mega, self-correcting on week 1's measured unit cost (H2-07). The v1 tier bands are settled (H2-06 paper rung, owner-confirmed 2026-08-19): tier 1 = rounds 1–3, tier 2 = rounds 4 and deeper.

- **One loop takes:** one wave ≈ 40 s — measured in the H1 greybox (2026-08-13), inside the 30–90 s band. One round = waves until the bar empties, tuned to ~3 waves + the rim's preview beat ≈ 2–2.5 min.
- **One session lasts:** one collective run to the wipe; target median 8–15 min. `TBD: measure median run length in the H2 greybox, then in the live funnel (§10).`
- **Why is the 10th repetition still fun?** Three named sources, all already designed: **other players** — the crowd is the variety: holes open where someone else aimed a deflect, the bar melts at crowd speed, every run has a different cast; **rising difficulty** — every banishment buys a denser yokai, so repetition climbs instead of looping flat; **skill expression** — the aimed deflect and the clean streak give mastery a visible ceiling. Authored per-yokai pattern variety is deliberately the garnish, not the answer — content gets consumed once (the v1 yokai count is a §9 scope decision). **The solo floor held (H2-02 survived, owner self-test, desktop, 2026-08-17)** — but only after pacing became law: wall entrances reroll to a random azimuth every volley (a learnable sweep read as repetitive), a banish never pauses play (the next yokai opens fire under its own banner), and the spiral never holds while a wall spawns. Under those three, the owner played 15 voluntary waves across 4 runs in one sitting and quit by choice — against a same-day baseline of "pretty repetitive" before the changes (`decisions.md`). The crowd source — other players as the variety, the strongest claimed of the three — remains unmeasured and needs v1 external testers. `[HYPOTHESIS → H2-02]`
- **Why the FIRST repetition feels good:** reading a wall of glowing bullets, finding the gap, and threading your whole avatar through it — with a deflect that punches a visible hole in the pattern. The verb held in the greybox: with no score, reward or goal attached, the owner voluntarily played 3 consecutive waves and quit by choice (H1-01 survived, owner self-test, desktop, 2026-08-13). Two conditions proved load-bearing and are now part of the verb: the deflect is **scarce** (1.5 s cooldown — free spam killed the weave entirely) and the telegraph is **honest** (exactly one bullet glows blue: the one E will send back, and only if its path would hit or graze you). Whether the verb pulls players who did not invent it is unmeasured — that is H1-04's fresh-eyes test. `[HYPOTHESIS → H1-01]` The deflect timing is fair on desktop — measured, not felt: 12/13 intended deflects landed (92% vs the ≥70% bar) on the aimed verb, and the owner could predict each landing before pressing (H1-02 validated 2026-08-13). **The touch verb held an on-device owner self-test (H1-02 mobile rung survived, 2026-08-19), but only with mobile-only accommodations that are now part of the verb's per-platform spec:** deflect fires from E/F on-screen buttons (tap-the-flashing-bullet is built but dead on the mobile client — suspected client bug, works on desktop); a landed deflect snaps to the yokai core when the camera is within 30° of it (aim stays an intent, precision is assisted); and a whiff press spends no cooldown on mobile — the desktop scarcity rule (whiff costs the full 1.5 s; E-spam kills the weave) stands unchanged on desktop. Raw desktop controls on touch were unplayable — this is a designed variant, not a port. The deflect ratio measured *on device* remains open: no counted wave was run on the phone. `[HYPOTHESIS → H1-02]` Genre density actually runs on desktop — measured: 112 avg render FPS with 150 simultaneous glowing projectiles, zero hiccup frames, and the scene tick unchanged from 35-bullet load (H1-03 validated 2026-08-13). Pattern design is not FPS-constrained on desktop. The 150-projectile read on mobile was **deferred at owner request** (2026-08-19) with one informal data point — normal gameplay density (~35–70 bullets) ran fine on the owner's phone — so the mobile density budget is still a claim, not a fact. `[HYPOTHESIS → H1-03]`

---

## 4. Why Players Come Back

Decentraland cannot send push notifications, so every hook below lives in the player's own memory or their calendar — nothing here assumes a reminder the platform cannot send.

### 4.1 The Day-2 sentence

> "A player who enjoyed Day 1 comes back on Day 2 because last night's deepest round — *we got to round 7* — is sitting on this week's haunting board with their name on it, and it will not survive tonight's crowd unless they come defend it."

The mark decays toward the Sunday reset, so it is always time-anchored; defense-of-a-mark lives in the player's own memory, which is the only notification system the platform has. Built entirely from state the loop already produces — "deepest round reached" is the session's natural output, zero new systems. Presumes hook 1 in §4.3: the weekly small-league haunting board. `[HYPOTHESIS → H2-04]`

### 4.2 The Day-7 player

A Day-7 player has, by name: a **league rank tier** from Sunday's final standing, shown on the rim beside their name and over their head in the arena; a **lifetime personal best** (deepest round ever, never resets) standing next to their weekly mark; **1–2 Great Haunting charms** already hanging visibly on their avatar (§4.4); and a **scrapbook filling in** — x/N yokai revealed from silhouette, one for each yokai whose banishment they stood through (§4.3, hook 3). The skill is persistent too: they read patterns a wave earlier than they did on Day 1.

### 4.3 Return hooks — three chosen

**Hook 1 — Weekly small-league haunting board.** Your mark is the highest round in which you were **standing in the pit when its yokai was banished** — present and alive, not spectating from the walkway. That keeps the mark personal even though the run is collective, and it cannot be farmed by camping — H2-03's pattern law refuses that, measured (validated 2026-08-17). League size is settled by arithmetic (H2-04 paper rung, validated 2026-08-19): **brackets of 20, grouped as players first place each week, with the remainder folding into the last bracket** — a bracket is 20–39 people, and below 40 weekly placers (the realistic v1 case at DCL traffic — owner estimate 2026-08-19) the board is simply one weekly league of everyone. In the expected case the median player has ~7 beatable marks within 2 rounds, so a mid-table mark genuinely will not survive the week. Never one large global board: past ~40 placers the split keeps ranks contested. Known by the same arithmetic: the bracket's #1 is usually a runaway outlier — the board's pull is mid-table mark defense, never "beat the #1". Resets Sunday 00:00 UTC; the arena rim shows your league, your mark, and the countdown. The behaviour claim — placers return on Day 2 at a visibly higher rate — waits for the live v1 funnel. `[HYPOTHESIS → H2-04]`

**Hook 2 — The Great Haunting, Friday 20:00 UTC.** Once a week the arena summons a mega-yokai: one fixed, reusable round template — bigger bar, denser opening wave, and a week of warning on the rim. Being in the pit at its banishment is the point (what it pays is §4.4's long-term goal). One automated template, no host required — the event calendar is the platform's only real notification system, carried by the in-world rim countdown plus Discord. `[HYPOTHESIS → H2-05]`

**Hook 3 — The yokai scrapbook (collection).** A panel showing every yokai in the shipped roster, each a black silhouette until you have stood in the pit at that yokai's banishment — then it fills in, permanently. Pacing is measured, not hoped (H2-06 paper rung, validated 2026-08-19): no page is a wall — the last regular page lands in ~3 expected sessions — and the book is not spent on day one at expected skill. The honest limit is the opposite: **at v1 scale the regular book is a fast book** — skilled or crowd-carried players can finish its regular pages in one sitting — so past the first sessions the scrapbook's pull rests on the mega-yokai's calendar page and on each content drop adding pages, and that is how this hook is sold: a light early-week assist that grows into the season-scale arc of §4.4, never v1's main retention claim. The roster ambition is large (~30 yokai over the program's rounds — owner's call); the v1 slice is sized in §9, and the panel only ever shows the shipped roster, so no slot can be a promise the build cannot keep. The behaviour claim — partial-page players return within 7 days at a higher rate — waits for the live v1 funnel. `[HYPOTHESIS → H2-06]`

### 4.4 The long-term goal

**The Exorcist wearable** — awarded for standing in the pit at **4 Great Haunting banishments**. Calendar-gated by construction: four Fridays is a month, and no grinding compresses it. Progress is stranger-visible *during* the climb, not only at the end — each attended banishment hangs a visible charm on your avatar in-scene (one attachment model, reused ×4), so a stranger sees 3/4 charms and asks. The finished wearable travels everywhere in Decentraland: the most retained players become the free marketing channel. Behind it sits the longer arc: completing the yokai scrapbook (§4.3) — season-scale, and it grows with each program round's content drop.

---

## 5. Social by Design

- **What is better — not just possible — when 2+ players are present?** (decided 2026-08-17)

  **Alone, your knockout is the run's death; with others, it isn't.** Solo, a 3rd hit empties the pit and wipes the haunting to round 1. With 2+ players, someone else keeps the wave alive while you spectate, and you drop back in next wave — a second player literally converts "every knockout resets the run" into "the run survives your mistakes." On top of that, **deflects stack:** the bar melts at crowd speed, so deep rounds — and the deep-tier scrapbook pages and board marks that live there — are reachable with a crowd in a way they structurally aren't solo. And **every deflect is visible help:** the hole you punch is a hole someone else dives through, so cooperation happens in the pattern itself, not in a menu. All three are existing §3 rules, no new systems. `TBD: how much faster a bar melts with N deflectors is arithmetic — touched by H2-04's league sizing, measured in the live v1 funnel.`

- **The quiet-hour test.** (decided 2026-08-17)

  **What they see:** the haunting never sleeps — the yokai and its pattern run even over an empty pit (decided 2026-08-17), so the arriving player sees live gameplay from the walkway, never a dead room. The rim shows this week's haunting board (real names, real marks — traces of the people who were here last night) and the countdown to Friday's Great Haunting. **What they do:** drop in solo — and the solo floor is not a hope, it's measured: H2-02's owner sitting held for 15 voluntary waves across 4 runs. Solo, the wipe rule means a bad wave resets the run — coherent for the genre. **How they meet someone by design:** the shared arena *is* the matchmaking — any second player who drops in is instantly in your run, same pattern, same bar, no party UI, no chat, no coordination; their first deflect already helps you. And when nobody comes, the design doesn't fight the concurrency curve — Friday 20:00 UTC concentrates scattered visitors into one crowd.

- **The bystander test.** (decided 2026-08-17)

  The entire loop is world-space — no panel is where the game happens. Five seconds of watching from the walkway teaches both verbs: bodies threading gaps between fat glowing orbs says *dodge*, and blue flash → press → ricochet → hole-plus-bar-chip says *that's how you fight back*. The audience is manufactured by rule, not hoped for: knocked-out players spectate from the walkway until the next wave, so the arena produces its own watchers — and every watcher is one wave away from being a player again. What a bystander can't do is break the run: bullets never reach the walkway, an idle body in the pit is knocked out by the wall volley within a wave and ejected (the anti-camping law doubles as an AFK cleaner), and the open drop-in ring can't be blocked by a standing avatar. That "five seconds of watching teaches the verbs" is a fresh-eyes claim — it rides with H1-04's v1 fresh-eyes test (same testers, same session, spectator-side observation), not as a separate hypothesis. `[HYPOTHESIS → H1-04]`

- **Bring-a-friend.** (decided 2026-08-17)

  The invitation is structural, not bribed: your board mark is capped by crowd depth — solo, bars melt too slowly to reach the rounds where marks are worth defending — so *"come deflect with me tonight"* is an instrumental ask the design produces by itself, and Friday 20:00 UTC gives it a natural time anchor (*"come Friday — the Great Haunting counts toward the Exorcist wearable"*). Deliberately **no both-earn-double bonus in v1**: bolted-on incentive systems at this team size are retention theatre (consistent with the no-dailies and no-crew-system calls in `decisions.md`). If the v1 funnel shows organic invitation underperforming, an invite mechanic is a priced v2 idea (→ `ideas.md`).

- **The memorable moment.** (decided 2026-08-17)

  **The last-one-standing banish.** Round 6, everyone else knocked out — the walkway ring is full of spectators, by rule, all facing the pit — and one player threads the final tightening wave alone and lands the deflect that empties the bar. The **banish spectacle** fires: the defeated yokai shatters skyward in a burst of light — played *over* live action, never pausing it (the no-pause law from H2-02 stands; the next yokai is already firing underneath). The spectacle is the screenshot surface, and the walkway crowd are the photographers — they are the ones with free hands, and every one of them had a stake in that wave. v1 ships **one shared banish spectacle** reused by every yokai (owner decision 2026-08-17); per-yokai death flourishes are v2 garnish, not v1 scope.

---

## 6. Mobile-First

*Mobile is not a port target — it is the primary design target. Build for touch first, scale UI up to desktop.*

**Every core-loop verb on touch.** Copy your verbs from Section 3:

| Core-loop verb | How it works with touch controls |
|---|---|
| | |
| | |

**UI plan.** *One or two sentences: how is your UI designed for a small screen first?*

[Your answer]

**Performance.** *Target: 60fps on recommended desktop hardware / 30fps on minimum hardware, with up to 20 players in the scene. What is your single biggest performance risk (asset weight? physics? effects?) and your plan for it?*

[Your answer]

**Desktop-only dependencies.** *Do you rely on any feature not yet available on mobile? (Check the Desktop vs Mobile Feature Gap tracker.) If yes: how is the design built so the feature can switch on later without a redesign?*

[Your answer]

---

## 7. World, Look & Story

**Story / world.** Neo-Tokyo's grid is haunted by digital yokai, and each round the arena summons one — its bullet pattern is that spirit's fury given light. You survive the haunting together with everyone in the pit; deflecting a bullet throws the yokai's own fury back at it.

**Visual direction.** Ghostwire: Tokyo (rain-slick neon shrine streets, yokai in a modern city) · NieR: Automata's glowing-orb bullet language (fat, slow, readable projectiles) · Akira's Neo-Tokyo night palette. Rendered as stylized PBR with baked lighting, consistent with Genesis Plaza quality. `[agent-decided — owner named the direction ("cyberpunk yokai"); references chosen to match it]`

![H1-01 greybox — sunken arena, walkway ring, one pattern mid-bloom](01-find-the-fun/H1-01-greybox.png)

*Greybox screenshot from the H1-01 build (desktop Explorer, 2026-08-13): the sunken arena with its walkway ring, one spiral pattern mid-bloom around the emitter. Primitives only — the yokai art direction above is not yet built.*

---

## 8. Comparables — exactly two

| | Comparable A — Fall Guys | Comparable B — NieR: Automata |
|---|---|---|
| What worked | A mass shared arena where everyone survives the same obstacle at once — instantly readable by watching, which makes spectating a tutorial. Knockouts become an audience; short rounds keep sessions snackable. | 3D bullet-hell patterns — slow, fat, glowing orbs readable in 3D space — fused with a Japanese sci-fi/cyberpunk mood. The one recognizable name that carries both the genre and the aesthetic of this pitch. |
| What didn't work | Elimination is terminal: a knocked-out player leaves the match, and the crowd drains as the round goes on. The fun is being in; being out is a menu. | Combat depth (perfect-dodge timing, weapon combos) and camera precision far beyond a small team's scope; that depth is not what made the bullet patterns memorable. |
| What we do differently | Our knockout lasts one wave, never the run — the spectator watches from the walkway with a stake in the outcome and drops back in next wave, so the arena never drains and the audience is part of the design (§5). One persistent world instead of matchmade lobbies: the same pit, the same board, all week. | We keep NieR's bullet language and strip its combat: no shooting, no combos — one shared arena where every avatar survives the same yokai's pattern together, and a single timed deflect that visibly helps everyone. Built for short sessions in a social world, not a 30-hour solo campaign. |

---

## 9. Six-Week Plan (v1 scope)

Program milestones are fixed: **Week 2** — functional test version of the core loop (basic single-player and multiplayer working). **Week 6** — live in your own World, public repository delivered.

**V1 content slice (decided 2026-08-18 — arithmetic against §11's ~120 h):** the build window is ~95 h after weeks 5–6 go to live testing and sign-off; systems eat ~77 h of it (multiplayer sync ~30 · retention systems: board, scrapbook, Great Haunting template, charms ~22 · arena art pass ~15 · FTUE, sound + tooltips, polish ~10), leaving **~20–25 h for yokai content**. Art plan (a): owner-built stylized low-poly, emissive materials, §7 direction. The Great Haunting mega-yokai gets its **own dedicated model** (owner call 2026-08-18 — the weekly event must look like an event, never a re-dress): ~8 h with its round template. The honest slice is therefore **3–4 regular yokai across 2 tiers + 1 mega-yokai**; ~30 yokai stays program-lifetime ambition (§4.3), and the scrapbook panel only ever shows the shipped roster. The plan self-corrects in week 1: H2-07 times the first production yokai — ≤6 h all-in and the slice is 4+mega; over, and the floor is 3+mega. `[HYPOTHESIS → H2-07]`

| Week | What is playable / done |
|---|---|
| 1 — Prototype definition | H2 greybox ports into the production scene; yokai #1 built and timed (H2-07); multiplayer sync spike — deterministic pattern from a shared seed, events-only sync design |
| 2 — Core interaction test version | **Program milestone:** full loop multiplayer — shared pattern, bar, deflect events, knockouts, wipe — basic single-player and multiplayer working |
| 3 — Core systems refinement | League board + Sunday reset; scrapbook panel; remaining regular yokai built |
| 4 — Playable prototype, final design direction (mobile playtest) | **Program milestone:** Great Haunting template + mega model; charms; arena art pass; sound + tooltips; mobile playtest |
| 5–6 — Live testing and sign-off | Live in the World; §10 funnel instrumented; fix pass; public repo delivered |

**Not building in v1 — exactly 3 cuts (decided 2026-08-18):**

1. **Player-as-boss mode** — the highest fun-ceiling idea in `ideas.md`, cut because it doubles the sync surface and the balance problem; v2+ candidate.
2. **The mintable Exorcist wearable** — v1 ships the in-scene charms and the visible 4/4 climb; the portable wearable mints at v2 (publication pipeline, fee and approval time don't fit 120 h, and no player can reach 4 Fridays inside v1's live window anyway). The promise stays; the mint moves.
3. **Hard-tier signature pattern elements** (the reserved two-ring volley, bomb bullets) — the v1 slice has 2 tiers on the baseline pattern language; signature elements return when deep tiers exist.

**Standing non-goals** (history in `decisions.md`):

- Never a fixed per-round yokai ladder, because it turns deep scrapbook pages into a grind disguised as a set (refused the ladder, 2026-08-14).
- Never a bolted-on retention system — every hook must be the loop's natural output (refused dailies 2026-08-14; refused the invite bribe 2026-08-17).
- Never a pattern winnable from one 2.5 m spot — the standing anti-camping law (refused camping, measured, 2026-08-17).

**Top risk + fallback (decided 2026-08-18).** **Multiplayer sync of the shared pattern.** The entire twist — everyone survives the *same* pattern, your deflect punches a hole *others* dive through — dies if clients disagree about where bullets are. Syncing ~150 bullets as networked entities is infeasible. **Plan A (the design):** the pattern is deterministic — generated locally from a shared seed + synced round clock — and only sparse events cross the network (deflects ≈ 1 per player per 1.5 s, hits, bar damage, knockouts). **Plan B if event latency makes deflect holes arrive late on other screens:** widen the hole radius and add a grace window so a late hole still reads as help. **Plan C, the floor that keeps the game shippable:** shared bar and shared run, per-client pattern phase — the collective fight survives even if bullet-level simultaneity doesn't. Week 1's sync spike exists to find out which plan we live on before week 2's milestone.

**Live-ops cost:** both weekly events are automated by design — the board resets itself Sunday 00:00 UTC and the Great Haunting is one reusable template with no host — so a live week costs **≤1 person-day** (monitoring, the Discord announcement, and whatever the funnel says to tune).

---

## 10. Success Criteria — what you will measure

*Progression to the v2 round depends on retention evidence. Decide now what evidence you expect to see.*

- **The 2–3 numbers you will watch from Week 1 of being live** *(examples: % of new players who complete the first goal; median session length; % of sessions where the player interacts with another player; % returning within 7 days)*

  [Your numbers]

- **Your first-session funnel** *(the steps you will instrument: spawn → first interaction → first reward → first goal complete → session end). If you can't name the steps, you can't fix the drop-offs.*

  [Your funnel]

- **Your pivot threshold.** *What result after 2 weeks live would make you change the design? What result would make you say "this hypothesis failed"? Agreeing on this now makes iteration decisions easy and fair.*

  [Your answer]

---

## 11. Team

*Hours per week matter more than credentials. Jam games, open call builds and mods all count as proof.*

| Person (name/handle) | Role in this project | Hours/week | Links to past work |
|---|---|---|---|
| Pravus | Everything — design, SDK7/TypeScript code, 3D & art | ~20h/week | `TBD: owner to add 1–2 links before submission` — the strongest evidence is this project's own greybox: the H1/H2 experiment builds in this repo (working SDK7 scene, 150-projectile waves at 112 fps) |

**Coverage check:** solo team. Code (SDK7/TypeScript) and design are covered — proven by the working greybox, not claimed. **3D & art is the gap:** one person at ~20h/week cannot also author ~30 yokai models. Plan (decided 2026-08-18): owner-built stylized low-poly yokai with emissive materials + open/CC assets for the environment where needed (declared in §12); the v1 roster is sized to that cost in §9. Total budget the plan must fit: **6 weeks × ~20h ≈ 120 hours** — every §9 line is priced against this number.

---

## 12. Deliverables & Declaration

**With the v1 round (6 weeks) we will deliver:** *(3–5 concrete bullets — things a player can do, not internal tasks)*

-
-
-

**Content & IP declaration.** *Confirm that all assets are original, properly licensed, or from open sources, and comply with Decentraland's Content Policy. List any third-party assets and their licenses.*

[Your declaration]

---

## Before you submit — self-check

- [ ] A stranger could repeat my hook after hearing it once
- [ ] The first 10 seconds need no reading, no tutorial, no NPC
- [ ] My Day-2 sentence names a concrete, time-anchored reason — not "it's fun"
- [ ] I chose at least 2 return hooks and explained how each works here
- [ ] I answered the quiet-hour test (world alive at low traffic)
- [ ] Every core-loop verb has a touch mapping
- [ ] My story section is 2 sentences or less
- [ ] I listed exactly 3 things I am NOT building
- [ ] There is at least one image (sketch/greybox is fine)
- [ ] All guidance text in italics is deleted

*What happens next: the Creator Success team reviews your proposal, may invite you to a short call, and responds with a decision or targeted questions. You get feedback either way.*

---

## Appendix A — Hypothesis Log

*Some of what you wrote above is a **decision** ("one loop takes 45 seconds"). The rest is a **claim** about how players will behave ("the 10th repetition is still fun", "they come back for the Sunday reset"). Claims belong here, written so that a test could prove them wrong.*

*This is a feature, not an admission. A claim with a test plan is the strongest thing in a proposal; a claim without one is the weakest. Reviewers read this table as evidence that you know which parts of your design are still unknown.*

**How to fill one row:**

- **IF / THEN** — falsifiable, in one sentence: *"IF the drop cycle is 45s, THEN 4 of 5 first-time players complete three cycles without being told what to do."* If you cannot describe what failure looks like, it is not a hypothesis yet — write it as `TBD:` in the section instead.
- **Source section** — which section above makes the claim, so a result knows what to go back and rewrite.
- **Cheapest killing test** — the least expensive thing that could prove it wrong: paper or arithmetic (no build needed) → desktop Explorer (the Creator Hub default — a greybox is minutes, not days) → mobile. Order the table by this column. Never spend an expensive test on a question a cheap one could answer.
- **Status** — `parked` (written down, not started) · `active` (test in flight) · `validated` (measured and held) · `survived` (you tested it yourself and the kill-check held; the full criterion was not measured — the expected v0 state) · `failed` (a result, not a mistake — keep it) · `deferred` (skipped on purpose, kept visible).
- **Tested on** — `desktop` / `mobile`. A touch-input or performance claim that only saw desktop stays *mobile pending* — the phone check costs minutes (Creator Hub → the dropdown next to Preview → Show QR Code for Mobile), so run it before you submit if you can.

*This table is **generated** from the experiment files in `design/<stage>/` — status comes from each filename, verdicts from inside the files. Do not edit the status column by hand: rename the file and regenerate.*

| ID | IF / THEN (falsifiable) | Source section | Cheapest killing test | Status | Verdict / date | Tested on |
|---|---|---|---|---|---|---|
| H2-04 | IF the weekly small-league haunting board shows each player's deepest round, THEN players who place a mark on Day 1 return on Day 2 at a visibly higher rate than players who never placed | §4.1 Day-2 sentence | League-size arithmetic on paper now; the behaviour claim needs the live v1 funnel (D2 return, placers vs non-placers) | validated | paper rung: brackets of 20 + remainder merge (single board <40 placers/week); median player ~7 climbable marks in the expected case; behaviour half open for the v1 funnel · 2026-08-19 | paper |
| H2-06 | IF the scrapbook shows silhouette→revealed progress per yokai, THEN players with a partially filled page (≥3 revealed) return within 7 days at a higher rate than players with none | §4.3 Hook 3 | Reveal-pacing arithmetic on paper now (reveals per session — no yokai may be a wall); the behaviour claim needs the live v1 funnel | validated | paper rung: no wall (last regular page ~3 expected sessions), not spent day one at expected skill; fast-book fact recorded — pull past session ~3 rests on the mega page + content drops; behaviour half open for the v1 funnel · 2026-08-19 | paper |
| H1-01 | IF the core verb is weave-through-a-bullet-pattern plus a timed deflect, THEN the owner voluntarily replays ≥3 consecutive greybox waves with no score, reward or goal attached | §3 Core Loop | Desktop Explorer greybox, owner self-test, ~30 min build | survived | kill-check held: 3 voluntary waves, quit by choice (owner self-test) · 2026-08-13 | desktop |
| H1-02 | IF the deflect window is ≥0.4 s and bullets telegraph clearly, THEN the owner lands ≥7 of 10 intended deflects in a greybox wave | §3 Core Loop | Same greybox as H1-01, owner self-test (mobile-sensitive) | validated | 12/13 intended deflects (92%), aimed verb, kill-check held (desktop) · mobile rung survived — kill-check held with touch accommodations, criterion not measured on device · 2026-08-19 | desktop + mobile (self-test) |
| H1-03 | IF a wave renders ~150 simultaneous moving glowing projectiles, THEN the scene holds ≥60 fps in desktop Explorer on recommended hardware | §3 Core Loop | Instrumented desktop greybox, agent-measurable (mobile-sensitive) | validated | 112 avg render FPS at 150 projectiles, 0 hiccups · 2026-08-13 · mobile 150-read deferred at owner request (informal: gameplay density ran fine on device) · 2026-08-19 | desktop — mobile deferred (owner) |
| H2-01 | IF the yokai's life bar makes deflect the win verb, THEN an owner self-test round still plays as weaving punctuated by deflects — the owner does not camp the 1.5 s cooldown near the emitter | §3 Core Loop | Extend the H1 greybox with a life bar + deflect damage; owner self-test, one round | failed | kill-check did not hold: deliberate near-still camping carried the run to round 4 (3 banishes, 70% camp, 0 knockouts) · 2026-08-15 | desktop |
| H2-02 | IF the greybox has the full loop structure (life bar, ramp, wipe reset, clean streak), THEN the owner voluntarily plays ≥10 waves across ≥2 runs in one sitting and quits by choice, not boredom | §3 Core Loop | Same H2 greybox build as H2-01, owner self-test (solo floor only — the crowd source needs v1 testers) | survived | kill-check held: 15 voluntary waves / 4 runs, quit by choice not boredom, would replay (owner self-test; crowd half open for v1) · 2026-08-17 | desktop |
| H2-03 | IF the pattern law is redesigned so gaps sweep AND threat reaches every radius, THEN a deliberate camping round — one 2.5 m spot, rim included, micro-adjustments allowed, under the 3-hit rule — ends in a knockout before the yokai is banished | §3 Core Loop (goal structure — load-bearing) | Same H2 greybox with the new pattern law; owner repeats H2-01's rim-camp probe, judged by the camping meter | validated | zero majority-camped rounds banished (rim ×2 at 98% camp, close band at 55%) — knockout always first, machine-logged; kill-check held · 2026-08-17 | desktop |
| H2-07 | IF one production yokai (model + materials + pattern config + scrapbook art) is built start-to-finish in v1 week 1, THEN it completes in ≤6 tracked hours | §9 v1 content slice | Build the first production yokai in week 1 and track hours — no cheaper rung measures a build cost | parked | | — |
| H1-04 | IF the spawn frames the arena mid-pattern below the walkway, THEN 4 of 5 first-time testers start dodging within 5 s without being told anything | §2 First Session | H1-01 greybox + 3–5 first-time testers (fresh eyes required) | deferred | deferred at stage-1 close — needs fresh eyes; v1 brings external testers · 2026-08-14 | — |
| H2-05 | IF the Great Haunting runs every Friday 20:00 UTC with a week of rim warning, THEN Friday-evening concurrency visibly spikes above the weekday baseline | §4.3 Hook 2 | Live v1 funnel — concurrency around Friday 20:00 vs weekday baseline; no cheaper rung exists for a calendar-behaviour claim | parked | | — |
