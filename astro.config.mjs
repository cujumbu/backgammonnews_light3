import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from "@astrojs/react";
import node from "@astrojs/node";

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: "standalone"
  }),
  integrations: [tailwind(), react()],
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 10000
  },
  vite: {
    ssr: {
      noExternal: ['cheerio', 'parse5', 'parse5-htmlparser2-tree-adapter']
    },
    optimizeDeps: {
      exclude: ['node:https']
    }
  }
});
