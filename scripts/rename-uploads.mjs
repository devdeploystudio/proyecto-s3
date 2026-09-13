// Dos cosas con las imágenes que cambian en un push a src/assets/:
// - Archivo NUEVO (status "A"): se renombra con el sufijo de categoría
//   según la carpeta donde cayó (ej: subida a "proyectos/ns235/" -> termina
//   en "-ns235"), para que el nombre diga a qué pertenece.
// - Archivo REEMPLAZADO en el mismo path (status "M"): el cliente subió una
//   foto nueva manteniendo el nombre de archivo (Sveltia/Decap no renombra
//   solo). Se renombra a la próxima versión libre
//   (foto.jpg -> foto_v02.jpg -> foto_v03.jpg...). En este proyecto las
//   imágenes del panel pasan por astro:assets (<Image>), que ya les agrega
//   un hash de contenido al buildear, así que la caché larga de _headers ya
//   es segura sin esto para esos casos - pero esto protege igual cualquier
//   archivo servido "tal cual" (ej. los PDF de widget:"file", si en algún
//   momento se les agrega caché larga también) y deja el repo prolijo con
//   un historial de versiones en vez de pisar el archivo sin dejar rastro.
//
// En ambos casos, actualiza sola la referencia en cualquier YAML de
// contenido o import directo en .astro/.ts/.tsx/.js/.jsx que la use.
import fs from "node:fs/promises";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path/posix";

function categoriaDesdeRuta(rutaRelativa) {
  // rutaRelativa viene desde la raíz del repo, ej: "src/assets/proyectos/ns235/foo.jpg"
  const partes = rutaRelativa.split("/");
  const i = partes.indexOf("assets");
  if (i < 0) return null;
  const carpeta = partes[i + 1]; // "proyectos" | "objeto" | "equipo" | ...
  const siguiente = partes[i + 2];
  const esSubcarpeta = siguiente && siguiente !== path.basename(rutaRelativa);

  if (carpeta === "proyectos" && esSubcarpeta) return siguiente; // ej: "ns235"
  if (carpeta === "objeto" && esSubcarpeta) return siguiente; // ej: "nicho" | "prisma"
  if (carpeta === "objeto") return "objeto";
  if (carpeta === "equipo") return "equipo";
  return null;
}

function slugify(s) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function nextVersion(dir, baseName, ext) {
  const files = existsSync(dir) ? readdirSync(dir) : [];
  const re = new RegExp(`^${escapeRegExp(baseName)}_v(\\d+)${escapeRegExp(ext)}$`, "i");
  let max = 1;
  for (const f of files) {
    const m = f.match(re);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return max + 1;
}

// Formato "STATUS\tpath" por línea (git diff --name-status), pasado por el
// workflow. El .replace saca un \r final si el runner lo dejara (no debería
// en Linux, pero es gratis protegerse).
const entradas = (process.argv[2] ?? "")
  .split("\n")
  .map((l) => l.replace(/\r$/, "").trim())
  .filter(Boolean)
  .map((l) => {
    const [status, ...rest] = l.split("\t");
    return { status: status.trim(), path: rest.join("\t").trim() };
  });

if (!entradas.length) {
  console.log("rename-uploads: sin imágenes nuevas ni reemplazos en este push.");
  process.exit(0);
}

// Todo src/ menos src/assets (son binarios) - no solo el YAML de contenido,
// porque algunas imágenes (heros, fondos de sección) se importan directo en
// un .astro/.ts en vez de venir de una colección.
const extensionesAReferenciar = [".yaml", ".yml", ".astro", ".ts", ".tsx", ".js", ".jsx"];

async function listarArchivosDeReferencia(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.name === "assets") continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await listarArchivosDeReferencia(p)));
    else if (extensionesAReferenciar.some((ext) => entry.name.endsWith(ext))) out.push(p);
  }
  return out;
}

const archivosDeReferencia = await listarArchivosDeReferencia("src");

async function actualizarReferencias(nombreViejo, nombreNuevo) {
  let touched = 0;
  for (const refPath of archivosDeReferencia) {
    let contenido;
    try {
      contenido = await fs.readFile(refPath, "utf-8");
    } catch {
      continue;
    }
    if (contenido.includes(nombreViejo)) {
      await fs.writeFile(refPath, contenido.split(nombreViejo).join(nombreNuevo), "utf-8");
      touched++;
    }
  }
  return touched;
}

for (const { status, path: file } of entradas) {
  if (!existsSync(file)) continue; // por si un rename previo ya lo movió

  const dir = path.dirname(file);
  const ext = path.extname(file);
  const baseName = path.basename(file, ext);

  if (status === "A") {
    const categoria = categoriaDesdeRuta(file);
    if (!categoria) {
      console.log(`${file}: fuera de una carpeta conocida, no se toca`);
      continue;
    }

    const baseSlug = slugify(baseName);
    if (baseSlug.endsWith(`-${categoria}`)) {
      console.log(`${file}: ya tiene el sufijo "${categoria}", no se toca`);
      continue;
    }

    const nuevoNombre = `${baseSlug}-${categoria}${ext.toLowerCase()}`;
    const nuevaRuta = path.join(dir, nuevoNombre);
    if (nuevaRuta === file) continue;

    await fs.rename(file, nuevaRuta);
    const touched = await actualizarReferencias(path.basename(file), nuevoNombre);
    console.log(`${file} -> ${nuevaRuta} (nuevo, ${touched} referencia(s) actualizada(s))`);
  } else if (status === "M") {
    // Ya versionado a mano (alguien subió directo "algo_v03.jpg").
    if (/_v\d+$/i.test(baseName)) continue;

    const version = nextVersion(dir, baseName, ext);
    const nuevoNombre = `${baseName}_v${String(version).padStart(2, "0")}${ext}`;
    const nuevaRuta = path.join(dir, nuevoNombre);

    await fs.rename(file, nuevaRuta);
    const touched = await actualizarReferencias(path.basename(file), nuevoNombre);
    console.log(`${file} -> ${nuevaRuta} (reemplazo versionado, ${touched} referencia(s) actualizada(s))`);
  }
}
