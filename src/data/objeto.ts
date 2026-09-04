import nichoBlush1 from "../assets/objeto/nicho-blush-01.jpg";
import nichoBlush2 from "../assets/objeto/nicho-blush-02.jpg";
import nichoSage1 from "../assets/objeto/nicho-sage-01.jpg";
import prisma3 from "../assets/objeto/prisma-03.jpg";
import prisma4 from "../assets/objeto/prisma-04.jpg";

export const TEXTO_OBJETO = [
  "Objeto S3 nace como una extensión de S3 Proyectos y de nuestra forma de entender el interiorismo.",
  "Surge con la idea de diseñar y producir piezas que formen parte de los espacios que proyectamos, llevando la arquitectura a una escala más cercana y cotidiana.",
  "Cada objeto busca combinar diseño, materialidad y funcionalidad, creando piezas con identidad propia pensadas para acompañar y transformar los espacios interiores.",
];

export type Color = {
  nombre: string;
  swatch: string;
};

// Paleta de cerámicas disponibles para personalizar cada pieza.
// Los valores son una referencia visual de la cerámica, no un color plano.
export const COLORES: Color[] = [
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
];

export type Pieza = {
  slug: string;
  nombre: string;
  tipo: string;
  medidas: string;
  precio: number | null;
  foto: ImageMetadata[];
};

// Medidas y precios confirmados por el cliente. Un tercer modelo está
// pendiente de nombre, medidas, precio y foto, no se incluye hasta confirmarlo.
export const PIEZAS: Pieza[] = [
  {
    slug: "nicho",
    nombre: "Nicho",
    tipo: "Mesa auxiliar",
    medidas: "25 × 30 × 50 cm",
    precio: 185000,
    foto: [nichoBlush1, nichoBlush2, nichoSage1],
  },
  {
    slug: "prisma",
    nombre: "Prisma",
    tipo: "Mesa ratona",
    medidas: "75 × 45 × 35 cm",
    precio: 265000,
    foto: [prisma3, prisma4],
  },
];
