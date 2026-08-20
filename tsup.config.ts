import { defineConfig } from 'tsup';
import { solidPlugin } from 'esbuild-plugin-solid';

// Rewrite the shared TweakStore import to the `tweakers/store` package subpath so
// framework-neutral bundles reference the single shared store instead of
// inlining a second, desynced copy.
const externalizeTweakStore = {
  name: 'externalize-tweakstore',
  setup(build: { onResolve: (o: { filter: RegExp }, cb: () => { path: string; external: boolean }) => void }) {
    build.onResolve({ filter: /store\/TweakStore$/ }, () => ({
      path: 'tweakers/store',
      external: true,
    }));
  },
};

export default defineConfig([
  // Store build (shared across all framework entries)
  {
    entry: { index: 'src/store/TweakStore.ts' },
    outDir: 'dist/store',
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    sourcemap: true,
  },
  // Framework-neutral timeline runtime, consumed via the `tweakers/timeline`
  // subpath. Externalizes the shared store; bundles the timeline-only modules.
  {
    entry: { index: 'src/timeline/index.ts' },
    outDir: 'dist/timeline',
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    sourcemap: true,
    esbuildPlugins: [externalizeTweakStore],
  },
  // React build
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    sourcemap: true,
    external: ['react', 'react-dom', 'motion'],
    esbuildOptions(options) {
      options.banner = {
        js: '"use client";',
      };
    },
    onSuccess: 'cp src/styles/theme.css dist/styles.css',
  },
  // Solid build
  {
    entry: { index: 'src/solid/index.ts' },
    outDir: 'dist/solid',
    format: ['esm', 'cjs'],
    dts: {
      compilerOptions: {
        jsx: 'preserve',
        jsxImportSource: 'solid-js',
      },
    },
    splitting: false,
    sourcemap: true,
    external: ['solid-js', 'solid-js/web', 'motion'],
    tsconfig: 'tsconfig.solid.json',
    esbuildPlugins: [solidPlugin()],
  },
  // Vue build
  {
    entry: { index: 'src/vue/index.ts' },
    outDir: 'dist/vue',
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    sourcemap: true,
    external: ['vue', 'motion-v'],
    tsconfig: 'tsconfig.vue.json',
  },
  // Shared leaf modules emitted to dist root. The packaged Svelte components keep
  // their `../../icons` / `../../shortcut-utils` import specifiers (svelte-package
  // does not reach outside src/svelte), so those files must exist at dist root.
  // React/Solid/Vue bundle them inline, so this standalone emission is for Svelte.
  // shortcut-utils references the TweakStore singleton — externalize it to the shared
  // dist/store rather than inlining a second, desynced store instance.
  //
  // THIS LIST MUST COVER EVERY `../../x` SPECIFIER IN src/svelte. It does not
  // update itself, and a missing entry fails only in a downstream consumer that
  // bundles tweakers/svelte — never in this repo's own build or example app. Any
  // new leaf module a Svelte component imports has to be added here in the same
  // change, or that consumer's build breaks with "Could not resolve ../../x".
  {
    entry: {
      icons: 'src/icons.ts',
      'shortcut-utils': 'src/shortcut-utils.ts',
      'waveform-engine': 'src/waveform-engine.ts',
      'analyser-engine': 'src/analyser-engine.ts',
      'curve-composer-core': 'src/curve-composer-core.ts',
      'range-slider-core': 'src/range-slider-core.ts',
      'color-core': 'src/color-core.ts',
      'color-palette-store': 'src/color-palette-store.ts',
      'gradient-core': 'src/gradient-core.ts',
      'xy-pad-core': 'src/xy-pad-core.ts',
      'affordance-core': 'src/affordance-core.ts',
    },
    outDir: 'dist',
    format: ['esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    esbuildPlugins: [
      {
        name: 'externalize-tweakstore',
        setup(build) {
          build.onResolve({ filter: /store\/TweakStore$/ }, () => ({
            path: 'tweakers/store',
            external: true,
          }));
        },
      },
    ],
  },
]);
