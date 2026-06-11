import type { ViteDevToolsNodeContext } from '@vitejs/devtools-kit'
import type { CiteSharedState } from './types'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import { SHARED_STATE_KEY } from './constants'

/**
 * Server half of the shared-state persistence: seed from a workspace storage
 * file and write back debounced on every update (clients sit on the other
 * side via `ctx.rpc.sharedState`, see client/vite-devtools.ts).
 *
 * Not ready yet — not called anywhere; await it in `devtools.setup` to
 * enable. While off, the popup falls back to localStorage.
 */
export async function setupSharedStatePersistence(ctx: ViteDevToolsNodeContext): Promise<void> {
  // the storage dir is monorepo-wide, so key the file by app (Vite root):
  // basename for readability + path hash to disambiguate same-named apps
  const root = ctx.viteConfig.root
  const appKey = `${basename(root)}-${createHash('sha256').update(root).digest('hex').slice(0, 8)}`
  const filepath = join(ctx.host.getStorageDir('workspace'), 'vue-cite', `${appKey}.json`)
  const initialValue: CiteSharedState = { history: [], template: '' }
  try {
    const saved = JSON.parse(fs.readFileSync(filepath, 'utf-8'))
    if (Array.isArray(saved?.history))
      initialValue.history = saved.history
    if (typeof saved?.template === 'string')
      initialValue.template = saved.template
  }
  catch {
    // ignore — first run or unreadable file; start fresh
  }

  const state = await ctx.rpc.sharedState.get(SHARED_STATE_KEY, { initialValue })

  let timer: ReturnType<typeof setTimeout> | undefined
  state.on('updated', () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fsp.mkdir(dirname(filepath), { recursive: true })
        .then(() => fsp.writeFile(filepath, `${JSON.stringify(state.value(), null, 2)}\n`))
        .catch(() => {
          // ignore — persistence is best-effort
        })
    }, 100)
  })
}
