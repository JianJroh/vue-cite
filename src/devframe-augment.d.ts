import type { CiteSharedState } from './types'

/**
 * Type-only registration of our shared-state key into devframe's
 * `DevToolsRpcSharedStates` registry, so `ctx.rpc.sharedState.get` is fully
 * typed on both the plugin (node) and dock-script (client) sides.
 *
 * Deliberately NOT imported by any module: vue-tsc picks it up via tsconfig
 * include, while unbuild's dts bundling (which starts from entry imports)
 * never sees it — published types stay free of the `devframe/types`
 * augmentation, so consumers don't need devframe resolvable.
 *
 * `devframe` is a type-only devDependency, version-locked in the pnpm
 * catalog to the exact version `@vitejs/devtools-kit` pins, so both resolve
 * to the same instance — augmentation only merges on a single instance. If
 * the versions ever drift apart, typecheck fails loudly at the `get` call
 * sites.
 */
declare module 'devframe/types' {
  interface DevToolsRpcSharedStates {
    'vue-cite:state': CiteSharedState
  }
}
