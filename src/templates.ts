import type { TemplateEntry } from './types'

export const plainTemplate: TemplateEntry = {
  name: 'Plain',
  template: '{{message}} {{sourceLink}}',
}

export const compactTemplate: TemplateEntry = {
  name: 'Compact',
  template: '{{message}} `{{snippet}}` in {{sourceLink}} at `{{pathname}}`',
}

export const detailedTemplate: TemplateEntry = {
  name: 'Detailed',
  template: '{{message}}\n{{sourceLink}}\n- **Element**: `{{snippet}}`\n- **Route**: `{{pathname}}`\n- **Parent**: {{parentLink}}',
}

export const builtinTemplates: TemplateEntry[] = [
  plainTemplate,
  compactTemplate,
  detailedTemplate,
]
