import type { TemplateEntry } from '../types'
import { events, isEnabled } from 'vite-plugin-vue-tracer/client/listeners'
import { createLauncher } from './launcher'
import { createPopup } from './popup'
// side-effect: spin up vue-tracer's hover SVG overlay
import 'vite-plugin-vue-tracer/client/overlay'

export interface SetupOptions {
  templates: TemplateEntry[]
  /**
   * Whether to mount the floating launcher button. False when the host opted
   * into `viteDevtools` — the dock entry replaces the launcher in that mode.
   */
  renderLauncher: boolean
}

let installed = false

export function setup(options: SetupOptions): void {
  if (typeof document === 'undefined')
    return
  if (installed)
    return
  installed = true

  const { templates, renderLauncher } = options

  if (renderLauncher)
    createLauncher()

  events.on('click', (info) => {
    if (!info)
      return
    // pause vue-tracer so subsequent hover/click don't fight the popup;
    // closePopup() flips isCiteModeActive back to false, which lets the
    // launcher (or the next launcher click / dock activation) re-arm
    isEnabled.value = false
    createPopup(info, templates)
  })
}

export { closePopup, isPopupOpen } from './popup'
