import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Layouts from "vite-plugin-vue-layouts";
import Pages from "vite-plugin-pages";

// https://vitejs.dev/config/
const defaultConfig = {
  plugins: [
    vue(),
    Pages({
      routeStyle: "nuxt",
    }),
    Layouts(),
    Components({}),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      imports: ["vue", "vue-router"],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
}

export default defineConfig(({ command, mode }) => {
  if(command === 'serve') {
    const isDev = mode === 'development'

    return {
      ...defaultConfig,
      // server: {
      //   proxy: {
      //     '/api': {
      //       target: isDev ? 'http://localhost:3000' : 'https://api-task.cyclic.app',
      //       changeOrigin: isDev,
      //       secure: false
      //     }
      //   }
      // }
    }
  } else {
    return defaultConfig
  }
})
