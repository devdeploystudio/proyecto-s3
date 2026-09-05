// El equipo y el texto de "El estudio" ahora viven como contenido editable
// (src/content/equipo/*.yaml y el bloque textoNosotros de
// src/content/config/site.yaml, editables desde /admin). Wrapper delgado:
// misma forma que antes para no tocar los consumidores existentes.
import { getCollection, getEntry } from "astro:content";

export type Persona = {
  slug: string;
  orden: number;
  nombre: string;
  rol: string;
  bio: string;
  foto?: ImageMetadata;
};

const config = await getEntry("config", "site");

export const TEXTO_NOSOTROS: string[] = config!.data.textoNosotros;

const entradas = await getCollection("equipo");

export const EQUIPO: Persona[] = entradas
  .map((entrada) => ({ slug: entrada.id, ...entrada.data }))
  .sort((a, b) => a.orden - b.orden);
