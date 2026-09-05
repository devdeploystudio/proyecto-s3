import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";

const proyectos = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/proyectos" }),
  schema: ({ image }) =>
    z.object({
      orden: z.number(),
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
      orden: z.number(),
      nombre: z.string(),
      tipo: z.string(),
      medidas: z.string(),
      precio: z.number().nullable().optional(),
      // Cada foto puede llevar un color asociado (uno de los nombres en
      // coloresObjeto): esa es la muestra real de la pieza en ese color, y
      // habilita el círculo correspondiente en la ficha del producto.
      foto: z.array(
        z.object({
          imagen: image(),
          color: z.string().optional(),
        })
      ),
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
    // Nombre y color del círculo. La foto real de cada pieza en ese color
    // vive en la propia pieza (objeto-piezas/*.yaml → foto[].color).
    coloresObjeto: z.array(
      z.object({
        nombre: z.string(),
        swatch: z.string(),
      })
    ),
  }),
});

export const collections = { proyectos, objetoPiezas, equipo, config };
