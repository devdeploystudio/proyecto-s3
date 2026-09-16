// Comprime en el lugar los archivos de imagen pasados por argumento (uno
// por línea). Solo pisa el original si el resultado da más chico —así es
// seguro correrlo sobre imágenes ya optimizadas sin volver a degradarlas.
// Sin cuantización de color (no "palette"): sirve para cualquier imagen que
// suban por el panel (fotos, renders, capturas), no solo las ya probadas a
// mano acá.
import sharp from "sharp";
import { existsSync, readdirSync } from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";

// Defensivo, no debería activarse en este proyecto: el workflow ya hace
// `git add -A` (staging el renombre de rename-uploads.mjs) ANTES de armar
// la lista de archivos a comprimir, así que esta lista ya llega con los
// nombres finales. Pero si algún día se reordenan los pasos del workflow
// y esta lista queda desactualizada, un archivo puede haber sido
// renombrado a "_vNN" por rename-uploads.mjs sin que este script se
// entere — sin esto, revienta con ENOENT en vez de comprimir igual (bug
// real encontrado en `santilli-aparts`, ver MD para creacion de panel.md).
function resolveRenamedPath(file) {
  if (existsSync(file)) return file;

  const dir = path.dirname(file);
  const ext = path.extname(file);
  const baseName = path.basename(file, ext);
  const escaped = baseName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`^${escaped}_v(\\d+)${ext.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
  const entries = existsSync(dir) ? readdirSync(dir) : [];

  let best = null;
  let bestVersion = -1;
  for (const entry of entries) {
    const m = entry.match(re);
    if (m && parseInt(m[1], 10) > bestVersion) {
      bestVersion = parseInt(m[1], 10);
      best = entry;
    }
  }
  return best ? path.join(dir, best) : null;
}

const files = (process.argv[2] ?? "")
  .split("\n")
  .map((f) => f.trim())
  .filter(Boolean);

if (!files.length) {
  console.log("No hay imágenes para comprimir.");
  process.exit(0);
}

for (const fileArg of files) {
  const file = resolveRenamedPath(fileArg);
  if (!file) {
    console.log(`${fileArg}: ya no existe (probablemente eliminado en este mismo push), se salteó`);
    continue;
  }
  try {
    const original = await fsp.readFile(file);
    const before = original.length;
    const ext = path.extname(file).toLowerCase();
    // sharp(rutaDeArchivo) deja el archivo abierto para lectura, y en
    // Windows eso bloquea la escritura posterior al mismo path — por eso
    // se le pasa el buffer ya leído, no la ruta.
    const img = sharp(original);
    let buffer;

    if (ext === ".png") {
      buffer = await img.png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
    } else if (ext === ".jpg" || ext === ".jpeg") {
      buffer = await img.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
    } else if (ext === ".webp") {
      buffer = await img.webp({ quality: 82 }).toBuffer();
    } else {
      console.log(`${file}: formato no soportado, se deja como está`);
      continue;
    }

    if (buffer.length < before) {
      await fsp.writeFile(file, buffer);
      console.log(`${file}: ${(before / 1024).toFixed(0)}KB -> ${(buffer.length / 1024).toFixed(0)}KB`);
    } else {
      console.log(`${file}: ya está optimizada (${(before / 1024).toFixed(0)}KB), sin cambios`);
    }
  } catch (err) {
    console.error(`Error procesando ${file}:`, err instanceof Error ? err.message : err);
  }
}
