export function formatRelative(ts: number): string {
  const diff = Date.now() - ts
  const s = Math.max(0, Math.floor(diff / 1000))
  if (s < 60)
    return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60)
    return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24)
    return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7)
    return `${d}d ago`
  return `${Math.floor(d / 7)}w ago`
}

export function formatAbsolute(ts: number): string {
  const d = new Date(ts)
  const pad = (n: number): string => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
