// El equipo y el texto de "El estudio" ahora viven como contenido editable
// (src/content/equipo/*.yaml y src/content/config/estudio*.yaml, editables
// desde /admin). Wrapper delgado: misma forma que antes para no tocar los
// consumidores existentes.
import { getCollection, getEntry } from "astro:content";

export type Persona = {
  slug: string;
  orden: number;
  nombre: string;
  rol: string;
  bio: string;
  foto?: ImageMetadata;
  colorOriginal: boolean;
};

const configEstudio = await getEntry("configEstudio", "estudio");
const configEstudioFinal = await getEntry("configEstudioFinal", "estudioFinal");

export const TEXTO_ESTUDIO_TITULO: string = configEstudio!.data.titulo;
export const TEXTO_NOSOTROS: string[] = configEstudio!.data.textoNosotros;

// Foto grupal del equipo. Por default se muestra en blanco y negro (filtro
// CSS en estudio.astro) - FOTO_EQUIPO_COLOR controla si esa foto puntual se
// salta el filtro. La foto del teaser de "Inicio" es independiente de esta
// (ver TEXTO_INICIO.teaserFoto en src/data/inicio.ts).
export const FOTO_EQUIPO: ImageMetadata = configEstudio!.data.foto;
export const FOTO_EQUIPO_COLOR: boolean = configEstudio!.data.colorOriginal;

// Bloque final de la página "Estudio" ("Seguinos en Instagram") - archivo
// aparte (config/estudio-final.yaml), no comparte nada con "Inicio → Bloque final".
export const ESTUDIO_CTA_IMAGEN: ImageMetadata = configEstudioFinal!.data.ctaImagen;
export const ESTUDIO_CTA_TITULO: string = configEstudioFinal!.data.ctaTitulo;
export const ESTUDIO_CTA_TEXTO: string = configEstudioFinal!.data.ctaTexto;
export const ESTUDIO_CTA_BOTON_TEXTO: string = configEstudioFinal!.data.ctaBotonTexto;

const entradas = await getCollection("equipo");

export const EQUIPO: Persona[] = entradas
  .map((entrada) => ({ slug: entrada.id, ...entrada.data }))
  .sort((a, b) => a.orden - b.orden);
