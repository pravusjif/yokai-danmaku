import {
  engine,
  Entity,
  Transform,
  MeshRenderer,
  Material,
  VisibilityComponent,
  inputSystem,
  InputAction,
  PointerEventType,
  Physics,
  KnockbackFalloff
} from '@dcl/sdk/ecs'
import { Vector3, Color4, Color3 } from '@dcl/sdk/math'
import { movePlayerTo } from '~system/RestrictedActions'
import { stats } from './state'
import { CENTER_X, CENTER_Z, ARENA_RADIUS, updateYokaiBar } from './arena'

// --- Tunables (log any change between owner passes in ## Sessions) ---
// H1 verb tunables are FROZEN for H2-01: cooldown, telegraph, lane rule, speeds
// all proved load-bearing in H1-01 and must not move under the life bar test.
const BULLET_SPEED = 4 // m/s, slow and fat per the brief
const DEFLECT_SPEED = 6 // deflected bullets fly back faster — the ricochet must read
const BULLET_SCALE = 0.6 // fat glowing sphere
const TELEGRAPH_RANGE = 3.5 // a bullet inside this range can become THE deflect target
const TELEGRAPH_EXIT = 4.3 // the current target keeps its blue until past this (no flicker)
// A bullet only qualifies if its flight path passes within this lateral distance
// of the player — blue means "coming AT you", not merely "nearby" (H1-01 pass 3→4).
const LANE_WIDTH = 1.2
const HIT_DIST = 0.65 // horizontal distance that counts as a hit
const EMIT_TICK = 0.35 // seconds between spiral arms, at density 1
const ARMS = 4 // bullets per tick
const STEP_DEG = 17 // spiral rotation per tick — draws slow moving lanes
const WAVE_EMIT_TIME = 35 // seconds of pattern per wave
const WAVE_REST_TIME = 5 // quiet gap between waves
const IFRAME_TIME = 0.8 // grace so one bullet cluster costs one knockout, not several counts
const KNOCKBACK_MAG = 12
const FPS_WARMUP = 5 // ignore min-fps during scene load
// E-spam killed the weave in H1-01 pass 1; the cooldown is part of the verb now.
const DEFLECT_COOLDOWN = 1.5

// --- H2 round structure (new for H2-01/H2-02/H2-03) ---
const BAR_HP = 18 // deflected bullets into the emitter to banish; sized for ~3 solo waves
const HITS_PER_KNOCKOUT = 3 // owner decision 2026-08-15: one hit out was too punishing
const RAMP_PER_ROUND = 0.18 // density factor per banished yokai — "the next one attacks denser"
const RAMP_PER_WAVE = 0.06 // waves tighten within a round while the bar holds
const MAX_DENSITY = 2.2 // cap ≈ 77 live bullets — H1-03 measured 112 fps at 150, safe
const SWEEP_AMP = 7 // deg of wobble on the spiral step — safe lanes drift (H2-03's law)
const SWEEP_RATE = 0.4 // wobble speed, rad/s of wave time
const BANISH_REST = 6 // beat after a banish — "next round: denser"
const WIPE_REST = 6 // beat after a wipe — "the yokai wins"
const YOKAI_CORE_RADIUS = 1.2 // a deflected bullet inside this damages the bar
// Camping meter: % of in-pit wave time spent within CAMP_RADIUS of where the
// player was CAMP_LAG seconds earlier. The number behind H2-01's kill-check.
const CAMP_RADIUS = 2.5
const CAMP_LAG = 4
const CAMP_SAMPLE = 0.5
// H1-03 density instrument: when > 0, bypass the wave clock and keep this many
// bullets alive. 0 = normal game. Kept for the mobile re-test at stage close.
const DENSITY_TEST = 0

type BulletState = 'live' | 'telegraph' | 'deflected'

type Bullet = {
  entity: Entity
  active: boolean
  state: BulletState
  dirX: number
  dirZ: number
  age: number
}

const pool: Bullet[] = []
// Exactly ONE bullet glows blue — the one E will actually deflect — and none
// glows while E is recharging (H1-01 passes 2→3). Blue = "press E now".
let currentTarget: Bullet | null = null
let spiralAngle = 0
let emitAccum = 0
let iframe = 0
let fpsFrames = 0
let fpsTime = 0
let sessionTime = 0
// camping meter internals
let campSamples: { x: number; z: number }[] = []
let campAccum = 0
let campTime = 0
let pitTime = 0
// knockout enforcement — re-teleport throttle
let knockbackCooldown = 0

