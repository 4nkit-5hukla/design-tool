import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import envCompatible from "vite-plugin-env-compatible";
import mkcert from "vite-plugin-mkcert";
import react from "@vitejs/plugin-react";
import terser from "@rollup/plugin-terser";
import viteTsconfigPaths from "vite-tsconfig-paths";

type ViteConfigInput = {
  mode: string;
  command: string;
};

const ignoreWarnCodes = [
  "CIRCULAR_DEPENDENCY",
  "CYCLIC_CROSS_CHUNK_REEXPORT",
  "EVAL",
  "MODULE_LEVEL_DIRECTIVE",
];

// https://vite.dev/config/
export default (args: ViteConfigInput) => {
  const generateScopedName =
    args.mode === "production"
      ? "prod_[hash:base64:4]"
      : "[local]_[hash:base64:4]";

  return defineConfig({
    plugins: [
      react({ include: "**/*.tsx" }),
      nodePolyfills(),
      viteTsconfigPaths(),
      envCompatible(),
      ...(args.mode !== "production" ? [mkcert()] : []),
    ],
    // todo: resolve.alias not working properly still getting Cannot find module 'Contexts' or its corresponding type declarations
    resolve: {
      alias: {
        Apis: "/src/Apis",
        Assets: "/src/Assets",
        Components: "/src/Components",
        Configs: "/src/Configs",
        Contexts: "/src/Contexts",
        Hooks: "/src/Hooks",
        Interfaces: "/src/Interfaces",
        Layout: "/src/Layout",
        Outlets: "/src/Outlets",
        Pages: "/src/Pages",
        Routes: "/src/Routes",
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: "globalThis",
        },
      },
    },
    esbuild: {
      target: "es2015", // Ensure compatibility with older iOS versions
    },
    build: {
      outDir: "build",
      chunkSizeWarningLimit: 5000,
      target: ["es2015", "safari11"], // Add iOS Safari compatibility
      polyfillModulePreload: true,
      cssTarget: "safari11",
      rollupOptions: {
        onwarn(warning, warn) {
          if (
            warning.code !== undefined &&
            ignoreWarnCodes.includes(warning.code)
          )
            return;
          warn(warning);
        },
        output: {
          assetFileNames: (assetInfo) => {
            let extType=  assetInfo.names.at(0)?.split(".").at(1) || "generic";
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType))
              extType = "img";
            return `assets/${extType}/[name]-[hash][extname]`;
          },
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
        },
        plugins: [
          terser({
            compress: {
              drop_console: true, // Remove console.log statements
            },
          }),
        ],
      },
    },
    envPrefix: "REACT_APP_",
    server: {
      open: false,
      port: 5000,
      hmr: true,
    },
    css: {
      modules: {
        generateScopedName: generateScopedName,
        hashPrefix: "prefix",
      },
    },
  });
};
