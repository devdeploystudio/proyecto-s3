// Instagram/WhatsApp ahora viven en src/content/config/site.yaml, editable
// desde /admin. Nombre/descripción del sitio quedan en código (no forman
// parte del contenido editable por ahora). withBase/linkWhatsapp mantienen
// exactamente la misma firma de antes para no tocar sus consumidores.
import { getEntry } from "astro:content";

const config = await getEntry("config", "site");

export const SITE = {
  nombre: "Proyecto S3",
  descripcion:
    "Estudio familiar de arquitectura y construcción, reformas, remodelación, interiorismo y obra.",
  instagramEstudio: config!.data.instagramEstudio,
  instagramObjeto: config!.data.instagramObjeto,
  whatsappNumero: config!.data.whatsappNumero,
};

export function linkWhatsapp(mensaje: string): string {
  const numero = SITE.whatsappNumero || "PENDIENTE-NUMERO-WHATSAPP";
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

// Antepone el base path del sitio (import.meta.env.BASE_URL) a un link interno,
// para que la navegación funcione tanto en la raíz de un dominio como en una
// subcarpeta (ej: GitHub Pages en /proyecto-s3/). No usar con URLs externas.
export function withBase(path: string): string {
  const rawBase = import.meta.env.BASE_URL;
  const base = rawBase.endsWith("/") ? rawBase : rawBase + "/";
  if (path === "/") return base;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return base + cleanPath;
}
