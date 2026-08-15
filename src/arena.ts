import { engine, Entity, Transform, MeshRenderer, MeshCollider, Material, Billboard, BillboardMode } from '@dcl/sdk/ecs'
import { Vector3, Quaternion, Color4, Color3 } from '@dcl/sdk/math'

export const CENTER_X = 16
export const CENTER_Z = 16
export const ARENA_RADIUS = 12.5

// Greybox: primitives only, one colour per meaning.
// Grey = walkable, purple glow = the emitter, walkway ring = the "sunken" rim.
export function buildArena() {
  // Arena floor — flat grey disk
  const floor = engine.addEntity()
  Transform.create(floor, {
    position: Vector3.create(CENTER_X, 0.05, CENTER_Z),
    scale: Vector3.create(ARENA_RADIUS * 2 + 2, 0.1, ARENA_RADIUS * 2 + 2)
  })
  MeshRenderer.setCylinder(floor)
  MeshCollider.setCylinder(floor)
  Material.setPbrMaterial(floor, {
    albedoColor: Color4.create(0.25, 0.25, 0.28, 1),
    metallic: 0,
    roughness: 0.9
  })

  // Walkway ring — 12 boxes around the pit, raised 2.5 m (fakes the "sunken" arena)
  const segments = 12
  const ringRadius = 14
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2
    const seg = engine.addEntity()
    Transform.create(seg, {
      position: Vector3.create(CENTER_X + Math.cos(angle) * ringRadius, 2.5, CENTER_Z + Math.sin(angle) * ringRadius),
      rotation: Quaternion.fromEulerDegrees(0, 90 - (angle * 180) / Math.PI, 0),
      scale: Vector3.create(7.6, 0.3, 3)
    })
    MeshRenderer.setBox(seg)
    MeshCollider.setBox(seg)
    Material.setPbrMaterial(seg, {
      albedoColor: Color4.create(0.35, 0.35, 0.4, 1),
      metallic: 0,
      roughness: 0.8
    })
  }

  // Emitter — glowing sphere at the centre (the yokai stand-in; art is faked)
  const emitter = engine.addEntity()
  Transform.create(emitter, {
    position: Vector3.create(CENTER_X, 1.2, CENTER_Z),
    scale: Vector3.create(1.5, 1.5, 1.5)
  })
  MeshRenderer.setSphere(emitter)
  MeshCollider.setSphere(emitter)
  Material.setPbrMaterial(emitter, {
    albedoColor: Color4.create(0.1, 0, 0.15, 1),
    emissiveColor: Color3.create(0.7, 0.3, 1),
    emissiveIntensity: 3
  })

  buildYokaiBar()
}

// --- Yokai life bar — primitives over the pit, always facing the player.
// Fill is left-anchored under a pivot so it drains from the right.
const BAR_WIDTH = 4
let barFill: Entity | null = null

function buildYokaiBar() {
  const root = engine.addEntity()
  Transform.create(root, { position: Vector3.create(CENTER_X, 3.6, CENTER_Z) })
  Billboard.create(root, { billboardMode: BillboardMode.BM_Y })

  const bg = engine.addEntity()
  Transform.create(bg, {
    parent: root,
    scale: Vector3.create(BAR_WIDTH + 0.3, 0.4, 0.05)
  })
  MeshRenderer.setBox(bg)
  Material.setPbrMaterial(bg, {
    albedoColor: Color4.create(0.05, 0.05, 0.08, 1),
    metallic: 0,
    roughness: 1
  })

  const pivot = engine.addEntity()
  Transform.create(pivot, { parent: root, position: Vector3.create(-BAR_WIDTH / 2, 0, 0) })

  barFill = engine.addEntity()
  Transform.create(barFill, {
    parent: pivot,
    // thicker than the bg box so the fill protrudes on both faces of the
    // billboard — an offset inside the bg leaves it occluded from one side
    position: Vector3.create(BAR_WIDTH / 2, 0, 0),
    scale: Vector3.create(BAR_WIDTH, 0.3, 0.15)
  })
  MeshRenderer.setBox(barFill)
  Material.setPbrMaterial(barFill, {
    albedoColor: Color4.create(1, 0.2, 0.7, 1),
    emissiveColor: Color3.create(1, 0.2, 0.7),
    emissiveIntensity: 4
  })
}

export function updateYokaiBar(frac: number) {
  if (!barFill) return
  const f = Math.max(0, Math.min(1, frac))
  const t = Transform.getMutable(barFill)
  t.scale.x = BAR_WIDTH * f
  t.position.x = (BAR_WIDTH * f) / 2
}
