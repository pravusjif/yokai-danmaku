// H1-01 greybox — weave through one repeating bullet pattern + timed deflect.
// Experiment file: design/01-find-the-fun/H1-01-verb-fun_active.md
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
