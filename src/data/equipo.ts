import santinoFoto from "../assets/equipo/santino.jpg";
import marceloFoto from "../assets/equipo/marcelo.jpg";

export const INTRO_EQUIPO =
  "S3 Proyectos es un estudio familiar integrado por Santino, Marcelo y Lautaro Schembari, donde la arquitectura y la construcción se combinan a partir de una trayectoria que atraviesa generaciones.";

export const TEXTO_NOSOTROS = [
  "S3 Proyectos es un estudio familiar integrado por Santino, Marcelo y Lautaro Schembari, donde la arquitectura y la construcción se combinan a partir de una trayectoria que atraviesa generaciones.",
  "Santino Schembari, formado en FADU–UBA y con experiencia docente, continúa junto a su padre Marcelo y su hermano Lautaro una tradición familiar ligada al oficio de construir.",
  "Desarrollamos proyectos de reforma, remodelación, interiorismo y obra, buscando transformar cada espacio desde una mirada integral que combina diseño, funcionalidad y experiencia constructiva.",
];

export type Persona = {
  slug: string;
  nombre: string;
  rol: string;
  bio: string;
  foto?: ImageMetadata;
};

export const EQUIPO: Persona[] = [
  {
    slug: "santino",
    nombre: "Santino Schembari",
    rol: "Diseño, dirección de obra y documentación",
    bio: "Estudiante de Arquitectura en la Universidad de Buenos Aires, ya cuenta con más de tres años de experiencia en dirección de obra. Además, se desempeñó como docente en la misma facultad. Con una sólida formación académica y práctica, se encarga del diseño, la dirección y la documentación de los proyectos, combinando creatividad y profesionalismo en cada detalle.",
    foto: santinoFoto,
  },
  {
    slug: "marcelo",
    nombre: "Marcelo Schembari",
    rol: "Construcción",
    bio: "Es un constructor que creció aprendiendo el oficio de la mano de su padre. Desde joven, se involucró en el trabajo familiar, absorbiendo tanto las técnicas como los valores que definen su forma de trabajar: dedicación, calidad y pasión. Hoy, con años de experiencia, combina tradición y modernidad para llevar a cabo proyectos que reflejan su compromiso con cada detalle.",
    foto: marceloFoto,
  },
  {
    slug: "lautaro",
    nombre: "Lautaro Schembari",
    rol: "Construcción y paisajismo",
    bio: "Hermano de Santino, trabaja junto a Marcelo en la parte constructiva de los proyectos del estudio, aportando su experiencia en obra al trabajo familiar. Además, tiene un fuerte conocimiento de paisajismo, y aporta esa mirada a la hora de pensar parquización y espacios exteriores dentro de cada proyecto.",
    // Foto pendiente de recibir.
    foto: undefined,
  },
];
