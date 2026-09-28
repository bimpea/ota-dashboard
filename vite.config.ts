import { defineConfig } from 'vite';

// Optional user config — merged ON TOP of Kyber's base config via Vite's
// mergeConfig(), so list-valued fields (plugins, resolve.alias,
// optimizeDeps.include) are concatenated, not replaced.
//
// Examples:
//   import svgr from 'vite-plugin-svgr';
//   import mdx  from '@mdx-js/rollup';
//
//   export default defineConfig({
//     plugins: [svgr(), mdx()],
//     resolve: { alias: { '@data': '/src/data' } },
//     define:  { __FLAGS__: JSON.stringify({ newFeature: true }) },
//     server:  { proxy: { '/graphql': 'https://api.example.com' } },
//
//     // SCSS support — run `bun add -d sass` then uncomment:
//     css: {
//       preprocessorOptions: {
//         scss: {
//           // additionalData: '@use "src/tokens" as *;',
//         },
//       },
//     },
//   });
//
// Kyber-owned settings (base, root, configFile, server.port, proxy to
// Sandcastle APIs) cannot be overridden here and will log a warning if set.

export default defineConfig({});
