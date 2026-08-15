// H2 core-loop greybox — the H1 weave+deflect verb (frozen) plus the yokai
// life bar, death rule (hit = out for the wave, streak resets) and wipe reset.
// Experiment file: design/02-core-loop/H2-01-lifebar-preserves-weave_active.md
// (H2-02 and H2-03 ride the same build, their files stay parked.)
import { engine } from '@dcl/sdk/ecs'
import { buildArena } from './arena'
import { setupGame, gameSystem } from './game'
import { setupUi } from './hud'

export function main() {
  buildArena()
  setupGame()
  engine.addSystem(gameSystem)
  setupUi()
}
