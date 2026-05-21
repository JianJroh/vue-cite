import type { DockClientScriptContext } from '@vitejs/devtools-kit/client'
import { events, isEnabled } from 'vite-plugin-vue-tracer/client/listeners'
import { closePopup, isPopupOpen } from './popup'

export default function clientScriptSetup(ctx: DockClientScriptContext): void {
  let offClick: (() => void) | undefined

  ctx.current.events.on('entry:activated', () => {
    if (isPopupOpen())
      closePopup()
    isEnabled.value = true

    offClick?.()
    offClick = events.on('click', () => {
      ctx.docks.switchEntry(null)
    })
  })

  ctx.current.events.on('entry:deactivated', () => {
    isEnabled.value = false
    offClick?.()
    offClick = undefined
  })
}
