import type { ElementTraceInfo } from 'vite-plugin-vue-tracer/client/listeners'
import type { TemplateEntry } from '../../types'
import { state as overlayState } from 'vite-plugin-vue-tracer/client/overlay'
import { renderEntry } from '../helpers'
import { isCiteModeActive } from '../state'
import { attachAnchored, detachAnchored } from './anchor'
import { stopDismiss, watchDismiss } from './dismiss'
import { createHistoryStore } from './history'
import { CHECK_ICON, POPUP_WIDTH, renderHtml, renderRow } from './view'

const TEMPLATE_KEY = 'vite-plugin-vue-cite:template'

let host: HTMLDivElement | undefined

export function isPopupOpen(): boolean {
  return !!host
}

export function createPopup(info: ElementTraceInfo, templates: TemplateEntry[]): void {
  closePopup()

  let currentIndex = resolveInitialIndex(templates)
  const history = createHistoryStore()

  host = document.createElement('div')
  // mark for vue-tracer to ignore, and as a hook for our own selectors
  host.setAttribute('data-v-inspector-ignore', '')
  host.setAttribute('data-vue-cite-popup', '')
  attachAnchored(host, POPUP_WIDTH)

  const shadow = host.attachShadow({ mode: 'open' })
  shadow.innerHTML = renderHtml(templates[currentIndex]?.name ?? '')

  const composeView = shadow.querySelector('.compose-view') as HTMLElement
  const historyView = shadow.querySelector('.history-view') as HTMLElement
  const textarea = shadow.querySelector('textarea') as HTMLTextAreaElement
  const copyBtn = shadow.querySelector('.copy') as HTMLButtonElement
  const switcherBtn = shadow.querySelector('.switcher') as HTMLButtonElement
  const historyBtn = shadow.querySelector('.history-btn') as HTMLButtonElement
  const backBtn = shadow.querySelector('.back-btn') as HTMLButtonElement
  const clearBtn = shadow.querySelector('.clear-btn') as HTMLButtonElement
  const historyList = shadow.querySelector('.history-list') as HTMLDivElement

  function showCompose(): void {
    composeView.hidden = false
    historyView.hidden = true
    textarea.focus()
    const end = textarea.value.length
    textarea.setSelectionRange(end, end)
  }

  function showHistory(): void {
    composeView.hidden = true
    historyView.hidden = false
    renderHistoryList()
  }

  function renderHistoryList(): void {
    const items = history.list()
    if (items.length === 0) {
      historyList.innerHTML = `<div class="history-empty">Your copy history will appear here.</div>`
      clearBtn.hidden = true
      return
    }
    clearBtn.hidden = false
    // history.list() is already newest-first
    historyList.innerHTML = items.map(renderRow).join('')
  }

  async function triggerCopy(): Promise<void> {
    const entry = templates[currentIndex]
    if (!entry)
      return
    const text = renderEntry(entry, info, textarea.value)
    const ok = await copyText(text)
    if (!ok)
      return
    history.add({
      text,
      message: textarea.value,
      tag: extractTag(info),
      filepath: info.filepath,
      pos: info.pos,
    })
    copyBtn.classList.add('copied')
    copyBtn.innerHTML = CHECK_ICON
    setTimeout(closePopup, 600)
  }

  copyBtn.addEventListener('click', triggerCopy)
  textarea.addEventListener('keydown', (e) => {
    // Enter submits; Shift+Enter inserts a newline. Skip while IME is composing.
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      e.preventDefault()
      triggerCopy()
    }
  })

  const nameSpan = switcherBtn.querySelector('.switcher-name') as HTMLSpanElement
  switcherBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % templates.length
    const next = templates[currentIndex]
    nameSpan.textContent = next.name
    try {
      localStorage.setItem(TEMPLATE_KEY, next.name)
    }
    catch {
      // ignore — storage may be disabled
    }
    textarea.focus()
  })

  historyBtn.addEventListener('click', showHistory)
  backBtn.addEventListener('click', showCompose)
  clearBtn.addEventListener('click', () => {
    history.clear()
    renderHistoryList()
  })

  historyList.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement
    const deleteBtn = target.closest('.row-delete') as HTMLButtonElement | null
    if (deleteBtn) {
      e.stopPropagation()
      const rowEl = deleteBtn.closest('.row') as HTMLElement | null
      const id = rowEl?.dataset.id
      if (!id)
        return
      history.remove(id)
      renderHistoryList()
      return
    }
    const rowEl = target.closest('.row') as HTMLElement | null
    if (!rowEl)
      return
    const id = rowEl.dataset.id
    const entry = history.list().find(en => en.id === id)
    if (!entry)
      return
    const ok = await copyText(entry.text)
    if (!ok)
      return
    rowEl.classList.add('copied')
    setTimeout(closePopup, 600)
  })

  document.body.appendChild(host)
  textarea.focus()

  watchDismiss(host, closePopup)
}

export function closePopup(): void {
  stopDismiss()
  detachAnchored()
  if (host) {
    host.remove()
    host = undefined
    // clear vue-tracer overlay so the lingering selection highlight on the
    // clicked element disappears alongside the popup
    overlayState.isVisible = false
    overlayState.main = undefined
  }
  // end the cite session — launcher watches this to fall back to idle; in
  // viteDevtools mode it stays false anyway, so this assignment is harmless
  isCiteModeActive.value = false
}

function resolveInitialIndex(templates: TemplateEntry[]): number {
  if (templates.length === 0)
    return -1
  let stored: string | null = null
  try {
    stored = localStorage.getItem(TEMPLATE_KEY)
  }
  catch {
    // ignore
  }
  if (stored) {
    const idx = templates.findIndex(t => t.name === stored)
    if (idx >= 0)
      return idx
  }
  return 0
}

function extractTag(info: ElementTraceInfo): string {
  const t: any = info.vnode?.type
  if (!t)
    return ''
  if (typeof t === 'string')
    return t
  return t.name ?? t.__name ?? ''
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  }
  catch {
    return false
  }
}
