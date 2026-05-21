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
  /** Display name; also used as the persistence key in localStorage. */
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
