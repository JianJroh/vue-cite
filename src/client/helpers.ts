import type { ElementTraceInfo } from 'vite-plugin-vue-tracer/client/listeners'
import type { TemplateContext, TemplateEntry } from '../types'

function tagName(vnode: any): string {
  if (!vnode?.type)
    return ''
  if (typeof vnode.type === 'string')
    return vnode.type
  return vnode.type.name ?? vnode.type.__name ?? ''
}

function label(info: ElementTraceInfo): string {
  return tagName(info.vnode) || (info.filepath.split('/').pop() || info.filepath)
}

function sourceUrl(info: ElementTraceInfo): string {
  const url = `${info.filepath}#L${info.pos[1]}C${info.pos[2]}`
  // Encode reserved chars and square brackets so markdown link parses cleanly
  return encodeURI(url).replace(/\[/g, '%5B').replace(/\]/g, '%5D')
}

function sourceLink(info: ElementTraceInfo): string {
  return `[${label(info)}](${sourceUrl(info)})`
}

function openTagSnippet(el: Element | undefined): string {
  const outer = el?.outerHTML
  if (!outer)
    return ''
  const match = outer.match(/^<[^>]*>/)
  if (!match)
    return ''
  let tag = match[0]
  // Drop scoped-style data-v-* attrs and truncate attribute values longer than 40 chars
  tag = tag.replace(/\s+data-v-[a-f0-9]+(?:="[^"]*")?/gi, '')
  tag = tag.replace(/(=")([^"]+)(")/g, (_, eq, val, q) =>
    val.length > 40 ? `${eq}${val.slice(0, 40)}…${q}` : `${eq}${val}${q}`)
  return tag
}

function buildContext(info: ElementTraceInfo, message: string): TemplateContext {
  const parent = info.getParent()
  return {
    message,
    sourceLink: sourceLink(info),
    parentLink: parent ? sourceLink(parent) : '',
    snippet: openTagSnippet(info.el),
    pathname: window.location.pathname,
  }
}

function interpolate(template: string, ctx: TemplateContext): string {
  const bag = ctx as unknown as Record<string, string | undefined>
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => bag[key] ?? '')
}

export function renderEntry(entry: TemplateEntry, info: ElementTraceInfo, message: string): string {
  return interpolate(entry.template, buildContext(info, message))
}
