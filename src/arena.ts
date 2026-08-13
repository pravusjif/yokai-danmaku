import { engine, Transform, MeshRenderer, MeshCollider, Material } from '@dcl/sdk/ecs'
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
}
