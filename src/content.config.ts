import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";

const proyectos = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/proyectos" }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      tipo: z.string(),
      acento: z.enum(["terracota", "bordo", "sage"]),
      resumen: z.string(),
      concepto: z.string(),
      cover: image(),
      // Miniatura opcional para las cards/carrusel cuando difiere de `cover`
      // (por ej. una carátula de presentación con rótulo, que no debe usarse
      // como imagen de concepto dentro de la página del proyecto).
      tarjeta: image().optional(),
      galeria: z.array(image()),
      presentacion: z.string(),
    }),
});

const objetoPiezas = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/objeto-piezas" }),
  schema: ({ image }) =>
    z.object({
      nombre: z.string(),
      tipo: z.string(),
      medidas: z.string(),
      precio: z.number().nullable(),
      foto: z.array(image()),
    }),
});

const equipo = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/equipo" }),
  schema: ({ image }) =>
    z.object({
      nombre: z.string(),
      rol: z.string(),
      bio: z.string(),
      orden: z.number(),
      foto: image().optional(),
    }),
});

const config = defineCollection({
  loader: file("./src/content/config/site.yaml"),
  schema: z.object({
    id: z.string(),
    instagramEstudio: z.string(),
    instagramObjeto: z.string(),
    whatsappNumero: z.string(),
    textoNosotros: z.array(z.string()),
    textoObjeto: z.array(z.string()),
    coloresObjeto: z.array(
      z.object({
        nombre: z.string(),
        swatch: z.string(),
      })
    ),
  }),
});

export const collections = { proyectos, objetoPiezas, equipo, config };
