import type { APIRoute } from "astro";
import { PROYECTOS } from "../data/proyectos";

export const prerender = true;

const BASE_URL = "https://proyecto-s3.com.ar";

export const GET: APIRoute = () => {
  const rutas = [
    "/",
    "/estudio/",
    "/proyectos/",
    ...PROYECTOS.map((p) => `/proyectos/${p.slug}/`),
    "/objeto/",
    "/contacto/",
    "/privacidad/",
    "/terminos/",
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rutas.map((ruta) => `  <url><loc>${BASE_URL}${ruta}</loc></url>`).join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml" },
  });
};
