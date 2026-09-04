// Config central del sitio. Datos de contacto reales pendientes de confirmar con el cliente.
export const SITE = {
  nombre: "Proyecto S3",
  descripcion:
    "Estudio familiar de arquitectura y construcción, reformas, remodelación, interiorismo y obra.",
  instagramEstudio: "https://www.instagram.com/proyecto.s3/",
  instagramObjeto: "https://www.instagram.com/object.s3/",
  // TODO: pedir a Santino el número real de WhatsApp del estudio antes de publicar.
  whatsappNumero: "",
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
