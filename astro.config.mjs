// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Dominio final: proyecto-s3.com.ar. Deploy vía Cloudflare Pages (conectado
  // directo al repo), se sirve desde la raíz, sin subcarpeta de base.
  site: 'https://proyecto-s3.com.ar',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/panel') && !page.includes('/admin'),
    }),
  ],
});
