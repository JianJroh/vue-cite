import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/client/entry',
    'src/client/vite-devtools',
  ],
  declaration: 'node16',
  clean: true,
  externals: [
    // keep all vite-plugin-vue-tracer sub-paths as runtime imports
    /^vite-plugin-vue-tracer(\/|$)/,
    // @vitejs/devtools-kit is only referenced for types — keep it as external
    /^@vitejs\/devtools-kit(\/|$)/,
    'vite',
    'vue',
  ],
  hooks: {
    'rollup:dts:options': (ctx, options) => {
      options.plugins = options.plugins.filter(i => i?.name !== 'commonjs')
    },
  },
})
