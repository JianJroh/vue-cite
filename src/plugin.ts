import type { Plugin } from 'vite'
import type { VueCiteOptions } from './types'
import { LAUNCHER_ICON_DATA_URI } from './icon'
import { builtinTemplates } from './templates'

const VIRTUAL_ID = 'virtual:vite-plugin-vue-cite/entry'
const RESOLVED_ID = `\0${VIRTUAL_ID}`

export function VueCite(options: VueCiteOptions = {}): Plugin | undefined {
  let { enabled = 'dev', templates, viteDevtools = false } = options

  if (enabled === false)
    return

  if (templates && templates.length === 0) {
    console.warn('[vite-plugin-vue-cite] `templates` is an empty array; falling back to builtinTemplates.')
    templates = undefined
  }

  const resolvedTemplates = templates ?? builtinTemplates

  return {
    name: 'vite-plugin-vue-cite',
    configResolved(config) {
      if (enabled === 'dev')
        enabled = config.command === 'serve'
      else if (enabled === 'prod')
        enabled = config.command === 'build'
    },
    resolveId(id) {
      if (id === VIRTUAL_ID)
        return RESOLVED_ID
    },
    load(id) {
      if (id !== RESOLVED_ID)
        return
      return [
        `import { setup } from 'vite-plugin-vue-cite/client'`,
        `setup({ templates: ${JSON.stringify(resolvedTemplates)}, renderLauncher: ${!viteDevtools} })`,
        '',
      ].join('\n')
    },
    // `order: 'pre'` ensures the injected inline import is in the HTML before
    // Vite scans entry scripts — in build, the `import 'virtual:…'` becomes
    // a real chunk; in dev, the browser resolves it via the dev server.
    transformIndexHtml: {
      order: 'pre',
      handler() {
        if (!enabled)
          return
        return [{
          tag: 'script',
          attrs: { type: 'module' },
          children: `import '${VIRTUAL_ID}'`,
          injectTo: 'body',
        }]
      },
    },
    // Vite DevTools integration — opt-in via `viteDevtools: true`; when on,
    // the floating launcher is suppressed (see `renderLauncher` above) so the
    // two activation surfaces never appear together
    ...(viteDevtools
      ? {
          devtools: {
            setup(ctx) {
              ctx.docks.register({
                id: 'vue-cite',
                title: 'Vue Cite',
                icon: LAUNCHER_ICON_DATA_URI,
                type: 'action',
                action: {
                  importFrom: 'vite-plugin-vue-cite/client/vite-devtools',
                  importName: 'default',
                },
              })
            },
          },
        }
      : {}),
  }
}
