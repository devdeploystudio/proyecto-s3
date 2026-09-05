// Comprime en el lugar los archivos de imagen pasados por argumento (uno
// por línea). Solo pisa el original si el resultado da más chico —así es
// seguro correrlo sobre imágenes ya optimizadas sin volver a degradarlas.
// Sin cuantización de color (no "palette"): sirve para cualquier imagen que
// suban por el panel (fotos, renders, capturas), no solo las ya probadas a
// mano acá.
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const files = (process.argv[2] ?? "")
  .split("\n")
  .map((f) => f.trim())
  .filter(Boolean);

if (!files.length) {
  console.log("No hay imágenes para comprimir.");
  process.exit(0);
}

for (const file of files) {
  try {
    const before = (await fs.stat(file)).size;
    const ext = path.extname(file).toLowerCase();
    const img = sharp(file);
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
      await fs.writeFile(file, buffer);
      console.log(`${file}: ${(before / 1024).toFixed(0)}KB -> ${(buffer.length / 1024).toFixed(0)}KB`);
    } else {
      console.log(`${file}: ya está optimizada (${(before / 1024).toFixed(0)}KB), sin cambios`);
    }
  } catch (err) {
    console.error(`Error procesando ${file}:`, err instanceof Error ? err.message : err);
  }
}
