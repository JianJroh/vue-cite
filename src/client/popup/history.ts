import type { CiteHistoryEntry } from '../../types'
import type { CiteStateBackend } from '../backend'

const HISTORY_MAX = 50

export type HistoryEntry = CiteHistoryEntry

/** Fields a caller provides; the store stamps `id` and `timestamp` itself. */
export type NewEntry = Omit<HistoryEntry, 'id' | 'timestamp'>

export interface HistoryStore {
  /** Entries newest-first. */
  list: () => HistoryEntry[]
  /** Stamp id + timestamp, trim to max, persist; return the new (newest-first) list. */
  add: (entry: NewEntry) => HistoryEntry[]
  /** Drop the entry with this id; return the new list. */
  remove: (id: string) => HistoryEntry[]
  /** Drop everything; return the (empty) list. */
  clear: () => HistoryEntry[]
}

export interface HistoryStoreOptions {
  /** Maximum entries retained. Defaults to 50; pass a small value for cheap cap tests. */
  max?: number
}

export function createHistoryStore(
  backend: CiteStateBackend,
  options: HistoryStoreOptions = {},
): HistoryStore {
  const { max = HISTORY_MAX } = options

  // The backend keeps history oldest-first (unchanged from the original
  // localStorage format, and how it lands on disk in viteDevtools mode);
  // `list()` reverses a copy to present newest-first. Reading through the
  // backend on every call keeps the list fresh under multi-client updates.
  function list(): HistoryEntry[] {
    return backend.get().history.slice().reverse()
  }

  // every mutation commits through the backend and returns the fresh list
  function commit(fn: (history: HistoryEntry[]) => HistoryEntry[]): HistoryEntry[] {
    backend.mutate((state) => {
      state.history = fn(state.history)
    })
    return list()
  }

  function add(entry: NewEntry): HistoryEntry[] {
    return commit(history => history
      .concat({ ...entry, id: crypto.randomUUID(), timestamp: Date.now() })
      .slice(-max))
  }

  function remove(id: string): HistoryEntry[] {
    return commit(history => history.filter(en => en.id !== id))
  }

  function clear(): HistoryEntry[] {
    return commit(() => [])
  }

  return { list, add, remove, clear }
}
