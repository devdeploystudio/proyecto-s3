// Textos de la home (portada + los dos teasers de "El estudio"/"Objeto" +
// la imagen del bloque final) viven como contenido editable, cada bloque en
// su propio archivo (src/content/config/inicio-*.yaml) — antes eran un solo
// "inicio.yaml" con las 4 pantallas mezcladas. Wrapper delgado: junta los 4
// en un solo objeto con la MISMA forma que antes (mismos nombres de campo),
// para no tener que tocar index.astro.
import { getEntry } from "astro:content";

const portada = await getEntry("configInicioPortada", "inicioPortada");
const teaserEstudio = await getEntry("configInicioEstudio", "inicioEstudio");
const teaserObjeto = await getEntry("configInicioObjeto", "inicioObjeto");
const final = await getEntry("configInicioFinal", "inicioFinal");

export const TEXTO_INICIO = {
  ...portada!.data,
  ...teaserEstudio!.data,
  ...teaserObjeto!.data,
  ...final!.data,
};
