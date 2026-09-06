// El equipo y el texto de "El estudio" ahora viven como contenido editable
// (src/content/equipo/*.yaml y src/content/config/estudio.yaml, editables
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
};

const configEstudio = await getEntry("configEstudio", "estudio");

export const TEXTO_NOSOTROS: string[] = configEstudio!.data.textoNosotros;

// Foto grupal del equipo (se reusa como teaser en la home) y fondo del CTA
// final de la página "Estudio".
export const FOTO_EQUIPO: ImageMetadata = configEstudio!.data.foto;
export const ESTUDIO_CTA_IMAGEN: ImageMetadata = configEstudio!.data.ctaImagen;

const entradas = await getCollection("equipo");

export const EQUIPO: Persona[] = entradas
  .map((entrada) => ({ slug: entrada.id, ...entrada.data }))
  .sort((a, b) => a.orden - b.orden);
