// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Deploy de preview en GitHub Pages (devdeploystudio/proyecto-s3).
  // Actualizar site/base cuando el dominio final esté definido.
  site: 'https://devdeploystudio.github.io',
  base: '/proyecto-s3',
});
