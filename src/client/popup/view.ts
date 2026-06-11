import type { HistoryEntry } from './history'
import { formatAbsolute, formatRelative } from './format'

// CSS width value: prefer 280px, but never exceed 90vw on narrow viewports
export const POPUP_WIDTH = 'min(280px, 90vw)'

const COPY_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`
export const CHECK_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
const SWITCH_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>`
const HISTORY_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>`
const BACK_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`

const GLASS_FILTER_SVG = `<svg class="glass-defs" aria-hidden="true" focusable="false"><defs><filter id="vc-liquid-glass" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.01 0.01" numOctaves="2" seed="42" result="noise"/><feGaussianBlur in="noise" stdDeviation="0.5" result="blurred"/><feDisplacementMap in="SourceGraphic" in2="blurred" scale="34" xChannelSelector="R" yChannelSelector="G"/></filter></defs></svg>`

const LIQUID_GLASS_STYLES = `
.glass-defs { position: absolute; width: 0; height: 0; overflow: hidden; pointer-events: none; }
.liquid-glass {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.5);
  background-color: transparent;
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
  box-shadow:
    var(--vc-shadow, 0 0 rgba(0, 0, 0, 0)),
    inset 2px 2px 1px -1px rgba(255, 255, 255, 0.98),
    inset -2px -2px 2px -2px rgba(255, 255, 255, 0.6),
    inset 0 0 0 1px rgba(255, 255, 255, 0.4);
}
.liquid-glass::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background-color: rgba(245, 245, 245, 0.4);
  -webkit-backdrop-filter: blur(6px) saturate(1.6);
  backdrop-filter: blur(6px) saturate(1.6);
  filter: url(#vc-liquid-glass);
}
.liquid-glass::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: inherit;
  pointer-events: none;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.5), transparent 42%);
  box-shadow: inset 0 -1px 0 0 rgba(15, 23, 42, 0.06);
}
.liquid-glass > * { position: relative; z-index: 2; }
`

const POPUP_STYLES = `
:host {
  all: initial;
  --vc-card: #ffffff;
  --vc-text: #0f172a;
  --vc-placeholder: #94a3b8;
  --vc-shadow: 0 10px 30px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(15, 23, 42, 0.04);
  --vc-accent: rgb(22, 42, 15);
  --vc-accent-hover: rgb(22, 42, 15, 0.85);
  --vc-accent-success: rgb(17, 153, 119);
  --vc-danger: rgba(168, 25, 25, 0.85);
  --vc-focus: rgba(17, 153, 119, 0.45);
}
* { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
[hidden] { display: none !important; }
.card {
  width: ${POPUP_WIDTH};
  padding: 6px;
  color: var(--vc-text);
  color: rgb(17, 153, 119);
  border-radius: 18px;
  box-shadow: var(--vc-shadow);
  overflow: hidden;
  font-size: 12px;
  background-color: rgb(245, 245, 245, 0.75);
  border: 1px solid rgb(220, 220, 220, 0.75);
  backdrop-filter: blur(8px);
}
.input {
  border-radius: 12px;
  padding: 8px;
  background-color: rgba(255, 255, 255, 0.75);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 0 0 1px rgba(15, 23, 42, 0.04);
  transition: box-shadow 0.15s;
}
textarea {
  display: block;
  width: 100%;
  field-sizing: content;
  min-height: 20px;
  max-height: 100px;
  resize: none;
  scrollbar-width: none;
  outline: none;
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--vc-text);
  font-size: 12px;
  line-height: 1.4;
}
textarea::placeholder { color: var(--vc-placeholder); }
.actions {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-top: 8px;
}
.history-btn, .switcher {
  display: inline-flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgb(220, 220, 220, 0.9);
  color: var(--vc-text);
  font-size: 11px;
  font-weight: 500;
  height: 24px;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.15s, border-color 0.15s;
  font-family: inherit;
}
.history-btn { width: 24px; padding: 0; justify-content: center; }
.switcher { gap: 6px; padding: 0 6px 0 10px; }
.history-btn:hover, .switcher:hover {
  background-color: rgba(240, 240, 240);
  border-color: rgba(15, 15, 15, 0.1);
}
.history-btn svg, .switcher svg {
  width: 12px;
  height: 12px;
  display: block;
  opacity: 0.5;
  transition: opacity 0.15s;
}
.history-btn:hover svg, .switcher:hover svg { opacity: 1; }
.copy {
  margin-left: auto;
  background: var(--vc-accent);
  color: #fff;
  border: 0;
  border-radius: 10px;
  width: 24px;
  height: 24px;
  padding: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.copy:hover { background: var(--vc-accent-hover); }
.copy svg { width: 12px; height: 12px; display: block; }
.copy.copied { background: var(--vc-accent-success); }

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px 6px 4px;
}
.back-btn, .clear-btn {
  border: 0;
  background: transparent;
  color: var(--vc-text);
  font-size: 11px;
  font-family: inherit;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background-color 0.15s, color 0.15s;
}
.back-btn { display: inline-flex; align-items: center; gap: 2px; }
.back-btn svg { width: 14px; height: 14px; display: block; }
.back-btn:hover { background-color: rgba(255, 255, 255, 0.9); }
.clear-btn { color: var(--vc-danger); }
.clear-btn:hover { background-color: rgba(168, 25, 25, 0.08); }
.history-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
  scrollbar-width: thin;
  max-height: 280px;
  background-color: rgba(255, 255, 255, 0.75);
  border-radius: 12px;
  padding: 4px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 0 0 1px rgba(15, 23, 42, 0.04);
}
.history-empty {
  text-align: center;
  color: var(--vc-placeholder);
  padding: 28px 12px;
  font-size: 11px;
  line-height: 1.4;
}
.row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.15s;
}
.row:hover { background-color: rgba(0, 0, 0, 0.04); }
.row.copied { background-color: rgba(17, 153, 119, 0.18); }
.row-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 11px;
  color: var(--vc-text);
}
.row-tag { color: var(--vc-accent); font-weight: 500; }
.row-time, .row-detail { color: var(--vc-placeholder); }
.row-time {
  flex-shrink: 0;
  font-size: 11px;
  transition: opacity 0.15s;
}
.row:hover .row-time { opacity: 0; }
.row-delete {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--vc-placeholder);
  cursor: pointer;
  border-radius: 6px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s, background-color 0.15s, color 0.15s;
  font-size: 14px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
}
.row:hover .row-delete {
  opacity: 1;
  pointer-events: auto;
}
.row-delete:hover { background-color: rgba(168, 25, 25, 0.1); color: var(--vc-danger); }
${LIQUID_GLASS_STYLES}
`

