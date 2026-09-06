// Textos de la página de Contacto ahora viven como contenido editable en
// src/content/config/contacto.yaml.
import { getEntry } from "astro:content";

const configContacto = await getEntry("configContacto", "contacto");

export const TEXTO_CONTACTO = configContacto!.data;
