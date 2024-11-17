import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from "@astrojs/node";

// Get port from environment variable or default to 10000
const PORT = process.env.PORT || 10000;

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: "standalone"
  }),
  server: {
    port: PORT,
    host: '0.0.0.0'
  },
  integrations: [tailwind()]
});
