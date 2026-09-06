import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";

// El panel (Sveltia) guarda un campo opcional vacío como "" (string vacío),
// no como ausente — y "" no es una imagen/número válido, así que romper la
// validación entera del build. Estos helpers convierten "" a "ausente"
// ANTES de validar, para cualquier campo opcional (imagen, texto o
// número), así dejar algo en blanco en el panel nunca puede tirar abajo
// el sitio entero.
const sinVacios = <T extends z.ZodType>(schema: T) =>
  z.preprocess((val) => (val === "" ? undefined : val), schema.optional());

const optionalImage = (image: () => z.ZodType) => sinVacios(image());

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
      tarjeta: optionalImage(image),
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
      precio: sinVacios(z.number().nullable()),
      // Cada foto puede llevar un color asociado (uno de los nombres en
      // coloresObjeto): esa es la muestra real de la pieza en ese color, y
      // habilita el círculo correspondiente en la ficha del producto.
      foto: z.array(
        z.object({
          imagen: image(),
          color: sinVacios(z.string()),
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
      foto: optionalImage(image),
    }),
});

const config = defineCollection({
  loader: file("./src/content/config/site.yaml"),
  schema: z.object({
    id: z.string(),
    instagramEstudio: z.string(),
    instagramObjeto: z.string(),
    // El panel lo marca como no-obligatorio, así que el schema tiene que
    // aceptar que quede vacío (el wrapper en site.ts ya maneja el caso).
    whatsappNumero: sinVacios(z.string()),
    email: z.string(),
  }),
});

// Textos de la home (hero + los dos teaser de "El estudio"/"Objeto").
const configInicio = defineCollection({
  loader: file("./src/content/config/inicio.yaml"),
  schema: z.object({
    id: z.string(),
    heroEyebrow: z.string(),
    heroTitulo: z.string(),
    teaserTitulo: z.string(),
    teaserTexto: z.string(),
    objetoTitulo: z.string(),
    objetoTexto: z.string(),
  }),
});

// Textos de la página de Contacto.
const configContacto = defineCollection({
  loader: file("./src/content/config/contacto.yaml"),
  schema: z.object({
    id: z.string(),
    titulo: z.string(),
    lead: z.string(),
  }),
});

// Texto de la página "Estudio" — colección aparte (no dentro de `equipo`)
// porque es un bloque único compartido, no algo por persona; queda
// nombrada igual que `equipo` en el panel para que se vean agrupadas.
const configEstudio = defineCollection({
  loader: file("./src/content/config/estudio.yaml"),
  schema: z.object({
    id: z.string(),
    textoNosotros: z.array(z.string()),
  }),
});

// Ídem para "Objeto": texto de intro + paleta de colores (compartidos por
// todas las piezas), separado de `objetoPiezas` por la misma razón.
const configObjeto = defineCollection({
  loader: file("./src/content/config/objeto.yaml"),
  schema: z.object({
    id: z.string(),
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

export const collections = {
  proyectos,
  objetoPiezas,
  equipo,
  config,
  configEstudio,
  configObjeto,
  configInicio,
  configContacto,
};
