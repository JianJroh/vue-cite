import type { SharedState } from '@vitejs/devtools-kit/utils/shared-state'
import type { CiteHistoryEntry, CiteSharedState } from '../types'

const HISTORY_KEY = 'vite-plugin-vue-cite:history'
const TEMPLATE_KEY = 'vite-plugin-vue-cite:template'

/**
 * Persistence backend for popup state (history + template preference).
 *
 * Two implementations: localStorage (launcher and prod modes — unchanged
 * legacy on-disk format) and DevTools shared state (`viteDevtools` mode —
 * per-project, server-persisted, synced across clients).
 */
export interface CiteStateBackend {
  /** Snapshot of the current state. Treat as immutable — change it via `mutate`. */
  get: () => CiteSharedState
  /** Apply a mutation; takes effect synchronously for this client. */
  mutate: (fn: (state: CiteSharedState) => void) => void
  /**
   * Subscribe to state updates, including ones from other clients (tabs /
   * browsers). The localStorage backend never fires. Returns unsubscribe.
   */
  onUpdate: (fn: () => void) => () => void
}

export function createLocalStorageBackend(
  storage: Pick<Storage, 'getItem' | 'setItem'> = localStorage,
): CiteStateBackend {
  function readHistory(): CiteHistoryEntry[] {
    try {
      const parsed = JSON.parse(storage.getItem(HISTORY_KEY) ?? 'null')
      return Array.isArray(parsed) ? parsed : []
    }
    catch {
      return []
    }
  }

  // the template key holds a raw (non-JSON) string — legacy format, kept
  function readTemplate(): string {
    try {
      return storage.getItem(TEMPLATE_KEY) ?? ''
    }
    catch {
      return ''
    }
  }

  return {
    get: () => ({ history: readHistory(), template: readTemplate() }),
    mutate(fn) {
      const state = { history: readHistory(), template: readTemplate() }
      fn(state)
      try {
        storage.setItem(HISTORY_KEY, JSON.stringify(state.history))
        storage.setItem(TEMPLATE_KEY, state.template)
      }
      catch {
        // ignore — storage may be disabled or full
      }
    },
    onUpdate: () => () => {},
  }
}

export function createSharedStateBackend(state: SharedState<CiteSharedState>): CiteStateBackend {
  return {
    // value() returns Immutable<T>; the backend's "treat as immutable"
    // contract makes the widening cast safe
    get: () => state.value() as CiteSharedState,
    mutate: fn => state.mutate(fn),
    onUpdate: fn => state.on('updated', fn),
  }
}

let activeBackend: CiteStateBackend | undefined

/**
 * Swap in the shared-state backend once the DevTools RPC handshake succeeds
 * (see `client/vite-devtools.ts`). Until/unless that happens, popups fall
 * back to localStorage.
 */
export function setActiveBackend(backend: CiteStateBackend): void {
  activeBackend = backend
}

export function getActiveBackend(): CiteStateBackend {
  activeBackend ??= createLocalStorageBackend()
  return activeBackend
}
