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
      // Color libre (hex, widget "color" en el panel), no un enum cerrado -
      // ver ProyectoCard.astro/[slug].astro para cómo se aplica como
      // variable CSS inline.
      acento: z.string(),
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
      // Por default las fotos de personas se muestran en blanco y negro
      // (filtro CSS, ver estudio.astro). Tildar esto muestra esa foto
      // puntual en color, sin tocar el filtro de las demás.
      colorOriginal: z.boolean().default(false),
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

// La home tenía un solo "inicio.yaml" con 4 bloques visuales bien
// distintos mezclados en una sola pantalla del panel (portada, el teaser de
// "El estudio", el teaser de "Objeto" y la imagen del bloque final). Ahora
// cada bloque es su propio archivo/colección, uno por unidad visual que el
// visitante ve separada al scrollear la home - así editar el título de la
// portada nunca mezcla en la misma pantalla el teaser de Objeto ni el resto.
// Los cubos flotantes decorativos NO están en ninguna: son elementos de
// marca/diseño, no contenido del cliente.

const configInicioPortada = defineCollection({
  loader: file("./src/content/config/inicio-portada.yaml"),
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      heroImagen: image(),
      heroEyebrow: z.string(),
      heroTitulo: z.string(),
      // Independiente de textoNosotros[0] de "Estudio" a propósito: antes
      // compartían el mismo texto, pero se pidió poder editarlos por
      // separado aunque arranquen diciendo lo mismo.
      heroLead: z.string(),
      heroCtaProyectosTexto: z.string(),
      heroCtaEstudioTexto: z.string(),
    }),
});

const configInicioEstudio = defineCollection({
  loader: file("./src/content/config/inicio-estudio.yaml"),
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      // Independiente de la foto de "Estudio → Texto" a propósito: arranca
      // siendo la misma, pero se pidió poder cambiarla acá sin afectar la
      // otra página.
      teaserFoto: image(),
      teaserFotoColorOriginal: z.boolean().default(false),
      teaserEyebrow: z.string(),
      teaserTitulo: z.string(),
      teaserTexto: z.string(),
      teaserBotonTexto: z.string(),
    }),
});

// Bloque "Proyectos" de la home (el carrusel): solo sus textos. Los
// proyectos del carrusel salen de la colección `proyectos`.
const configInicioProyectos = defineCollection({
  loader: file("./src/content/config/inicio-proyectos.yaml"),
  schema: z.object({
    id: z.string(),
    proyectosEyebrow: z.string(),
    proyectosTitulo: z.string(),
    proyectosBotonTexto: z.string(),
  }),
});

const configInicioObjeto = defineCollection({
  loader: file("./src/content/config/inicio-objeto.yaml"),
  schema: z.object({
    id: z.string(),
    objetoEyebrow: z.string(),
    objetoTitulo: z.string(),
    objetoTexto: z.string(),
    objetoBotonTexto: z.string(),
  }),
});

const configInicioFinal = defineCollection({
  loader: file("./src/content/config/inicio-final.yaml"),
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      ctaImagen: image(),
      ctaTitulo: z.string(),
      ctaTexto: z.string(),
      ctaBotonTexto: z.string(),
    }),
});

// Textos e imagen de la página de Contacto.
const configContacto = defineCollection({
  loader: file("./src/content/config/contacto.yaml"),
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      eyebrow: z.string(),
      titulo: z.string(),
      lead: z.string(),
      whatsappTexto: z.string(),
      instagramTexto: z.string(),
      objetoPregunta: z.string(),
      objetoBotonTexto: z.string(),
      imagen: image(),
    }),
});

