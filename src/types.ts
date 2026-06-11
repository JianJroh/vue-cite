import type { PositionInfo } from 'vite-plugin-vue-tracer/client/listeners'

/** One copied citation in the popup's history list. */
export interface CiteHistoryEntry {
  id: string
  text: string
  message: string
  tag: string
  filepath: string
  pos: PositionInfo
  timestamp: number
}

/**
 * State shared between the dev server and popup clients in `viteDevtools`
 * mode (file-persisted per app, see persistence.ts), and mirrored
 * key-by-key by the localStorage backend in the other modes.
 */
export interface CiteSharedState {
  /** Copy history, oldest-first; the popup presents it newest-first. */
  history: CiteHistoryEntry[]
  /** Name of the last-used template, or '' if never switched. */
  template: string
}

export interface TemplateContext {
  /** Raw user-typed prefix from the popup textarea, or '' if not provided. */
  message: string
  /** Markdown link to the clicked element's source: `[App.vue:24](vscode://...)`. */
  sourceLink: string
  /** Markdown link to info.getParent(), or '' if no parent. */
  parentLink: string
  /** Cleaned opening tag from outerHTML, or '' if unavailable. */
  snippet: string
  /** `window.location.pathname` at click time. */
  pathname: string
}

export interface TemplateEntry {
  /** Display name; also used as the persisted last-used-template key. */
  name: string
  /**
   * Mustache-style interpolation template: `{{slot}}` is replaced by the
   * matching field on `TemplateContext`. Missing slots render as ''.
   *
   * No conditional / block syntax is supported.
   */
  template: string
}

export interface VueCiteOptions {
  /**
   * Enable this plugin or not, or only enable in certain environment.
   *
   * @default 'dev'
   */
  enabled?: boolean | 'dev' | 'prod'

  /**
   * Templates the user can switch between in the popup.
   * The first entry is the initial default.
   *
   * @default builtinTemplates
   */
  templates?: TemplateEntry[]

  /**
   * Enable Vite DevTools integration.
   *
   * @default false
   */
  viteDevtools?: boolean
}