function setBulletState(b: Bullet, state: BulletState) {
  b.state = state
  if (state === 'live') {
    // magenta — incoming
    Material.setPbrMaterial(b.entity, {
      albedoColor: Color4.create(0.15, 0, 0.1, 1),
      emissiveColor: Color3.create(1, 0.2, 0.7),
      emissiveIntensity: 3
    })
  } else if (state === 'telegraph') {
    // blue — THE deflectable bullet, right now
    Material.setPbrMaterial(b.entity, {
      albedoColor: Color4.create(0, 0.05, 0.15, 1),
      emissiveColor: Color3.create(0.3, 0.7, 1),
      emissiveIntensity: 5
    })
  } else {
    // green — deflected, flying back
    Material.setPbrMaterial(b.entity, {
      albedoColor: Color4.create(0, 0.15, 0.05, 1),
      emissiveColor: Color3.create(0.3, 1, 0.4),
      emissiveIntensity: 4
    })
  }
}

function spawnBullet(angle: number) {
  let b = pool.find((s) => !s.active)
  if (!b) {
    const entity = engine.addEntity()
    Transform.create(entity, { scale: Vector3.create(BULLET_SCALE, BULLET_SCALE, BULLET_SCALE) })
    MeshRenderer.setSphere(entity)
    VisibilityComponent.create(entity, { visible: true })
    b = { entity, active: false, state: 'live', dirX: 0, dirZ: 0, age: 0 }
    pool.push(b)
  }
  b.active = true
  b.age = 0
  b.dirX = Math.cos(angle)
  b.dirZ = Math.sin(angle)
  const t = Transform.getMutable(b.entity)
  t.position = Vector3.create(CENTER_X + b.dirX * 1.2, 1.0, CENTER_Z + b.dirZ * 1.2)
  VisibilityComponent.getMutable(b.entity).visible = true
  setBulletState(b, 'live')
}

function despawnBullet(b: Bullet) {
  b.active = false
  if (currentTarget === b) currentTarget = null
  VisibilityComponent.getMutable(b.entity).visible = false
}

function despawnAllBullets() {
  for (const b of pool) if (b.active) despawnBullet(b)
}

function setBanner(text: string, seconds: number) {
  stats.banner = text
  stats.bannerLeft = seconds
}

function resetWaveInstruments() {
  stats.hitsThisWave = 0
  campSamples = []
  campAccum = 0
  campTime = 0
  pitTime = 0
  stats.campPct = 0
}

// density factor for the current round/wave — the ramp IS the difficulty curve
function density(): number {
  return Math.min(
    MAX_DENSITY,
    1 + RAMP_PER_ROUND * (stats.round - 1) + RAMP_PER_WAVE * (stats.waveInRound - 1)
  )
}

// Banish: bar hit zero. Ends the round on the spot — next yokai is denser.
function banish() {
  // a bullet landing in the rest gap must not double-count the ended wave
  if (!stats.resting) {
    if (stats.hitsThisWave === 0) {
      stats.streak++
      if (stats.streak > stats.bestStreak) stats.bestStreak = stats.streak
    }
    stats.wavesCompleted++
    logWaveLine('banish')
  }
  despawnAllBullets()
  stats.round++
  if (stats.round > stats.deepestRound) stats.deepestRound = stats.round
  stats.waveInRound = 1
  stats.yokaiHp = stats.yokaiMaxHp
  updateYokaiBar(1)
  stats.knockedOut = false
  stats.resting = true
  stats.restLeft = BANISH_REST
  setBanner(`YOKAI BANISHED — ROUND ${stats.round}: DENSER`, BANISH_REST)
  console.log(`SMOKE banish: now round=${stats.round} runs=${stats.runs} deepest=${stats.deepestRound}`)
}

// Wipe: the wave ended with nobody standing in the pit — the yokai wins.
function wipe() {
  stats.wavesCompleted++
  logWaveLine('wipe')
  despawnAllBullets()
  stats.runs++
  stats.round = 1
  stats.waveInRound = 1
  stats.yokaiHp = stats.yokaiMaxHp
  updateYokaiBar(1)
  stats.knockedOut = false // drop back in when the next haunting starts
  stats.resting = true
  stats.restLeft = WIPE_REST
  setBanner('THE YOKAI WINS — HAUNTING RESETS', WIPE_REST)
  console.log(`SMOKE wipe: back to round 1, runs=${stats.runs} deepest=${stats.deepestRound}`)
}