// Texto/fotos de la página "Estudio" — colección aparte (no dentro de
// `equipo`) porque son bloques únicos compartidos, no algo por persona;
// queda nombrada igual que `equipo` en el panel para que se vean
// agrupadas. `foto` es la foto grupal del equipo (se reusa también como
// teaser en la home).
const configEstudio = defineCollection({
  loader: file("./src/content/config/estudio.yaml"),
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      foto: image(),
      // Ídem que en `equipo`: por default se muestra en blanco y negro,
      // tildar para verla en color.
      colorOriginal: z.boolean().default(false),
      eyebrow: z.string(),
      titulo: z.string(),
      textoNosotros: z.array(z.string()),
      // Títulos de la sección "El equipo" (la grilla de personas) y texto
      // que se muestra si una persona no tiene foto cargada.
      equipoEyebrow: z.string(),
      equipoTitulo: z.string(),
      fotoVacia: z.string(),
    }),
});

// Bloque final de la página "Estudio" ("Seguinos en Instagram") - archivo
// aparte, mismo patrón que "Inicio → Bloque final".
const configEstudioFinal = defineCollection({
  loader: file("./src/content/config/estudio-final.yaml"),
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      ctaImagen: image(),
      ctaTitulo: z.string(),
      ctaTexto: z.string(),
      ctaBotonTexto: z.string(),
    }),
});

// Ídem para "Objeto": texto de intro + paleta de colores (compartidos por
// todas las piezas), separado de `objetoPiezas` por la misma razón.
const configObjeto = defineCollection({
  loader: file("./src/content/config/objeto.yaml"),
  schema: z.object({
    id: z.string(),
    heroEyebrow: z.string(),
    heroTitulo: z.string(),
    textoObjeto: z.array(z.string()),
    instagramTexto: z.string(),
    notaEncargo: z.string(),
    // Textos que se repiten en cada ficha de pieza.
    tarjetaNota: z.string(),
    tarjetaColoresTitulo: z.string(),
    // Nombre y color del círculo. La foto real de cada pieza en ese color
    // vive en la propia pieza (objeto-piezas/*.yaml → foto[].color).
    coloresObjeto: z.array(
      z.object({
        nombre: z.string(),
        swatch: z.string(),
      })
    ),
    tarjetaBotonTexto: z.string(),
    proximamenteTexto: z.string(),
    // Frase corta debajo de "Objeto" en el footer.
    footerTagline: z.string(),
  }),
});

// Textos fijos de las páginas de Proyectos: el listado, las tarjetas y la
// página individual de cada proyecto (los mismos para todos los proyectos).
const configProyectosTextos = defineCollection({
  loader: file("./src/content/config/proyectos-textos.yaml"),
  schema: z.object({
    id: z.string(),
    listadoEyebrow: z.string(),
    listadoTitulo: z.string(),
    listadoLead: z.string(),
    tarjetaBotonTexto: z.string(),
    volverTexto: z.string(),
    presentacionBotonTexto: z.string(),
    conceptoTitulo: z.string(),
    ctaTitulo: z.string(),
    ctaBotonTexto: z.string(),
  }),
});

// Textos del menú superior (Header). El footer NO es editable a propósito.
const configMenu = defineCollection({
  loader: file("./src/content/config/menu.yaml"),
  schema: z.object({
    id: z.string(),
    inicio: z.string(),
    estudio: z.string(),
    proyectos: z.string(),
    contacto: z.string(),
    botonObjeto: z.string(),
    objetoPiezas: z.string(),
    botonProyecto: z.string(),
  }),
});

const configError404 = defineCollection({
  loader: file("./src/content/config/error-404.yaml"),
  schema: z.object({
    id: z.string(),
    eyebrow: z.string(),
    titulo: z.string(),
    texto: z.string(),
    botonTexto: z.string(),
  }),
});

export const collections = {
  proyectos,
  objetoPiezas,
  equipo,
  config,
  configEstudio,
  configEstudioFinal,
  configObjeto,
  configInicioPortada,
  configInicioEstudio,
  configInicioProyectos,
  configInicioObjeto,
  configInicioFinal,
  configContacto,
  configProyectosTextos,
  configMenu,
  configError404,
};
