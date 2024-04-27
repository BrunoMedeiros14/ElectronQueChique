import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import path from 'path';
import type { ConfigEnv, UserConfig } from 'vite';
import { defineConfig } from 'vite';
import { pluginExposeRenderer } from './vite.base.config';

// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<'renderer'>;
  const { root, mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf.name ?? '';

  return {
    root,
    mode,
    base: './',
    build: {
      outDir: `.vite/renderer/${name}`,
    },
    plugins: [pluginExposeRenderer(name), TanStackRouterVite()],
    resolve: {
      alias: {
        "@/ui": path.resolve(__dirname, "/src/ui"),
        "@/components": path.resolve(__dirname, "/src/ui/components"),
        "@/lib": path.resolve(__dirname, "/src/ui/components/lib")
        // "@pages": path.resolve(__dirname, "./src/pages"),
        // "@forms": path.resolve(__dirname, "./src/forms"),
        // "@utils": path.resolve(__dirname, "./src/utils"),
        // "@providers": path.resolve(__dirname, "./src/providers"),
        // "@assets": path.resolve(__dirname, "./src/assets"),
      },
      preserveSymlinks: true,
    },
    clearScreen: false,
  } as UserConfig;
});
