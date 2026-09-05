// Piezas y textos de Objeto ahora viven como contenido editable
// (src/content/objeto-piezas/*.yaml y el bloque textoObjeto de
// src/content/config/site.yaml, editables desde /admin). Wrapper delgado:
// misma forma que antes para no tocar los consumidores existentes.
import { getCollection, getEntry } from "astro:content";

export type Color = {
  nombre: string;
  swatch: string;
};

export type FotoPieza = {
  imagen: ImageMetadata;
  color?: string;
};

export type Pieza = {
  slug: string;
  orden: number;
  nombre: string;
  tipo: string;
  medidas: string;
  precio?: number | null;
  foto: FotoPieza[];
};

const config = await getEntry("config", "site");

// Paleta de cerámicas disponibles para personalizar cada pieza.
// Los valores son una referencia visual de la cerámica, no un color plano.
export const COLORES: Color[] = config!.data.coloresObjeto;

export const TEXTO_OBJETO: string[] = config!.data.textoObjeto;

const entradas = await getCollection("objetoPiezas");

export const PIEZAS: Pieza[] = entradas
  .map((entrada) => ({ slug: entrada.id, ...entrada.data }))
  .sort((a, b) => a.orden - b.orden);
