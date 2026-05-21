import { isEnabled } from 'vite-plugin-vue-tracer/client/listeners'
import { watch } from 'vue'
import { LAUNCHER_ICON_SVG } from '../icon'
import { isPopupOpen } from './popup'
import { isCiteModeActive } from './state'

let host: HTMLDivElement | undefined

const LAUNCHER_STYLES = `
:host {
  all: initial;
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 2147483640;
}
.launcher {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background-color: rgba(255, 255, 255, 0.5);
  color: #475569;
  border-radius: 12px;
  cursor: pointer;
  backdrop-filter: blur(7px);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding: 0;
}
.launcher:hover { background-color: rgba(255, 255, 255, 0.85); }
.launcher:focus-visible { outline: 2px solid rgba(0, 0, 0, 0.4); outline-offset: 2px; }
.launcher svg { width: 18px; height: 18px; display: block; }
.launcher.active {
  background-color: rgb(17, 153, 119);
  color: #fff;
  border-color: transparent;
  animation: vc-ripple 1.6s ease-out infinite;
}
@keyframes vc-ripple {
  0%   { box-shadow: 0 0 0 0    rgba(17, 153, 119, 0.5); }
  70%  { box-shadow: 0 0 0 6px rgba(17, 153, 119, 0);   }
  100% { box-shadow: 0 0 0 6px rgba(17, 153, 119, 0);   }
}
.glow {
  position: absolute;
  left: 0;
  top: 0;
  width: 160px;
  height: 160px;
  opacity: 0;
  transition: all 1000ms ease-out;
  pointer-events: none;
  z-index: -1;
  border-radius: 9999px;
  filter: blur(60px);
  transform: translate(-50%, -50%);
  background-image: linear-gradient(45deg, rgb(17, 153, 119), #2dd4bf, #06b6d4);
}
:host(:hover) .glow { opacity: 0.6; }
.launcher.active ~ .glow { opacity: 0; }
`

export function createLauncher(): void {
  if (host || typeof document === 'undefined')
    return

  host = document.createElement('div')
  // mark for vue-tracer to ignore, and as a hook for external scripts/tests
  host.setAttribute('data-v-inspector-ignore', '')
  host.setAttribute('data-vue-cite-launcher', '')

  const shadow = host.attachShadow({ mode: 'open' })
  shadow.innerHTML = `<style>${LAUNCHER_STYLES}</style>`
    + `<button class="launcher" type="button" aria-label="Vue Cite" title="Vue Cite">${LAUNCHER_ICON_SVG}</button>`
    + `<div class="glow"></div>`

  const btn = shadow.querySelector('.launcher') as HTMLButtonElement
  btn.addEventListener('click', (e) => {
    e.stopPropagation()
    // while a popup is up, treat the launcher as inert — popup dismissal is
    // the source of truth for ending the session
    if (isPopupOpen())
      return
    isCiteModeActive.value = !isCiteModeActive.value
  })

  // visual + tracer sync; isCiteModeActive is also flipped by popup close and Esc
  watch(isCiteModeActive, (active) => {
    btn.classList.toggle('active', active)
    isEnabled.value = active
  })

  // Esc cancels an active-but-not-yet-clicked session; popup has its own Esc
  // handling so we bail when a popup is open to avoid racing it
  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape')
      return
    if (!isCiteModeActive.value)
      return
    if (isPopupOpen())
      return
    isCiteModeActive.value = false
  }, { capture: true })

  document.body.appendChild(host)
}