export function renderHtml(initialName: string): string {
  return `<style>${POPUP_STYLES}</style>
${GLASS_FILTER_SVG}
<div class="card liquid-glass">
  <div class="compose-view">
    <div class="input">
      <textarea placeholder="Prompt..."></textarea>
      <div class="actions">
        <button class="history-btn" type="button" aria-label="View history" title="View history">${HISTORY_ICON}</button>
        <button class="switcher" type="button" aria-label="Switch template" title="Switch template"><span class="switcher-name">${escapeHtml(initialName)}</span>${SWITCH_ICON}</button>
        <button class="copy" aria-label="Copy">${COPY_ICON}</button>
      </div>
    </div>
  </div>
  <div class="history-view" hidden>
    <div class="history-header">
      <button class="back-btn" type="button" aria-label="Back to compose">${BACK_ICON}Back</button>
      <button class="clear-btn" type="button" aria-label="Clear all history">Clear</button>
    </div>
    <div class="history-list"></div>
  </div>
</div>`
}

export function renderRow(entry: HistoryEntry): string {
  const basename = entry.filepath.split('/').pop() || entry.filepath
  const tagPart = entry.tag
    ? `<span class="row-tag">&lt;${escapeHtml(entry.tag)}&gt;</span>`
    : escapeHtml(basename)
  const detail = entry.message || entry.text
  const detailPart = detail
    ? ` · <span class="row-detail">${escapeHtml(detail)}</span>`
    : ''
  // time is pinned to the right as a sibling of .row-text so it stays visible
  // while the tag/message text truncates in the flexible region
  const time = `<span class="row-time" title="${escapeHtml(formatAbsolute(entry.timestamp))}">${formatRelative(entry.timestamp)}</span>`
  return `<div class="row" data-id="${escapeHtml(entry.id)}">`
    + `<span class="row-text">${tagPart}${detailPart}</span>${time}`
    + `<button class="row-delete" type="button" aria-label="Delete entry" title="Delete">×</button>`
    + `</div>`
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;',
  }[c]!))
}
