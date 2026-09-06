// Textos de la home (hero + teasers de "El estudio"/"Objeto") ahora viven
// como contenido editable en src/content/config/inicio.yaml.
import { getEntry } from "astro:content";

const configInicio = await getEntry("configInicio", "inicio");

export const TEXTO_INICIO = configInicio!.data;