function logWaveLine(end: 'clean' | 'hit' | 'wipe' | 'banish') {
  const camp = pitTime > 0 ? Math.round((campTime / pitTime) * 100) : 0
  stats.lastWaveCampPct = camp
  console.log(
    `SMOKE wave end (${end}): round=${stats.round} waveInRound=${stats.waveInRound} camp=${camp}% ` +
      `streak=${stats.streak} hp=${stats.yokaiHp}/${stats.yokaiMaxHp} deflects=${stats.deflectHits}/${stats.deflectAttempts} ` +
      `yokaiHits=${stats.yokaiHits} timesHit=${stats.timesHit} fps=${stats.fps} bullets=${stats.bullets}`
  )
}

// Knockout: 3rd hit in a wave = out for the rest of it. Thrown to the walkway
// to spectate; the group's round never rolls back. Streak resets on the hit
// itself, not here — this also re-throws knocked-out players who walk back in.
function knockout(fromX: number, fromZ: number) {
  stats.knockedOut = true
  setBanner('KNOCKED OUT — BACK NEXT WAVE', 3)
  const ang = Math.atan2(fromZ - CENTER_Z, fromX - CENTER_X)
  void movePlayerTo({
    newRelativePosition: Vector3.create(CENTER_X + Math.cos(ang) * 14, 3.2, CENTER_Z + Math.sin(ang) * 14),
    cameraTarget: Vector3.create(CENTER_X, 1.5, CENTER_Z)
  })
  console.log(`SMOKE knockout: round=${stats.round} waveInRound=${stats.waveInRound} timesHit=${stats.timesHit}`)
}

export function setupGame() {
  stats.yokaiMaxHp = BAR_HP
  stats.yokaiHp = BAR_HP
  updateYokaiBar(1)
}

