// Vista previa en vivo para el panel (Sveltia CMS). NO pretende ser un
// espejo pixel-perfect de la página real (eso solo se logra con un preview
// deploy real de Cloudflare, mucho más trabajo/fricción para un sitio de
// este tamaño): alcanza con mostrar los textos/fotos con la tipografía y
// los colores reales de la marca, para que el cliente vea cómo va a leerse
// antes de guardar, sin tener que adivinar. Mismo patrón que
// santilli-aparts (sep 2026), adaptado a los colores/fuentes reales de
// Proyecto S3 / Objeto (ver src/styles/global.css: terracota = Proyecto S3,
// sage/celeste = Objeto).
//
// API usada: CMS.registerPreviewStyle / CMS.registerPreviewTemplate, la
// misma que Decap CMS (Sveltia mantiene compatibilidad). Sin build step:
// se escribe con createClass + h (hyperscript), variables globales que
// expone el propio script de Sveltia una vez cargado.

CMS.registerPreviewStyle(
  "https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;900&family=Geist:wght@400;500;600&display=swap",
);

CMS.registerPreviewStyle(`
  body {
    margin: 0;
    padding: 2rem;
    background: #faf3ee;
    color: #23150f;
    font-family: 'Geist', -apple-system, 'Segoe UI', sans-serif;
    font-size: 16px;
    line-height: 1.6;
  }
  .p-eyebrow {
    font-family: 'Geist', sans-serif;
    font-weight: 600;
    font-size: 0.8rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #ce491c;
    margin: 0 0 0.5rem;
  }
  .p-eyebrow--sage { color: #33534a; }
  .p-titulo {
    font-family: 'Big Shoulders Display', 'Arial Narrow', sans-serif;
    font-weight: 700;
    line-height: 0.96;
    letter-spacing: -0.01em;
    font-size: 2.2rem;
    color: #23150f;
    margin: 0 0 0.75rem;
  }
  .p-texto {
    color: #23150f;
    margin: 0 0 1rem;
    max-width: 42rem;
  }
  .p-texto--muted { color: #8a776d; }
  .p-lista { list-style: none; margin: 0 0 1rem; padding: 0; }
  .p-lista li {
    margin-bottom: 0.9rem;
    color: #23150f;
    max-width: 42rem;
  }
  .p-foto {
    width: 100%;
    max-width: 26rem;
    border-radius: 4px;
    margin-bottom: 1.25rem;
    display: block;
    object-fit: cover;
  }
  .p-foto--bn { filter: grayscale(1); }
  .p-nota {
    display: inline-block;
    margin-top: 1rem;
    padding: 0.5rem 0.85rem;
    border-radius: 6px;
    background: #f1d9cf;
    color: #4a0e0a;
    font-size: 0.8rem;
  }
  .p-colores {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 0.5rem;
    list-style: none;
    padding: 0;
  }
  .p-colores li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: #8a776d;
  }
  .p-swatch {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px rgba(0,0,0,0.14);
    flex-shrink: 0;
  }
  .p-block--proyecto { border-left: 4px solid #ce491c; padding-left: 1rem; }
  .p-block--objeto { border-left: 4px solid #a7c6bf; padding-left: 1rem; }
`);

const { createClass, h } = window;

// `items` puede ser una List de Immutable.js (viene de entry.getIn(...)) o
// un array común - toArray() normaliza ambos casos a un array plano.
function toPlainArray(items) {
  if (!items) return [];
  return typeof items.toArray === "function" ? items.toArray() : items;
}

function campoDe(item, nombre) {
  return typeof item.get === "function" ? item.get(nombre) : item[nombre];
}

function Parrafos({ items, campo = "parrafo", muted = false }) {
  const lista = toPlainArray(items);
  if (!lista.length) return null;
  return h(
    "ul",
    { className: "p-lista" },
    lista.map((item, i) =>
      h(
        "li",
        { key: i, className: muted ? "p-texto--muted" : undefined },
        campoDe(item, campo),
      ),
    ),
  );
}

// --- Inicio → Portada ---
CMS.registerPreviewTemplate(
  "inicio-portada",
  createClass({
    render() {
      const data = this.props.entry.getIn(["data", "inicioPortada"]);
      if (!data) return null;
      const foto = this.props.getAsset(data.get("heroImagen"));
      return h(
        "div",
        { className: "p-block--proyecto" },
        foto && h("img", { className: "p-foto", src: foto.toString() }),
        h("p", { className: "p-eyebrow" }, data.get("heroEyebrow")),
        h("h1", { className: "p-titulo" }, data.get("heroTitulo")),
        h("span", { className: "p-nota" }, "Debajo de esto va el primer párrafo del texto de \"Estudio\"."),
      );
    },
  }),
);

