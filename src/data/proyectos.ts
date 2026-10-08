// Los proyectos ahora viven como contenido editable en src/content/proyectos/
// (un YAML por proyecto, editable desde el panel /admin). Este archivo es un
// wrapper delgado: expone la misma forma (PROYECTOS: Proyecto[]) que antes,
// para no tener que tocar cada componente/página que ya lo consumía.
import { getCollection, getEntry } from "astro:content";

export type Proyecto = {
  slug: string;
  orden: number;
  titulo: string;
  tipo: string;
  acento: string;
  resumen: string;
  concepto: string;
  cover: ImageMetadata;
  tarjeta?: ImageMetadata;
  galeria: ImageMetadata[];
  presentacion: string;
};

// Textos fijos del listado, de las tarjetas y de la página de cada proyecto.
const textos = await getEntry("configProyectosTextos", "proyectosTextos");
export const TEXTOS_PROYECTOS = textos!.data;

const entradas = await getCollection("proyectos");

export const PROYECTOS: Proyecto[] = entradas
  .map((entrada) => ({ slug: entrada.id, ...entrada.data }))
  .sort((a, b) => a.orden - b.orden);
