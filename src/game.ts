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
import { stats } from './state'
import { CENTER_X, CENTER_Z, ARENA_RADIUS } from './arena'

// --- Tunables (log any change between owner passes in ## Sessions) ---
const BULLET_SPEED = 4 // m/s, slow and fat per the brief
const DEFLECT_SPEED = 6 // deflected bullets fly back faster — the ricochet must read
const BULLET_SCALE = 0.6 // fat glowing sphere
const TELEGRAPH_RANGE = 3.5 // a bullet inside this range can become THE deflect target
const TELEGRAPH_EXIT = 4.3 // the current target keeps its blue until past this (no flicker)
// Added between owner passes 3 and 4 (2026-08-13): a bullet only qualifies if its
// flight path passes within this lateral distance of the player — blue means
// "coming AT you", not merely "nearby". Pass 3 found side-passing bullets
// qualifying at full telegraph range, which read as deflecting far bullets.
const LANE_WIDTH = 1.2
const HIT_DIST = 0.65 // horizontal distance that counts as a hit
const EMIT_TICK = 0.35 // seconds between spiral arms
const ARMS = 4 // bullets per tick
const STEP_DEG = 17 // spiral rotation per tick — draws slow moving lanes
const WAVE_EMIT_TIME = 35 // seconds of pattern per wave
const WAVE_REST_TIME = 5 // quiet gap between waves
const IFRAME_TIME = 0.8 // grace after a hit so one mistake costs one knockback
const KNOCKBACK_MAG = 12
const FPS_WARMUP = 5 // ignore min-fps during scene load
// Added between owner passes 1 and 2 (2026-08-13): pass 1 found E-spam while
// standing still deflects everything, bypassing the weave verb. Any E press
// starts the cooldown; presses during it do nothing and are not counted.
const DEFLECT_COOLDOWN = 1.5
// H1-03 density instrument: when > 0, bypass the wave clock and keep this many
// bullets alive, spiral angles preserved. 0 = normal game. Kept for the mobile
// re-test at core-loop stage close (H1-03 closed `validated — mobile pending`).
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
// Changed between owner passes 2 and 3 (2026-08-13): exactly ONE bullet glows
// blue — the one E will actually deflect (nearest threatening, not aim-based) —
// and none glows while E is recharging. Blue = "press E now and this one goes".
let currentTarget: Bullet | null = null
let spiralAngle = 0
let emitAccum = 0
let iframe = 0
let fpsFrames = 0
let fpsTime = 0
let sessionTime = 0

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
    // blue — THE deflectable bullet, right now (H1-02's telegraph under test)
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

export function setupGame() {
  // nothing to set up beyond the systems; pool grows lazily
}

export function gameSystem(dt: number) {
  sessionTime += dt

  // --- FPS instrumentation (H1-03 rider): engine ticks per wall-second ---
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

  // --- Wave clock: same single pattern every wave, no goal, no reward ---
  if (DENSITY_TEST > 0) {
    // maintain-N spawner: top up to DENSITY_TEST every frame (H1-03 instrument)
    let alive = 0
    for (const b of pool) if (b.active) alive++
    // top up at most 3/frame so the population staggers into a spread spiral
    // instead of one expanding cohort ring
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
    }
  } else {
    stats.waveTime += dt
    if (stats.waveTime >= WAVE_EMIT_TIME) {
      stats.resting = true
      stats.restLeft = WAVE_REST_TIME
      stats.wavesCompleted++
      console.log(
        `SMOKE wave ${stats.wave} complete: total=${stats.wavesCompleted} deflects=${stats.deflectHits}/${stats.deflectAttempts} hit=${stats.timesHit} fps=${stats.fps} minFps=${stats.minFps} bullets=${stats.bullets}`
      )
    } else {
      // --- Emit the spiral ---
      emitAccum += dt
      while (emitAccum >= EMIT_TICK) {
        emitAccum -= EMIT_TICK
        for (let arm = 0; arm < ARMS; arm++) {
          spawnBullet(((spiralAngle + (360 / ARMS) * arm) * Math.PI) / 180)
        }
        spiralAngle = (spiralAngle + STEP_DEG) % 360
      }
    }
  }

  const playerT = Transform.getOrNull(engine.PlayerEntity)
  const px = playerT ? playerT.position.x : CENTER_X
  const pz = playerT ? playerT.position.z : CENTER_Z

  if (iframe > 0) iframe -= dt
  if (stats.deflectCooldown > 0) stats.deflectCooldown = Math.max(0, stats.deflectCooldown - dt)
  if (stats.hitFlash > 0) stats.hitFlash = Math.max(0, stats.hitFlash - dt * 2.5)

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

    // Despawn: left the arena, returned to the emitter, or expired
    if (rFromCenter > ARENA_RADIUS || (b.state === 'deflected' && rFromCenter < 1.2) || b.age > 10) {
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
    if (onLane && distToPlayer < nearestDist) {
      nearest = b
      nearestDist = distToPlayer
    }

    // Hit: knockback + flash, no death, no score
    if (distToPlayer < HIT_DIST && iframe <= 0 && playerT && playerT.position.y < 2.2) {
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
      console.log(`SMOKE hit: wave=${stats.wave} timesHit=${stats.timesHit}`)
    }
  }
  stats.bullets = liveCount

  // --- Resolve the single blue target: none while E recharges; otherwise the
  // current one keeps blue while still threatening (no flicker), else the nearest ---
  if (stats.deflectCooldown > 0) {
    currentTarget = null
  } else if (currentTarget && (!currentTarget.active || !currentTargetOnLane || currentTargetDist > TELEGRAPH_EXIT)) {
    currentTarget = null
  }
  if (!currentTarget && stats.deflectCooldown <= 0) currentTarget = nearest

  for (const b of pool) {
    if (!b.active || b.state === 'deflected') continue
    const should: BulletState = b === currentTarget ? 'telegraph' : 'live'
    if (b.state !== should) setBulletState(b, should)
  }

  // --- Deflect: E sends the blue bullet where the camera points ---
  // Look-see (2026-08-13, owner): aimed deflect instead of auto-return to the
  // emitter — camera forward flattened to the bullet plane. Falls back to the
  // emitter direction if the camera points straight up/down. Targeting unchanged.
  if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN) && stats.deflectCooldown <= 0) {
    stats.deflectCooldown = DEFLECT_COOLDOWN
    stats.deflectAttempts++
    console.log(`SMOKE deflect attempt: ${stats.deflectAttempts} (hits so far ${stats.deflectHits})`)
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
