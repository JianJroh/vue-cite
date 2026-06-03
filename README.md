# <img src="https://raw.githubusercontent.com/JianJroh/vue-cite/main/assets/logo.svg" alt="Vue Cite logo" width="64" height="64" align="center"> Vue Cite

> **Cite-to-copy for any Vue element.**

[![npm version](https://img.shields.io/npm/v/vite-plugin-vue-cite?color=42b883&label=npm)](https://www.npmjs.com/package/vite-plugin-vue-cite)

Click any Vue element, add a note, and copy a Markdown citation with a
source link. Great for design reviews, bug reports, and AI prompts.

<p align="center">
  <img src="https://raw.githubusercontent.com/JianJroh/vue-cite/main/assets/screenshots/image.png" alt="Vue Cite in action — click an element, add a note, copy as Markdown citation" width="820">
</p>

## 📦 Install

```bash
pnpm add -D vite-plugin-vue-cite vite-plugin-vue-tracer
```

[`vite-plugin-vue-tracer`](https://github.com/antfu/vite-plugin-vue-tracer) is a required peer dependency. Vue Cite uses it to
resolve the clicked element back to its source file and line.

## 🚀 Usage

### Vite DevTools dock (recommended)

Register Vue Cite as a Vite DevTools dock entry. This keeps the dev UI out of
your viewport and groups Vue Cite next to your other DevTools panels.

Requires Vite 8+ and the `@vitejs/devtools` package:

```bash
pnpm add -D @vitejs/devtools
```

> See the [Vite DevTools installation guide](https://devtools.vite.dev/guide/#installation) for details.

```ts
// vite.config.ts
import { DevTools } from '@vitejs/devtools'
import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import VueCite from 'vite-plugin-vue-cite'
import VueTracer from 'vite-plugin-vue-tracer'

export default defineConfig({
  plugins: [
    Vue(),
    DevTools(),
    VueTracer(),
    VueCite({ viteDevtools: true }),
  ],
})
```

Open the Vite DevTools dock and click the **Vue Cite** entry to arm cite mode.

### Standalone launcher

Without `viteDevtools`, Vue Cite mounts a floating launcher button on the page.
Use this if you are not on Vite 8 yet or prefer not to install the DevTools
package.

```ts
// vite.config.ts
import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import VueCite from 'vite-plugin-vue-cite'
import VueTracer from 'vite-plugin-vue-tracer'

export default defineConfig({
  plugins: [
    Vue(),
    VueTracer(),
    VueCite(),
  ],
})
```

Try the **Standalone launcher** live:

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/edit/vue-cite-demo?file=vite.config.ts)

## ⚙️ Options

### `VueCiteOptions`

| Option         | Type                            | Default | Description                                                                     |
| -------------- | ------------------------------- | ------- | ------------------------------------------------------------------------------- |
| `enabled`      | `boolean \| 'dev' \| 'prod'`    | `'dev'` | When to mount the launcher and inject the client.                               |
| `templates`    | `TemplateEntry[]`               | builtin | Templates the user can cycle through in the popup. First entry is the default.  |
| `viteDevtools` | `boolean`                       | `false` | Register a Vite DevTools dock entry instead of the floating launcher button (recommended). Requires Vite 8+ and the [Vite DevTools package](https://devtools.vite.dev/guide/#installation). |


## 🔧 Advanced

### Enabling in production builds

> [!WARNING]
> For staging or preview environments only. These flags ship devtools hooks,
> source positions, and sourcemaps to your bundle, exposing source paths and
> adding size and runtime overhead. Do not enable this in real production
> unless you know what you are doing.

```ts
// vite.config.ts
import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import VueCite from 'vite-plugin-vue-cite'
import VueTracer from 'vite-plugin-vue-tracer'

export default defineConfig({
  plugins: [
    Vue({
      features: { prodDevtools: true },
    }),
    VueTracer({ enabled: true }),
    VueCite({ enabled: true }),
  ],
  build: {
    sourcemap: true,
  },
})
```

## ❤️ Credits

Built on top of [`vite-plugin-vue-tracer`](https://github.com/antfu/vite-plugin-vue-tracer)
by [@antfu](https://github.com/antfu). It maps every rendered vnode back to its
source file and line, which is what makes citing anything possible.

## 📄 License

[MIT](./LICENSE) License © 2026 [JianJroh](https://github.com/JianJroh)