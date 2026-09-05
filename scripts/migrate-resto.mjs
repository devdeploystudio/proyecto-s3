import fs from "node:fs/promises";
import path from "node:path";

function yamlStr(s) {
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function toYaml(obj, indent = 0) {
  const pad = "  ".repeat(indent);
  let out = "";
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    if (v === null) {
      out += `${pad}${k}: null\n`;
    } else if (Array.isArray(v)) {
      if (v.length === 0) {
        out += `${pad}${k}: []\n`;
      } else if (typeof v[0] === "object") {
        out += `${pad}${k}:\n`;
        for (const item of v) {
          const lines = toYaml(item, indent + 1).split("\n").filter(Boolean);
          out += `${pad}  - ${lines[0].trim()}\n`;
          for (const line of lines.slice(1)) out += `${pad}    ${line.trim()}\n`;
        }
      } else {
        out += `${pad}${k}:\n`;
        for (const item of v) {
          out += `${pad}  - ${yamlStr(item)}\n`;
        }
      }
    } else if (typeof v === "string") {
      out += `${pad}${k}: ${yamlStr(v)}\n`;
    } else if (typeof v === "object") {
      out += `${pad}${k}:\n${toYaml(v, indent + 1)}`;
    } else {
      out += `${pad}${k}: ${v}\n`;
    }
  }
  return out;
}

const O = (file) => `../../assets/objeto/${file}`;
const E = (file) => `../../assets/equipo/${file}`;

/* ─────────────── Objeto (piezas) ─────────────── */
const piezas = [
  {
    slug: "nicho",
    nombre: "Nicho",
    tipo: "Mesa auxiliar",
    medidas: "25 × 30 × 50 cm",
    precio: 185000,
    foto: ["nicho-blush-01.jpg", "nicho-blush-02.jpg", "nicho-sage-01.jpg"].map(O),
  },
  {
    slug: "prisma",
    nombre: "Prisma",
    tipo: "Mesa ratona",
    medidas: "75 × 45 × 35 cm",
    precio: 265000,
    foto: ["prisma-03.jpg", "prisma-04.jpg"].map(O),
  },
];

const piezasOutDir = "src/content/objeto-piezas";
await fs.mkdir(piezasOutDir, { recursive: true });
for (const p of piezas) {
  const { slug, ...fields } = p;
  await fs.writeFile(path.join(piezasOutDir, `${slug}.yaml`), toYaml(fields), "utf-8");
  console.log("wrote objeto-piezas/", slug);
}

/* ─────────────── Equipo ─────────────── */
const equipo = [
  {
    slug: "santino",
    nombre: "Santino Schembari",
    rol: "Diseño, dirección de obra y documentación",
    bio: "Estudiante de Arquitectura en la Universidad de Buenos Aires, ya cuenta con más de tres años de experiencia en dirección de obra. Además, se desempeñó como docente en la misma facultad. Con una sólida formación académica y práctica, se encarga del diseño, la dirección y la documentación de los proyectos, combinando creatividad y profesionalismo en cada detalle.",
    orden: 1,
    foto: E("santino.jpg"),
  },
  {
    slug: "marcelo",
    nombre: "Marcelo Schembari",
    rol: "Construcción",
    bio: "Es un constructor que creció aprendiendo el oficio de la mano de su padre. Desde joven, se involucró en el trabajo familiar, absorbiendo tanto las técnicas como los valores que definen su forma de trabajar: dedicación, calidad y pasión. Hoy, con años de experiencia, combina tradición y modernidad para llevar a cabo proyectos que reflejan su compromiso con cada detalle.",
    orden: 2,
    foto: E("marcelo.jpg"),
  },
  {
    slug: "lautaro",
    nombre: "Lautaro Schembari",
    rol: "Construcción y paisajismo",
    bio: "Hermano de Santino, trabaja junto a Marcelo en la parte constructiva de los proyectos del estudio, aportando su experiencia en obra al trabajo familiar. Además, tiene un fuerte conocimiento de paisajismo, y aporta esa mirada a la hora de pensar parquización y espacios exteriores dentro de cada proyecto.",
    orden: 3,
    // Foto pendiente de recibir.
    foto: undefined,
  },
];

const equipoOutDir = "src/content/equipo";
await fs.mkdir(equipoOutDir, { recursive: true });
for (const p of equipo) {
  const { slug, ...fields } = p;
  await fs.writeFile(path.join(equipoOutDir, `${slug}.yaml`), toYaml(fields), "utf-8");
  console.log("wrote equipo/", slug);
}

/* ─────────────── Config del sitio ─────────────── */
const site = {
  id: "site",
  instagramEstudio: "https://www.instagram.com/proyecto.s3/",
  instagramObjeto: "https://www.instagram.com/object.s3/",
  whatsappNumero: "",
  textoNosotros: [
    "S3 Proyectos es un estudio familiar integrado por Santino, Marcelo y Lautaro Schembari, donde la arquitectura y la construcción se combinan a partir de una trayectoria que atraviesa generaciones.",
    "Santino Schembari, formado en FADU–UBA y con experiencia docente, continúa junto a su padre Marcelo y su hermano Lautaro una tradición familiar ligada al oficio de construir.",
    "Desarrollamos proyectos de reforma, remodelación, interiorismo y obra, buscando transformar cada espacio desde una mirada integral que combina diseño, funcionalidad y experiencia constructiva.",
  ],
  textoObjeto: [
    "Objeto S3 nace como una extensión de S3 Proyectos y de nuestra forma de entender el interiorismo.",
    "Surge con la idea de diseñar y producir piezas que formen parte de los espacios que proyectamos, llevando la arquitectura a una escala más cercana y cotidiana.",
    "Cada objeto busca combinar diseño, materialidad y funcionalidad, creando piezas con identidad propia pensadas para acompañar y transformar los espacios interiores.",
  ],
  coloresObjeto: [
    { nombre: "Nude", swatch: "#e9dcbc" },
    { nombre: "Blanco", swatch: "#e5e3ef" },
    { nombre: "Verde agua", swatch: "#55766f" },
    { nombre: "Terracota", swatch: "#a2322a" },
    { nombre: "Rosa", swatch: "#bf7b6b" },
    { nombre: "Negro", swatch: "#040404" },
    { nombre: "Rosa bebé", swatch: "#e9d7d4" },
    { nombre: "Azul petróleo", swatch: "#5c757e" },
    { nombre: "Azul noche", swatch: "#031c48" },
    { nombre: "Menta", swatch: "#b5baa9" },
  ],
};

const configOutDir = "src/content/config";
await fs.mkdir(configOutDir, { recursive: true });
const siteYaml = `site:\n${toYaml(site, 1)}`;
await fs.writeFile(path.join(configOutDir, "site.yaml"), siteYaml, "utf-8");
console.log("wrote config/site.yaml");
