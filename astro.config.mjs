import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from "@astrojs/node";
import react from "@astrojs/react";

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
  site: 'https://backgammon-news.onrender.com',
  vite: {
    ssr: {
      noExternal: ['cheerio', 'parse5', 'parse5-htmlparser2-tree-adapter']
    },
    optimizeDeps: {
      exclude: ['node:https']
    }
  }
});
