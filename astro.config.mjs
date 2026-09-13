// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Dominio final: proyecto-s3.com.ar. Deploy vía Cloudflare Pages (conectado
  // directo al repo), se sirve desde la raíz, sin subcarpeta de base.
  // El sitemap se genera a mano en src/pages/sitemap.xml.ts (en vez de
  // @astrojs/sitemap) para que quede servido justo en /sitemap.xml, la ruta
  // que buscan las herramientas de chequeo de SEO.
  site: 'https://proyecto-s3.com.ar',
});
