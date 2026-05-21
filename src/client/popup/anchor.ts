const ANCHOR_NAME = '--vue-cite-popup-anchor'
const OVERLAY_ANCHOR_SELECTOR = '#vue-tracer-overlay > div'
const GAP = 8

// Single-popup singleton: the overlay element whose `anchor-name` we overwrote,
// plus its previous value to restore on detach. `undefined` when not anchored
// (e.g. the viewport-center fallback touches no overlay state).
let active: { el: HTMLElement, prevAnchorName: string } | undefined

/**
 * Lay out `el` as a fixed, top-most box anchored under vue-tracer's overlay; if
 * the overlay isn't present, center it in the viewport. Overwrites the overlay's
 * `anchor-name` and remembers the previous value — call `detachAnchored()` to
 * restore it.
 */
export function attachAnchored(el: HTMLElement, width: string): void {
  Object.assign(el.style, {
    position: 'fixed',
    zIndex: '1000000',
    width,
  })

  const overlayAnchor = document.querySelector<HTMLElement>(OVERLAY_ANCHOR_SELECTOR)
  if (overlayAnchor) {
    active = { el: overlayAnchor, prevAnchorName: overlayAnchor.style.getPropertyValue('anchor-name') }
    overlayAnchor.style.setProperty('anchor-name', ANCHOR_NAME)
    // Default below the anchor, left edges aligned; flip above if no room.
    el.style.setProperty('position-anchor', ANCHOR_NAME)
    el.style.setProperty('position-area', 'bottom span-right')
    el.style.setProperty('justify-self', 'start')
    el.style.setProperty('margin-top', `${GAP}px`)
    el.style.setProperty('position-try-fallbacks', 'flip-block')
  }
  else {
    // Overlay not present — center in the viewport as a fallback.
    Object.assign(el.style, {
      top: '50%',
      left: '50%',
      translate: '-50% -50%',
    })
  }
}

/** Restore the overlay's previous `anchor-name`. Safe to call when not anchored. */
export function detachAnchored(): void {
  if (!active)
    return
  if (active.prevAnchorName)
    active.el.style.setProperty('anchor-name', active.prevAnchorName)
  else
    active.el.style.removeProperty('anchor-name')
  active = undefined
}
