let stop: (() => void) | undefined

/**
 * Dismiss the popup on Escape or a pointer-down outside `host`. Registers
 * document-level listeners and remembers how to remove them — call
 * `stopDismiss()` to tear them down.
 */
export function watchDismiss(host: HTMLElement, onDismiss: () => void): void {
  const onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape')
      onDismiss()
  }
  const onPointer = (e: MouseEvent): void => {
    if (!e.composedPath().includes(host))
      onDismiss()
  }
  document.addEventListener('keydown', onKey)
  document.addEventListener('mousedown', onPointer, { capture: true })
  stop = () => {
    document.removeEventListener('keydown', onKey)
    document.removeEventListener('mousedown', onPointer, { capture: true })
  }
}

/** Remove the dismiss listeners. Safe to call when not watching. */
export function stopDismiss(): void {
  stop?.()
  stop = undefined
}
