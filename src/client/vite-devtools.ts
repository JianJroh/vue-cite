import type { DockClientScriptContext } from '@vitejs/devtools-kit/client'
import { events, isEnabled } from 'vite-plugin-vue-tracer/client/listeners'
import { SHARED_STATE_KEY } from '../constants'
import { createSharedStateBackend, setActiveBackend } from './backend'
import { closePopup, isPopupOpen } from './popup'

export default function clientScriptSetup(ctx: DockClientScriptContext): void {
  // Prefetch the server-registered shared state as soon as the dock script
  // loads, so the popup's synchronous HistoryStore is (almost always) ready
  // before any popup opens. On any failure we silently stay on the
  // localStorage backend — history never breaks, it just loses per-project
  // isolation.
  ctx.rpc.sharedState.get(SHARED_STATE_KEY)
    .then((state) => {
      // value() can be empty if a version-skewed server never registered the key
      if (state.value())
        setActiveBackend(createSharedStateBackend(state))
    })
    .catch(() => {})

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
