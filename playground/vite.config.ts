import { fileURLToPath } from 'node:url'
import { DevTools } from '@vitejs/devtools'
import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import VueTracer from 'vite-plugin-vue-tracer'
import VueCite from '../src'

const r = (filepath: string): string => fileURLToPath(new URL(filepath, import.meta.url))

export default defineConfig({
  plugins: [
    Vue(),
    DevTools(),
    VueTracer(),
    VueCite({
      viteDevtools: true,
    }),
  ],
  resolve: {
    alias: {
      'vite-plugin-vue-cite/client/vite-devtools': r('../src/client/vite-devtools.ts'),
      'vite-plugin-vue-cite/client': r('../src/client/entry.ts'),
    },
  },
})