export function gameSystem(dt: number) {
  sessionTime += dt

  // --- FPS instrumentation: engine ticks per wall-second (render FPS is
  // measured externally — see H1-01 smoke note) ---
  fpsFrames++
  fpsTime += dt
  if (fpsTime >= 0.5) {
    stats.fps = Math.round(fpsFrames / fpsTime)
    if (sessionTime > FPS_WARMUP && (stats.minFps === 0 || stats.fps < stats.minFps)) {
      stats.minFps = stats.fps
    }
    fpsFrames = 0
    fpsTime = 0
  }

  if (stats.bannerLeft > 0) stats.bannerLeft = Math.max(0, stats.bannerLeft - dt)

  // --- Wave clock ---
  if (DENSITY_TEST > 0) {
    // maintain-N spawner: top up to DENSITY_TEST every frame (H1-03 instrument)
    let alive = 0
    for (const b of pool) if (b.active) alive++
    let topUp = 3
    while (alive < DENSITY_TEST && topUp > 0) {
      spawnBullet((spiralAngle * Math.PI) / 180)
      spiralAngle = (spiralAngle + STEP_DEG) % 360
      alive++
      topUp--
    }
  } else if (stats.resting) {
    stats.restLeft -= dt
    if (stats.restLeft <= 0) {
      stats.resting = false
      stats.waveTime = 0
      stats.wave++
      resetWaveInstruments()
    }
  } else {
    stats.waveTime += dt
    if (stats.waveTime >= WAVE_EMIT_TIME) {
      // Wave end. Solo, a knockout means the pit is empty — the yokai wins.
      if (stats.knockedOut) {
        wipe()
      } else {
        if (stats.hitsThisWave === 0) {
          stats.streak++
          if (stats.streak > stats.bestStreak) stats.bestStreak = stats.streak
        }
        stats.wavesCompleted++
        logWaveLine(stats.hitsThisWave > 0 ? 'hit' : 'clean')
        stats.waveInRound++
        stats.resting = true
        stats.restLeft = WAVE_REST_TIME
      }
    } else {
      // --- Emit the spiral. Density ramps with round/wave; the step wobbles
      // and the direction flips each wave, so safe lanes sweep and never
      // reopen in the same place (H2-03 rides on this). ---
      const d = density()
      const tick = EMIT_TICK / d
      const sweepDir = stats.wave % 2 === 0 ? -1 : 1
      emitAccum += dt
      while (emitAccum >= tick) {
        emitAccum -= tick
        for (let arm = 0; arm < ARMS; arm++) {
          spawnBullet(((spiralAngle + (360 / ARMS) * arm) * Math.PI) / 180)
        }
        const step = STEP_DEG + SWEEP_AMP * Math.sin(stats.waveTime * SWEEP_RATE)
        spiralAngle = (spiralAngle + sweepDir * step + 360) % 360
      }
    }
  }

  const playerT = Transform.getOrNull(engine.PlayerEntity)
  const px = playerT ? playerT.position.x : CENTER_X
  const py = playerT ? playerT.position.y : 0
  const pz = playerT ? playerT.position.z : CENTER_Z
  const prx = px - CENTER_X
  const prz = pz - CENTER_Z
  const playerR = Math.sqrt(prx * prx + prz * prz)
  // In the pit = on the arena floor, below the walkway. Targeting, hits and
  // the camping meter all key off this.
  const inPit = playerT !== null && playerT.position.y < 2.2 && playerR < ARENA_RADIUS

  if (iframe > 0) iframe -= dt
  if (knockbackCooldown > 0) knockbackCooldown -= dt
  if (stats.deflectCooldown > 0) stats.deflectCooldown = Math.max(0, stats.deflectCooldown - dt)
  if (stats.hitFlash > 0) stats.hitFlash = Math.max(0, stats.hitFlash - dt * 2.5)

  // --- Knockout enforcement: a knocked-out player who walks back into the
  // pit mid-wave gets put back on the walkway (the wave is not theirs) ---
  if (stats.knockedOut && !stats.resting && inPit && knockbackCooldown <= 0) {
    knockbackCooldown = 0.6
    knockout(px, pz)
  }

  // --- Camping meter: only in-pit wave time counts ---
  if (!stats.resting && !stats.knockedOut && inPit && DENSITY_TEST === 0) {
    pitTime += dt
    campAccum += dt
    if (campAccum >= CAMP_SAMPLE) {
      campAccum -= CAMP_SAMPLE
      campSamples.push({ x: px, z: pz })
      const maxSamples = Math.round(CAMP_LAG / CAMP_SAMPLE) + 1
      while (campSamples.length > maxSamples) campSamples.shift()
    }
    if (campSamples.length > 0) {
      const anchor = campSamples[0]
      const cdx = px - anchor.x
      const cdz = pz - anchor.z
      if (cdx * cdx + cdz * cdz < CAMP_RADIUS * CAMP_RADIUS) campTime += dt
    }
    stats.campPct = pitTime > 0.5 ? Math.round((campTime / pitTime) * 100) : 0
  }

  // --- Move bullets, detect hits, find the one deflect target ---
  let liveCount = 0
  let nearest: Bullet | null = null
  let nearestDist = TELEGRAPH_RANGE
  let currentTargetDist = Infinity
  let currentTargetOnLane = false

  for (const b of pool) {
    if (!b.active) continue
    liveCount++
    b.age += dt
    const speed = b.state === 'deflected' ? DEFLECT_SPEED : BULLET_SPEED
    const t = Transform.getMutable(b.entity)
    t.position.x += b.dirX * speed * dt
    t.position.z += b.dirZ * speed * dt

    const rx = t.position.x - CENTER_X
    const rz = t.position.z - CENTER_Z
    const rFromCenter = Math.sqrt(rx * rx + rz * rz)

    // Deflected bullet reaches the yokai core: the only damage in the game
    if (b.state === 'deflected' && rFromCenter < YOKAI_CORE_RADIUS) {
      despawnBullet(b)
      stats.yokaiHits++
      if (stats.yokaiHp > 0) {
        stats.yokaiHp--
        updateYokaiBar(stats.yokaiHp / stats.yokaiMaxHp)
        console.log(`SMOKE yokai hit: hp=${stats.yokaiHp}/${stats.yokaiMaxHp} round=${stats.round}`)
        if (stats.yokaiHp <= 0) banish()
      }
      continue
    }

    // Despawn: left the arena or expired
    if (rFromCenter > ARENA_RADIUS || b.age > 10) {
      despawnBullet(b)
      continue
    }

    if (b.state === 'deflected') continue

    const dx = px - t.position.x
    const dz = pz - t.position.z
    const distToPlayer = Math.sqrt(dx * dx + dz * dz)
    // On-lane: still ahead of the bullet (distance shrinking) AND its flight
    // path passes within LANE_WIDTH of the player — "would hit or graze".
    const along = b.dirX * dx + b.dirZ * dz
    const lateralSq = distToPlayer * distToPlayer - along * along
    const onLane = along > 0 && lateralSq < LANE_WIDTH * LANE_WIDTH

    if (b === currentTarget) {
      currentTargetDist = distToPlayer
      currentTargetOnLane = onLane
    }
    if (inPit && !stats.knockedOut && onLane && distToPlayer < nearestDist) {
      nearest = b
      nearestDist = distToPlayer
    }

    // Hit: knockback + flash; streak resets on any hit, knockout on the 3rd in a wave.
    // Vertical band: a jump that visibly clears the bullet must not count —
    // hits were horizontal-only before (owner, H2-01 pass 1).
    const bulletTop = t.position.y + BULLET_SCALE / 2
    const bulletBottom = t.position.y - BULLET_SCALE / 2
    const vertOverlap = bulletTop > py + 0.2 && bulletBottom < py + 1.55
    if (distToPlayer < HIT_DIST && vertOverlap && iframe <= 0 && inPit && !stats.knockedOut) {
      Physics.applyKnockbackToPlayer(
        Vector3.create(t.position.x, t.position.y, t.position.z),
        KNOCKBACK_MAG,
        5,
        KnockbackFalloff.LINEAR
      )
      stats.timesHit++
      stats.hitFlash = 1
      iframe = IFRAME_TIME
      despawnBullet(b)
      if (!stats.resting) {
        stats.hitsThisWave++
        stats.streak = 0
        if (stats.hitsThisWave >= HITS_PER_KNOCKOUT) {
          knockout(px, pz)
        } else {
          setBanner(`HIT ${stats.hitsThisWave}/${HITS_PER_KNOCKOUT} — STREAK LOST`, 2)
          console.log(`SMOKE hit: ${stats.hitsThisWave}/${HITS_PER_KNOCKOUT} timesHit=${stats.timesHit}`)
        }
      } else {
        // tail bullets in the rest gap sting but the wave already ended —
        // knockback only, no knockout, no streak reset (greybox simplification)
        console.log(`SMOKE rest-gap hit: timesHit=${stats.timesHit}`)
      }
    }
  }
  stats.bullets = liveCount

  // --- Resolve the single blue target: none while E recharges or while
  // knocked out; otherwise the current one keeps blue while still
  // threatening (no flicker), else the nearest ---
  if (stats.deflectCooldown > 0 || stats.knockedOut || !inPit) {
    currentTarget = null
  } else if (currentTarget && (!currentTarget.active || !currentTargetOnLane || currentTargetDist > TELEGRAPH_EXIT)) {
    currentTarget = null
  }
  if (!currentTarget && stats.deflectCooldown <= 0 && !stats.knockedOut && inPit) currentTarget = nearest

  for (const b of pool) {
    if (!b.active || b.state === 'deflected') continue
    const should: BulletState = b === currentTarget ? 'telegraph' : 'live'
    if (b.state !== should) setBulletState(b, should)
  }

  // --- Deflect: E sends the blue bullet where the camera points (aimed —
  // decision 2026-08-13). A knocked-out spectator has no E. ---
  if (
    inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN) &&
    stats.deflectCooldown <= 0 &&
    !stats.knockedOut &&
    inPit
  ) {
    stats.deflectCooldown = DEFLECT_COOLDOWN
    stats.deflectAttempts++
    const target = currentTarget
    if (target) {
      stats.deflectHits++
      const camT = Transform.getOrNull(engine.CameraEntity)
      let dx = 0
      let dz = 0
      if (camT) {
        const fwd = Vector3.rotate(Vector3.Forward(), camT.rotation)
        dx = fwd.x
        dz = fwd.z
      }
      let len = Math.sqrt(dx * dx + dz * dz)
      if (len < 0.001) {
        const t = Transform.get(target.entity)
        dx = CENTER_X - t.position.x
        dz = CENTER_Z - t.position.z
        len = Math.sqrt(dx * dx + dz * dz) || 1
      }
      target.dirX = dx / len
      target.dirZ = dz / len
      setBulletState(target, 'deflected')
      currentTarget = null
    }
  }
}