// --- Inicio → El estudio (adelanto) ---
CMS.registerPreviewTemplate(
  "inicio-estudio",
  createClass({
    render() {
      const data = this.props.entry.getIn(["data", "inicioEstudio"]);
      if (!data) return null;
      return h(
        "div",
        { className: "p-block--proyecto" },
        h("p", { className: "p-eyebrow" }, "El estudio"),
        h("h1", { className: "p-titulo" }, data.get("teaserTitulo")),
        h("p", { className: "p-texto" }, data.get("teaserTexto")),
        h("span", { className: "p-nota" }, "Al lado va la foto del equipo (se edita en \"Estudio → Texto\")."),
      );
    },
  }),
);

// --- Inicio → Objeto (adelanto) ---
CMS.registerPreviewTemplate(
  "inicio-objeto",
  createClass({
    render() {
      const data = this.props.entry.getIn(["data", "inicioObjeto"]);
      if (!data) return null;
      return h(
        "div",
        { className: "p-block--objeto" },
        h("p", { className: "p-eyebrow p-eyebrow--sage" }, "Objeto"),
        h("h1", { className: "p-titulo" }, data.get("objetoTitulo")),
        h("p", { className: "p-texto" }, data.get("objetoTexto")),
      );
    },
  }),
);

// --- Inicio → Bloque final ---
CMS.registerPreviewTemplate(
  "inicio-final",
  createClass({
    render() {
      const data = this.props.entry.getIn(["data", "inicioFinal"]);
      if (!data) return null;
      const foto = this.props.getAsset(data.get("ctaImagen"));
      return h(
        "div",
        {},
        foto && h("img", { className: "p-foto", src: foto.toString() }),
        h("h1", { className: "p-titulo" }, "¿Tenés un proyecto en mente?"),
        h("p", { className: "p-texto" }, "Contanos en qué estás pensando y lo charlamos por WhatsApp."),
        h("span", { className: "p-nota" }, "El título y el texto de este cartel son fijos: acá solo se cambia la foto de fondo."),
      );
    },
  }),
);

// --- Estudio → Texto ---
CMS.registerPreviewTemplate(
  "estudio",
  createClass({
    render() {
      const data = this.props.entry.getIn(["data", "estudio"]);
      if (!data) return null;
      const foto = this.props.getAsset(data.get("foto"));
      const enColor = data.get("colorOriginal");
      return h(
        "div",
        { className: "p-block--proyecto" },
        foto &&
          h("img", { className: `p-foto${enColor ? "" : " p-foto--bn"}`, src: foto.toString() }),
        h("p", { className: "p-eyebrow" }, "El estudio"),
        h(Parrafos, { items: data.get("textoNosotros") }),
        h(
          "span",
          { className: "p-nota" },
          enColor ? "Esta foto se muestra en color." : "Esta foto se muestra en blanco y negro (tildá \"Mostrar en color\" para verla a color).",
        ),
      );
    },
  }),
);

// --- Objeto → Texto y colores ---
CMS.registerPreviewTemplate(
  "objeto",
  createClass({
    render() {
      const data = this.props.entry.getIn(["data", "objeto"]);
      if (!data) return null;
      const colores = toPlainArray(data.get("coloresObjeto"));
      return h(
        "div",
        { className: "p-block--objeto" },
        h("p", { className: "p-eyebrow p-eyebrow--sage" }, "Objeto"),
        h(Parrafos, { items: data.get("textoObjeto") }),
        colores.length > 0 &&
          h(
            "ul",
            { className: "p-colores" },
            colores.map((c, i) =>
              h(
                "li",
                { key: i },
                h("span", { className: "p-swatch", style: { background: campoDe(c, "swatch") } }),
                campoDe(c, "nombre"),
              ),
            ),
          ),
      );
    },
  }),
);

// --- Contacto → Textos ---
CMS.registerPreviewTemplate(
  "contacto",
  createClass({
    render() {
      const data = this.props.entry.getIn(["data", "contacto"]);
      if (!data) return null;
      const foto = this.props.getAsset(data.get("imagen"));
      return h(
        "div",
        {},
        foto && h("img", { className: "p-foto", src: foto.toString() }),
        h("p", { className: "p-eyebrow" }, "Contacto"),
        h("h1", { className: "p-titulo" }, data.get("titulo")),
        h("p", { className: "p-texto" }, data.get("lead")),
      );
    },
  }),
);
