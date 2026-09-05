// Renombra imágenes RECIÉN AGREGADAS bajo src/assets/ para que el nombre
// diga a qué pertenecen (ej: "img_2384.jpg" subida a la carpeta de "ns235"
// pasa a "img-2384-ns235.jpg"), y actualiza la referencia en el YAML de
// contenido que la usa. Solo toca archivos NUEVOS (no ediciones), y solo
// dentro de carpetas de assets conocidas — no toca nada fuera de eso.
import fs from "node:fs/promises";
import path from "node:path";

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

const files = (process.argv[2] ?? "")
  .split("\n")
  .map((f) => f.trim())
  .filter(Boolean);

if (!files.length) {
  console.log("No hay imágenes nuevas para renombrar.");
  process.exit(0);
}

const contentDir = "src/content";

async function listarYamls(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await listarYamls(p)));
    else if (entry.name.endsWith(".yaml") || entry.name.endsWith(".yml")) out.push(p);
  }
  return out;
}

const yamls = await listarYamls(contentDir);

for (const file of files) {
  const categoria = categoriaDesdeRuta(file);
  if (!categoria) {
    console.log(`${file}: fuera de una carpeta conocida, no se toca`);
    continue;
  }

  const dir = path.dirname(file);
  const ext = path.extname(file);
  const base = path.basename(file, ext);
  const baseSlug = slugify(base);

  if (baseSlug.endsWith(`-${categoria}`)) {
    console.log(`${file}: ya tiene el sufijo "${categoria}", no se toca`);
    continue;
  }

  const nuevoNombre = `${baseSlug}-${categoria}${ext.toLowerCase()}`;
  const nuevaRuta = path.join(dir, nuevoNombre).replace(/\\/g, "/");

  if (nuevaRuta === file) continue;

  await fs.rename(file, nuevaRuta);
  console.log(`${file} -> ${nuevaRuta}`);

  // Actualiza la referencia en el YAML que apunte al archivo viejo.
  for (const yamlPath of yamls) {
    let contenido;
    try {
      contenido = await fs.readFile(yamlPath, "utf-8");
    } catch {
      continue;
    }
    if (contenido.includes(path.basename(file))) {
      const actualizado = contenido.split(path.basename(file)).join(nuevoNombre);
      await fs.writeFile(yamlPath, actualizado, "utf-8");
      console.log(`  referencia actualizada en ${yamlPath}`);
    }
  }
}
