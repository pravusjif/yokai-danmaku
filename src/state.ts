// Shared instrumentation state — the HUD renders these, game.ts writes them.
// These counters ARE the experiment instrument (H2-01 kill-check + camping
// meter, with riders for H2-02 (waves/runs/deepest round) and H2-03 (sweep)).
// H1 counters kept unchanged so passes stay comparable to the H1-01 baseline.
export const stats = {
  wave: 1, // global wave number since scene load (H1 counter, kept)
  wavesCompleted: 0,
  waveTime: 0,
  resting: false,
  restLeft: 0,

  // --- H2 round structure ---
  round: 1, // current round: banish → +1, wipe → back to 1
  waveInRound: 1,
  yokaiHp: 0, // set from BAR_HP in game.ts setup
  yokaiMaxHp: 0,
  runs: 1, // collective runs started this sitting (H2-02 rider)
  deepestRound: 1, // deepest round reached this sitting (H2-02 rider)

  // --- death rule / streak ---
  knockedOut: false, // 3rd hit in a wave = out for the rest of it (spectate from walkway)
  hitsThisWave: 0,
  streak: 0, // waves survived without a hit; resets to 0 on hit
  bestStreak: 0,

  // --- camping meter (the instrument behind H2-01's kill-check) ---
  // % of in-pit wave time spent within CAMP_RADIUS of where the player was
  // CAMP_LAG seconds earlier. High % = standing still.
  campPct: 0, // live, current wave
  lastWaveCampPct: -1, // -1 = no completed wave yet

  // --- banner (banish / wipe / knockout messages) ---
  banner: '',
  bannerLeft: 0,

  deflectCooldown: 0, // seconds until E is live again; >0 greys the HUD line
  deflectAttempts: 0, // every E press while off cooldown
  deflectHits: 0, // presses that connected with a telegraphing bullet
  yokaiHits: 0, // deflected bullets that flew back into the emitter (bar damage)
  timesHit: 0,

  // --- H2-03 pattern law instruments ---
  volleys: 0, // wall volleys emitted this sitting
  wallHits: 0, // hits taken from wall pillars (session total)
  spiralHits: 0, // hits taken from spiral bullets (session total)
  wallHitsWave: 0, // per-wave split — which element is doing the anti-camping work
  spiralHitsWave: 0,
  peakBullets: 0, // max simultaneous live projectiles (walls brush the H1-03 budget)
  lastRing1Gap: -1, // current wall's gap azimuth in deg (smoke harness reads this)

  bullets: 0, // live projectile count
  fps: 0,
  minFps: 0, // session minimum, after a 5 s warmup

  hitFlash: 0 // 0..1, drives the red screen-edge flash
}
