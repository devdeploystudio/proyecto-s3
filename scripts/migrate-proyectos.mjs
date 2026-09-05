import fs from "node:fs/promises";
import path from "node:path";

const A = (slug, file) => `../../assets/proyectos/${slug}/${file}`;

function yamlStr(s) {
  // Simple, safe YAML scalar quoting for our content (no embedded newlines).
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function toYaml(obj, indent = 0) {
  const pad = "  ".repeat(indent);
  let out = "";
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    if (Array.isArray(v)) {
      if (v.length === 0) {
        out += `${pad}${k}: []\n`;
      } else {
        out += `${pad}${k}:\n`;
        for (const item of v) {
          out += `${pad}  - ${yamlStr(item)}\n`;
        }
      }
    } else if (typeof v === "string") {
      out += `${pad}${k}: ${yamlStr(v)}\n`;
    } else {
      out += `${pad}${k}: ${v}\n`;
    }
  }
  return out;
}

const proyectos = [
  {
    slug: "ns235",
    titulo: "Reforma NS235",
    tipo: "Reforma de cocina",
    acento: "bordo",
    resumen: "Cocina más amplia y luminosa, con mármol Calacatta y madera oscura sobre la identidad original de la vivienda.",
    concepto: "La reforma propone una cocina más amplia, funcional y vinculada a los espacios de uso cotidiano, mejorando la percepción de amplitud y la fluidez de circulación. La intervención parte del respeto por la identidad original de la vivienda, recuperando las ventanas de vidrio repartido como elemento característico. La materialidad combina madera oscura y superficies claras para generar calidez y equilibrio, mientras que el mármol Calacatta con vetas bordó introduce un acento distintivo que aporta sofisticación y remite sutilmente a la estética mid-century. El resultado es un espacio contemporáneo que conserva el carácter de la casa y lo reinterpreta desde una mirada actual.",
    cover: A("ns235", "01-01-clean.jpg"),
    tarjeta: A("ns235", "01-01-tarjeta.jpg"),
    galeria: ["01-04.jpg","01-05.jpg","01-06.jpg","01-07.jpg","01-08.jpg","01-09.jpg","01-10.jpg","01-12.jpg","01-13.jpg","01-15.jpg"].map(f => A("ns235", f)),
    presentacion: "/pdfs/ns235.pdf",
  },
  {
    slug: "b953",
    titulo: "Reforma B953",
    tipo: "Reforma integral de vivienda",
    acento: "terracota",
    resumen: "Un patio interno reorganiza la vivienda: más luz, cocina integrada al living y una nueva habitación en suite.",
    concepto: "La propuesta se estructura a partir de la incorporación de un patio interno que reorganiza la lógica de la vivienda. Este nuevo vacío actúa como pieza articuladora, separando la escalera que conduce a la planta alta del sector privado de las habitaciones, y generando una transición más clara e independiente. A su vez, mejora el ingreso de luz y ventilación natural hacia el interior. La intervención permite redefinir el antiguo quincho, que presentaba una escala desproporcionada y una función ambigua. Mediante una nueva disposición, el espacio adquiere identidad y coherencia dentro del conjunto. En el sector social, la demolición del muro divisor de la cocina posibilita su integración con el living-comedor, generando mayor continuidad espacial y optimizando la relación entre los ambientes. La propuesta se completa con la incorporación de una nueva habitación con baño en suite y la transformación del área de circulación hacia los dormitorios en un playroom con espacio de trabajo, otorgándole uso y carácter a un sector previamente residual. La reforma busca ordenar y optimizar la vivienda, mejorando su funcionamiento y calidad espacial.",
    cover: A("b953", "01-01-clean.jpg"),
    tarjeta: A("b953", "01-01-tarjeta.jpg"),
    galeria: [
      "living-a.jpg","living-b.jpg","comedor-a.jpg","comedor-b.jpg","comedor-c.jpg","comedor-d.jpg",
      "cocina-a.jpg","cocina-b.jpg","cocina-c.jpg","cocina-d.jpg",
      "patio-a.jpg","patio-b.jpg","patio-c.jpg","patio-d.jpg",
      "playroom-a.jpg","playroom-b.jpg","playroom-c.jpg",
      "dormitorio-a.jpg","dormitorio-b.jpg","dormitorio-c.jpg",
      "vestidor-1.jpg","vestidor-2.jpg","vestidor-3.jpg",
      "banosuite-1.jpg","banosuite-2.jpg",
      "bano-a-1.jpg","bano-a-2.jpg","bano-b-1.jpg","bano-b-2.jpg",
      "toillete-1.jpg","toillete-2.jpg","toillete-3.jpg",
      "planta-baja.jpg","planta-alta.jpg",
      "materialidad-living.jpg","materialidad-comedor.jpg","materialidad-cocina.jpg","materialidad-banos.jpg","materialidad-toillete.jpg",
    ].map(f => A("b953", f)),
    presentacion: "/pdfs/b953.pdf",
  },
  {
    slug: "n366",
    titulo: "Proyecto N366",
    tipo: "Quincho y parquización",
    acento: "sage",
    resumen: "Un quincho pensado como galería contemporánea hacia el exterior, con pileta elevada de inspiración balinesa.",
    concepto: "Este proyecto propone un quincho concebido como una galería contemporánea que se extiende hacia el exterior, generando una continuidad fluida entre los espacios interiores y el paisaje. La propuesta se apoya en una paleta de verdes grisáceos, madera y texturas naturales, buscando una atmósfera cálida, relajada y sofisticada. El diseño incorpora una intervención paisajística que acompaña la arquitectura y refuerza una impronta tropical sutil, mientras que la pileta elevada, inspirada en una estética balinesa, se convierte en el punto protagonista del conjunto. Se complementa con un sector de solárium y un fogonero de líneas puras y carácter arquitectónico, pensado como espacio de encuentro. El resultado es una propuesta que combina funcionalidad, materialidad y paisaje, creando un espacio de disfrute que equilibra diseño contemporáneo, naturaleza y confort.",
    cover: A("n366", "01-01-clean.jpg"),
    tarjeta: A("n366", "01-01-tarjeta.jpg"),
    galeria: [
      "01-06.jpg","quincho-b.jpg","quincho-c.jpg","patio-a.jpg","patio-b.jpg","01-11.jpg","fogon.jpg",
      "ducha-a.jpg","ducha-b.jpg","01-15-a.jpg","01-15-b.jpg","01-15-c.jpg",
      "zonificacion.jpg","planta.jpg","corte-a.jpg","01-20.jpg",
      "materialidad-quincho.jpg","materialidad-pileta.jpg",
    ].map(f => A("n366", f)),
    presentacion: "/pdfs/n366.pdf",
  },
  {
    slug: "fv1752",
    titulo: "Reforma FV1752",
    tipo: "Reforma de cocina",
    acento: "sage",
    resumen: "Cocina conectada al comedor, con doble mesada e isla desayunador sobre una arcada antes portante.",
    concepto: "Esta cocina tenía una arcada que separaba los ambientes y hacía que todo se sintiera más chico. La propuesta fue abrir ese espacio y conectar cocina y comedor, logrando mayor amplitud y luz. Como la arcada era portante, lo resolvimos con un refuerzo metálico integrado al cielorraso, sin perder altura. En lugar de la clásica cocina en \"L\", diseñamos una doble mesada con isla desayunador. Esto no solo suma superficie de trabajo, sino que convierte la cocina en un lugar de encuentro. También aprovechamos la altura con dobles alacenas y cambiamos la ventana con el fin de liberar pared para generar más espacio de guardado.",
    cover: A("fv1752", "02-cocina-a-clean.jpg"),
    galeria: ["02-cocina-a.jpg","03-cocina-b.jpg","05-alacena-cocina.jpg","06-alacena-pantry.jpg"].map(f => A("fv1752", f)),
    presentacion: "/pdfs/fv1752.pdf",
  },
  {
    slug: "dota",
    titulo: "Heladería DOTA",
    tipo: "Local comercial",
    acento: "sage",
    resumen: "Una heladería pensada como ritual: cada persona arma su helado paso a paso, en un espacio cálido y con identidad propia.",
    concepto: "Diseñamos una heladería pensada para que cada persona sea parte activa en la creación de su helado. La propuesta invita a armarlo paso a paso, eligiendo bases, sabores y texturas, convirtiendo el momento en algo único y personal. El espacio acompaña esta idea: cálido, íntimo y con identidad propia. Usamos colores vivos, materiales cálidos y formas simples, buscando un ambiente fresco pero cuidado, donde cada detalle refuerza la experiencia. Más que un local, la heladería se vive como un ritual: un lugar diferente que combina diseño, identidad y lenguaje visual en una propuesta innovadora. En colaboración con @visualbymartina.",
    cover: A("dota", "01-entrada-clean.jpg"),
    galeria: ["01-entrada.jpg","07-fachada.jpg","08-merchandising.jpg","06-mostrador-ingredientes.jpg","02-concepto.jpg","04-lounge.jpg","05-mostrador.jpg"].map(f => A("dota", f)),
    presentacion: "/pdfs/dota.pdf",
  },
  {
    slug: "bds570",
    titulo: "Reforma BDS570",
    tipo: "Reforma de baño",
    acento: "sage",
    resumen: "Baño en suite compartido entre dos habitaciones, sectorizado con puertas corredizas de vidrio para un uso simultáneo y privado.",
    concepto: "La propuesta consiste en la remodelación de un baño en suite compartido entre dos habitaciones, pensado para responder a las necesidades de uso simultáneo de dos hermanos. A partir de una nueva organización espacial, se plantea una sectorización mediante puertas corredizas de vidrio que permite independizar el área de ducha, el sector de inodoro y bidet, y el espacio de bachas. Esta configuración posibilita un uso más flexible y simultáneo del baño, mejorando la privacidad y la funcionalidad sin perder amplitud ni continuidad visual. La intervención busca optimizar la dinámica cotidiana y generar un espacio contemporáneo, eficiente y adaptable a sus usuarios.",
    cover: A("bds570", "01-cover.jpg"),
    tarjeta: A("bds570", "00-caratula.jpg"),
    galeria: ["02-puertas-cerradas.jpg","03-puertas-abiertas.jpg","04-ducha-a.jpg","05-ducha-b.jpg","06-sanitarios-a.jpg","07-sanitarios-b.jpg","08-bacha-a.jpg","09-bacha-b.jpg","10-planta.jpg"].map(f => A("bds570", f)),
    presentacion: "/pdfs/bds570.pdf",
  },
];

const outDir = "src/content/proyectos";
await fs.mkdir(outDir, { recursive: true });
for (const p of proyectos) {
  const { slug, ...fields } = p;
  const yaml = toYaml(fields);
  await fs.writeFile(path.join(outDir, `${slug}.yaml`), yaml, "utf-8");
  console.log("wrote", slug);
}
