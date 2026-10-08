// Textos de la home (portada + los teasers de "El estudio"/"Objeto", el
// bloque "Proyectos" y el bloque final) viven como contenido editable, cada
// bloque en su propio archivo (src/content/config/inicio-*.yaml). Wrapper
// delgado: junta los 5
// en un solo objeto con la MISMA forma que antes (mismos nombres de campo),
// para no tener que tocar index.astro.
import { getEntry } from "astro:content";

const portada = await getEntry("configInicioPortada", "inicioPortada");
const teaserEstudio = await getEntry("configInicioEstudio", "inicioEstudio");
const proyectos = await getEntry("configInicioProyectos", "inicioProyectos");
const teaserObjeto = await getEntry("configInicioObjeto", "inicioObjeto");
const final = await getEntry("configInicioFinal", "inicioFinal");

export const TEXTO_INICIO = {
  ...portada!.data,
  ...teaserEstudio!.data,
  ...proyectos!.data,
  ...teaserObjeto!.data,
  ...final!.data,
};
