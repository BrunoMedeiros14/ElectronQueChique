import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import path from 'path'
import type { ConfigEnv, UserConfig } from 'vite'
import { defineConfig } from 'vite'
import { pluginExposeRenderer } from './vite.base.config'

export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<'renderer'>
  const { root, mode, forgeConfigSelf } = forgeEnv
  const name = forgeConfigSelf.name ?? ''

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
        '@': path.resolve(__dirname, '../src'),
      },
      preserveSymlinks: true,
    },
    clearScreen: false,
  } as UserConfig
})
