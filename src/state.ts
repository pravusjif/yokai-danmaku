// Shared instrumentation state — the HUD renders these, game.ts writes them.
// These counters ARE the experiment instrument (H1-01 criterion + H1-02/H1-03 riders).
export const stats = {
  wave: 1, // current wave number (criterion: read at the moment the owner quits)
  wavesCompleted: 0,
  waveTime: 0,
  resting: false,
  restLeft: 0,

  deflectCooldown: 0, // seconds until E is live again; >0 greys the HUD line
  deflectAttempts: 0, // every E press while off cooldown (H1-02 rider)
  deflectHits: 0, // presses that connected with a telegraphing bullet
  timesHit: 0,

  bullets: 0, // live projectile count (H1-03 rider)
  fps: 0,
  minFps: 0, // session minimum, after a 5 s warmup

  hitFlash: 0 // 0..1, drives the red screen-edge flash
}
