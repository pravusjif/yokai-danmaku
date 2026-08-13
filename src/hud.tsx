import ReactEcs, { Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { copyToClipboard } from '~system/RestrictedActions'
import { stats } from './state'

// The HUD is the instrument, not decoration: wave count (H1-01 criterion),
// deflect ratio (H1-02 rider), bullets + fps (H1-03 rider).
// Clicking the panel copies all counters as one line — session-log raw data.
export function setupUi() {
  ReactEcsRenderer.setUiRenderer(Hud, { virtualWidth: 1920, virtualHeight: 1080 })
}

let copiedFlashUntil = 0

function copyStats() {
  const text =
    `H1-01 wave=${stats.wave} completed=${stats.wavesCompleted} ` +
    `deflects=${stats.deflectHits}/${stats.deflectAttempts} timesHit=${stats.timesHit} ` +
    `bullets=${stats.bullets} fps=${stats.fps} minFps=${stats.minFps}`
  copiedFlashUntil = Date.now() + 1500
  copyToClipboard({ text }).catch(() => {
    console.log('copyToClipboard failed; data line: ' + text)
  })
  console.log('HUD copied: ' + text)
}

const line = (value: string, size = 24, color = Color4.White()) => (
  <Label
    value={value}
    fontSize={size}
    color={color}
    font="monospace"
    textAlign="middle-right"
    uiTransform={{ height: size + 10, width: '100%' }}
  />
)

function Hud() {
  return (
    <UiEntity uiTransform={{ width: '100%', height: '100%' }}>
      {/* hit flash — red overlay, decays in game.ts */}
      {stats.hitFlash > 0 && (
        <UiEntity
          uiTransform={{ positionType: 'absolute', position: { top: 0, left: 0 }, width: '100%', height: '100%' }}
          uiBackground={{ color: Color4.create(1, 0.1, 0.1, 0.35 * stats.hitFlash) }}
        />
      )}

      {/* counters — click to copy all values to the clipboard */}
      <UiEntity
        uiTransform={{
          positionType: 'absolute',
          position: { top: 110, left: 1400 },
          width: 460,
          flexDirection: 'column',
          alignItems: 'flex-end',
          padding: 12
        }}
        uiBackground={{ color: Color4.create(0, 0, 0, 0.55) }}
        onMouseDown={copyStats}
      >
        {line(`WAVE ${stats.wave}`, 36, Color4.create(1, 0.85, 0.3, 1))}
        {line(`waves completed: ${stats.wavesCompleted}`)}
        {line(
          stats.deflectCooldown > 0
            ? `deflects: ${stats.deflectHits}/${stats.deflectAttempts} (recharging)`
            : `deflects: ${stats.deflectHits}/${stats.deflectAttempts}`,
          24,
          stats.deflectCooldown > 0 ? Color4.create(0.45, 0.45, 0.45, 1) : Color4.White()
        )}
        {line(`times hit: ${stats.timesHit}`)}
        {line(`bullets: ${stats.bullets} · fps ${stats.fps} (min ${stats.minFps || '—'})`, 20, Color4.create(0.7, 0.7, 0.7, 1))}
        {line(
          Date.now() < copiedFlashUntil ? 'copied!' : 'click to copy',
          16,
          Date.now() < copiedFlashUntil ? Color4.create(0.4, 1, 0.5, 1) : Color4.create(0.55, 0.55, 0.55, 1)
        )}
      </UiEntity>

      {/* rest countdown — centre screen between waves */}
      {stats.resting && (
        <UiEntity
          uiTransform={{
            positionType: 'absolute',
            position: { top: '40%', left: 0 },
            width: '100%',
            justifyContent: 'center'
          }}
        >
          <Label
            value={`next wave in ${Math.ceil(stats.restLeft)}`}
            fontSize={44}
            color={Color4.create(1, 0.85, 0.3, 1)}
            font="monospace"
          />
        </UiEntity>
      )}

      {/* control reminder — matches the task text, no feel narration */}
      <UiEntity
        uiTransform={{
          positionType: 'absolute',
          position: { bottom: 30, left: 0 },
          width: '100%',
          justifyContent: 'center'
        }}
      >
        <Label
          value="WASD move · E deflect when a bullet flashes blue"
          fontSize={20}
          color={Color4.create(0.8, 0.8, 0.8, 1)}
          font="monospace"
        />
      </UiEntity>
    </UiEntity>
  )
}
