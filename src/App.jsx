import { useState, useRef, useCallback, useMemo } from "react";
import {
  Upload,
  ExternalLink,
  RefreshCw,
  Sparkles,
  AlertCircle,
  Check,
  ChevronDown,
  ShieldCheck,
  Info,
} from "lucide-react";
import p1Img from "./assets/p1.jpg";
import p2Img from "./assets/p2.jpg";
import p3Img from "./assets/p3.jpg";
import p4Img from "./assets/p4.jpg";
import p5Img from "./assets/p5.jpg";
import p6Img from "./assets/p6.jpg";
import p7Img from "./assets/p7.jpg";
import p8Img from "./assets/p8.jpg";
import p9Img from "./assets/p9.jpg";
import p10Img from "./assets/p10.jpg";
import p11Img from "./assets/p11.jpg";
import p12Img from "./assets/p12.jpg";
import p13Img from "./assets/p13.jpg";
import p14Img from "./assets/p14.jpg";
import p15Img from "./assets/p15.jpg";

const PRODUCT_IMAGES = {
  p1: p1Img,
  p2: p2Img,
  p3: p3Img,
  p4: p4Img,
  p5: p5Img,
  p6: p6Img,
  p7: p7Img,
  p8: p8Img,
  p9: p9Img,
  p10: p10Img,
  p11: p11Img,
  p12: p12Img,
  p13: p13Img,
  p14: p14Img,
  p15: p15Img,
};

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Work+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');`;

const COLORS = {
  paper: "#FAF3EC",
  ink: "#2A1A1E",
  inkSoft: "#5B4650",
  primary: "#A6234A", // deep berry — signature
  primarySoft: "#F2D9DF",
  gold: "#8A6A2F",
  goldBg: "#F1E7D2",
  line: "#E4D6CC",
  card: "#FFFFFF",
  oliveBg: "#EDEEE1",
  olive: "#5C6B3F",
};

// -- preset skin-tone swatches (depth + undertone), used for one-tap matching --
// 20 tons cobrindo profundidade (muito claro → muito escuro) e as 4 famílias
// de subtom (quente, fria, neutra, oliva), para dar ao usuário um ponto de
// partida preciso mesmo sem enviar foto.
const PRESET_TONES = [
  { hex: "#F5DCC8", label: "Porcelana", depth: "muito claro", undertone: "fria" },
  { hex: "#F0D5B0", label: "Marfim", depth: "muito claro", undertone: "quente" },
  { hex: "#F2DCC7", label: "Nude claro", depth: "muito claro", undertone: "neutra" },
  { hex: "#E8C39E", label: "Bege claro", depth: "claro", undertone: "neutra" },
  { hex: "#D9AE85", label: "Bege dourado", depth: "claro", undertone: "quente" },
  { hex: "#EAC6B0", label: "Bege rosado", depth: "claro", undertone: "fria" },
  { hex: "#BEC1A3", label: "Oliva clara", depth: "claro", undertone: "oliva" },
  { hex: "#D2A679", label: "Areia", depth: "médio", undertone: "quente" },
  { hex: "#C08A5D", label: "Amêndoa", depth: "médio", undertone: "neutra" },
  { hex: "#BE8F68", label: "Bege acastanhado", depth: "médio", undertone: "fria" },
  { hex: "#94997A", label: "Oliva média", depth: "médio", undertone: "oliva" },
  { hex: "#A6743F", label: "Caramelo", depth: "moreno", undertone: "quente" },
  { hex: "#8B5A2B", label: "Canela", depth: "moreno", undertone: "neutra" },
  { hex: "#96633E", label: "Avelã", depth: "moreno", undertone: "fria" },
  { hex: "#6B4226", label: "Café", depth: "escuro", undertone: "fria" },
  { hex: "#4A2C17", label: "Chocolate", depth: "escuro", undertone: "quente" },
  { hex: "#5C3820", label: "Mogno", depth: "escuro", undertone: "neutra" },
  { hex: "#2E1B0F", label: "Ébano", depth: "muito escuro", undertone: "neutra" },
  { hex: "#2B160C", label: "Trufa", depth: "muito escuro", undertone: "quente" },
  { hex: "#241511", label: "Preto azeviche", depth: "muito escuro", undertone: "fria" },
];

// --- Catálogo curado com ofertas reais, checadas manualmente em 29/08/2026 ---
// Fonte: Beleza na Web, Eudora e Océane (páginas de produto linkadas abaixo,
// preço exibido é o valor à vista/no cartão da própria página, sem cupom).
// Não existe API pública estável de busca em tempo real nessas lojas nem no
// Mercado Livre (ver nota no README), então esse catálogo é atualizado sob
// pedido em vez de em tempo real.
const CATALOG_UPDATED_AT = "29 de agosto de 2026";

const PRODUCTS = [
  {
    id: "p1",
    brand: "M·A·C",
    title: "Studio Radiance Luminous Lift NW55 — Corretivo Líquido 11ml",
    price: 48.9,
    original_price: 248.9,
    category: "Corretivo",
    depth: "moreno",
    undertone: "quente",
    hex: "#B48A5C",
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/mac-studio-radiance-luminous-lift-nw55-corretivo-liquido-11ml/",
  },
  {
    id: "p2",
    brand: "Maybelline",
    title: "Fit Me Fresh Tint 10.5 — Base Líquida 30ml",
    price: 21.76,
    original_price: 116.9,
    category: "Base líquida",
    depth: "muito claro",
    undertone: "neutra",
    hex: "#F1DAC0",
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/maybelline/fit-me/",
  },
  {
    id: "p3",
    brand: "Maybelline",
    title: "Fit Me Fresh Tint 12 — Base Líquida 30ml",
    price: 22.9,
    original_price: 116.9,
    category: "Base líquida",
    depth: "claro",
    undertone: "quente",
    hex: "#E7C599",
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/maybelline/fit-me/",
  },
  {
    id: "p4",
    brand: "Bruna Tavares",
    title: "BT Skin L20 — Base Líquida 40ml",
    price: 83.9,
    original_price: 120.0,
    category: "Base líquida",
    depth: "claro",
    undertone: "neutra",
    hex: "#E2C29C",
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/bruna-tavares-bt-skin-l20-base-liquida-40ml/",
  },
  {
    id: "p5",
    brand: "Océane",
    title: "Edition Fair — Corretivo Líquido 15g",
    price: 39.9,
    original_price: 80.0,
    category: "Corretivo",
    depth: "muito claro",
    undertone: "fria",
    hex: "#CCB7A7", // amostrado da foto real do produto
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/oceane-edition-fair-corretivo-liquido-15g/",
  },
  {
    id: "p6",
    brand: "Océane",
    title: "Edition Medium Light — Corretivo Líquido 15g",
    price: 39.9,
    original_price: 80.0,
    category: "Corretivo",
    depth: "claro",
    undertone: "quente",
    hex: "#D8AC80",
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/oceane-edition-medium-light-corretivo-liquido-15g/",
  },
  {
    id: "p7",
    brand: "Océane",
    title: "Edition Light — Corretivo Líquido 15g",
    price: 41.9,
    original_price: 60.9,
    category: "Corretivo",
    depth: "muito claro",
    undertone: "neutra",
    hex: "#ECD1AE",
    store: "Beleza na Web",
    url: "https://www.belezanawebpro.com.br/oceane-edition-light-corretivo-liquido-15g/",
  },
  {
    id: "p8",
    brand: "Revlon",
    title: "ColorStay 24h Pele Mista à Oleosa 220 Natural Beige — Base Líquida 30ml",
    price: 98.9,
    original_price: 179.9,
    category: "Base líquida",
    depth: "médio",
    undertone: "neutra",
    hex: "#C79C70",
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/revlon-colorstay-pele-mista-e-oleosa-base-liquida-30ml/",
  },
  {
    id: "p9",
    brand: "Revlon",
    title: "ColorStay 24h Pele Mista à Oleosa 200 Nude — Base Líquida 30ml",
    price: 139.35,
    original_price: 259.99,
    category: "Base líquida",
    depth: "claro",
    undertone: "neutra",
    hex: "#DEBB8F",
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/mp334379-base-liquida-revlon-colorstay-24-horas-pele-mista-a-oleosa-fps15-200-nude-30ml/",
  },
  {
    id: "p10",
    brand: "Revlon",
    title: "ColorStay 24h Pele Mista à Oleosa 300 Golden Beige — Base Líquida 30ml",
    price: 92.9,
    original_price: 179.9,
    category: "Base líquida",
    depth: "médio",
    undertone: "quente",
    hex: "#CA9A61",
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/mp162278-revlon-colorstay-24-horas-pele-mista-a-oleosa-fps15-300-golden-beige-base-liquida-30ml/",
  },
  {
    id: "p11",
    brand: "Catharine Hill",
    title: "Chill Alta Cobertura AC01 — Base Líquida 30ml",
    price: 55.8,
    original_price: 100.0,
    category: "Base líquida",
    depth: "muito claro",
    undertone: "fria",
    hex: "#EED8C2",
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/catharine-hill-chill-alta-cobertura-ac-01-base-liquida-30ml/",
  },
  {
    id: "p12",
    brand: "Lancôme",
    title: "Teint Idôle Ultra Wear Care & Glow 425C — Base Líquida 30ml",
    price: 313.9,
    original_price: 448.9,
    category: "Base líquida",
    depth: "escuro",
    undertone: "fria",
    hex: "#8A5D3B",
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/lancome-teint-idole-ultra-wear-care-e-glow-425c-base-liquida-30ml/",
  },
  {
    id: "p13",
    brand: "Mari Maria Makeup",
    title: "Velvet Skin Bege Claro 1 — Base e Corretivo 25g",
    price: 59.9,
    original_price: 100.0,
    category: "Base e corretivo",
    depth: "claro",
    undertone: "neutra",
    hex: "#E4C5A0",
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/mari-maria-makeup-velvet-skin-bege-claro-1-base-e-corretivo-25g/",
  },
  {
    id: "p14",
    brand: "Bruna Tavares",
    title: "BT Skin D50 — Base Líquida 40ml",
    price: 77.9,
    original_price: 86.9,
    category: "Base líquida",
    depth: "escuro",
    undertone: "quente",
    hex: "#480E05", // amostrado da foto real do produto
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/bruna-tavares-bt-skin-d50-base-liquida-40ml/",
  },
  {
    id: "p15",
    brand: "Bruna Tavares",
    title: "BT Skin D60 — Base Líquida 40ml",
    price: 77.9,
    original_price: 100.0,
    category: "Base líquida",
    depth: "muito escuro",
    undertone: "quente",
    hex: "#3A1E1A", // amostrado da foto real do produto
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/bruna-tavares-bt-skin-d60-base-liquida-40ml/",
  },
  {
    id: "p16",
    brand: "M·A·C",
    title: "Studio Fix Fluid Foundation FPS 15 NC25 — Base Líquida 30ml",
    price: 193.9,
    original_price: 298.9,
    category: "Base líquida",
    depth: "claro",
    undertone: "quente",
    hex: "#DDA875",
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/mac-studio-fix-fluid-foundation-fps-15-nc25-base-liquida-30ml/",
  },
  {
    id: "p17",
    brand: "M·A·C",
    title: "Studio Fix Fluid Foundation FPS 15 N6 — Base Líquida 30ml",
    price: 253.9,
    original_price: 298.9,
    category: "Base líquida",
    depth: "médio",
    undertone: "neutra",
    hex: "#C89972",
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/mac-studio-fix-fluid-foundation-fps-15-n6-base-liquida-30ml/",
  },
  {
    id: "p18",
    brand: "Maybelline",
    title: "Superstay Active Wear 30H 120 Classic Ivory — Base Líquida 30ml",
    price: 121.9,
    original_price: 147.9,
    category: "Base líquida",
    depth: "muito claro",
    undertone: "fria",
    hex: "#F3DBC5",
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/maybelline-superstay-active-wear-30h-120-classic-ivory-base-liquida-30ml/",
  },
  {
    id: "p19",
    brand: "Lancôme",
    title: "Teint Idole Ultra Wear Cor 210C — Base Líquida Matte 30ml",
    price: 400.9,
    original_price: 448.9,
    category: "Base líquida",
    depth: "claro",
    undertone: "fria",
    hex: "#EAC6A8",
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/lancome-teint-idole-ultra-wear-foundation-210c-base-liquida-30ml/",
  },
  {
    id: "p20",
    brand: "Lancôme",
    title: "Teint Idole Ultra Wear Cor 350N — Base Líquida Matte 30ml",
    price: 403.9,
    original_price: 448.9,
    category: "Base líquida",
    depth: "médio",
    undertone: "neutra",
    hex: "#C99B72",
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/lancome-teint-idole-ultra-wear-foundation-350n-base-liquida-30ml/",
  },
  {
    id: "p21",
    brand: "Lancôme",
    title: "Teint Idole Ultra Wear Cor 430C — Base Líquida Matte 30ml",
    price: 399.9,
    original_price: 448.9,
    category: "Base líquida",
    depth: "moreno",
    undertone: "fria",
    hex: "#9C6B45",
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/lancome-teint-idole-ultra-wear-foundation-430c-base-liquida-30ml/",
  },
  {
    id: "p22",
    brand: "Shiseido",
    title: "Synchro Skin Radiant Lifting Foundation 220 — Base Líquida 30ml",
    price: 341.9,
    original_price: 409.9,
    category: "Base líquida",
    depth: "claro",
    undertone: "neutra",
    hex: "#E6C7A0",
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/shiseido-synchro-skin-radiant-lifting-foundation-220-base-liquida-30ml/",
  },
  {
    id: "p23",
    brand: "Catharine Hill",
    title: "Chill Média Cobertura MC02 — Base Líquida 30ml",
    price: 45.9,
    original_price: 54.9,
    category: "Base líquida",
    depth: "claro",
    undertone: "neutra",
    hex: "#E0BD96",
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/catharine-hill-chill-media-cobertura-mc02-base-liquida-30ml/",
  },
  {
    id: "p24",
    brand: "Catharine Hill",
    title: "Chill Média Cobertura MC04 — Base Líquida 30ml",
    price: 45.9,
    original_price: 54.9,
    category: "Base líquida",
    depth: "médio",
    undertone: "quente",
    hex: "#C99968",
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/catharine-hill-chill-media-cobertura-mc04-base-liquida-30ml/",
  },
  {
    id: "p25",
    brand: "Catharine Hill",
    title: "Angel Wings By Pri Lessa A5 — Base Líquida 40ml",
    price: 72.9,
    original_price: 86.9,
    category: "Base líquida",
    depth: "moreno",
    undertone: "quente",
    hex: "#A97645",
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/catharine-hill-angel-wings-by-pri-lessa-a5-base-liquida-40ml/",
  },
  {
    id: "p26",
    brand: "Bruna Tavares",
    title: "BT Skin L10 — Base Líquida 40ml",
    price: 82.5,
    original_price: 120.0,
    category: "Base líquida",
    depth: "muito claro",
    undertone: "neutra",
    hex: "#F0DCC0",
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/bruna-tavares-bt-skin-l10-base-liquida-40ml/",
  },
  {
    id: "p27",
    brand: "Catharine Hill",
    title: "Light — Corretivo Líquido 3,6ml",
    price: 28.9,
    original_price: 34.9,
    category: "Corretivo",
    depth: "muito claro",
    undertone: "neutra",
    hex: "#F2DEC7",
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/catharine-hill-light-corretivo-liquido-36ml/",
  },
  {
    id: "p28",
    brand: "Bruna Tavares",
    title: "BT Multicover L20 — Corretivo Líquido 8g",
    price: 50.9,
    original_price: 66.9,
    category: "Corretivo",
    depth: "claro",
    undertone: "neutra",
    hex: "#E9CBA5",
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/bruna-tavares-bt-multicover-l20-corretivo-liquido-8g/",
  },
  {
    id: "p29",
    brand: "Bruna Tavares",
    title: "BT Multicover M10 — Corretivo Líquido 8g",
    price: 50.9,
    original_price: 66.9,
    category: "Corretivo",
    depth: "médio",
    undertone: "quente",
    hex: "#D2A379",
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/bruna-tavares-bt-multicover-m10-corretivo-liquido-8g/",
  },
  {
    id: "p30",
    brand: "Catharine Hill",
    title: "Pri Lessa Angel Wings Camuflagem A1 — Corretivo Líquido 8ml",
    price: 45.9,
    original_price: 51.9,
    category: "Corretivo",
    depth: "muito claro",
    undertone: "quente",
    hex: "#F0D3AC",
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/catharine-hill-pri-lessa-angel-wings-camuflagem-a1-corretivo-liquido-8ml/",
  },
  {
    id: "p31",
    brand: "Catharine Hill",
    title: "Pri Lessa Angel Wings Camuflagem A4 — Corretivo Líquido 8ml",
    price: 44.9,
    original_price: 51.9,
    category: "Corretivo",
    depth: "moreno",
    undertone: "quente",
    hex: "#B37C4C",
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/catharine-hill-pri-lessa-angel-wings-camuflagem-a4-corretivo-liquido-8ml/",
  },
  {
    id: "p32",
    brand: "M·A·C",
    title: "Studio Radiance Luminous Lift NW20 — Corretivo Líquido 11ml",
    price: 214.9,
    original_price: 248.9,
    category: "Corretivo",
    depth: "claro",
    undertone: "fria",
    hex: "#E4C0A0",
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/mac-studio-radiance-luminous-lift-nw20-corretivo-liquido-11ml/",
  },
  {
    id: "p33",
    brand: "Maybelline",
    title: "Instant Age Rewind Eraser 100 Ivory — Corretivo Líquido 5,9ml",
    price: 112.9,
    original_price: 118.9,
    category: "Corretivo",
    depth: "muito claro",
    undertone: "fria",
    hex: "#F1DCC7",
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/maybelline-instant-age-rewind-eraser-100-ivory-corretivo-liquido-59ml/",
  },
  {
    id: "p34",
    brand: "Maybelline",
    title: "Instant Age Rewind Eraser 122 Sand — Corretivo Líquido 5,9ml",
    price: 114.9,
    original_price: 118.9,
    category: "Corretivo",
    depth: "médio",
    undertone: "quente",
    hex: "#CDA077",
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/maybelline-instant-age-rewind-eraser-122-sand-corretivo-liquido-59ml/",
  },
  {
    id: "p35",
    brand: "Maybelline",
    title: "NY Instant Age Rewind Eraser Cor 150 — Corretivo Líquido 6ml",
    price: 91.9,
    original_price: 118.9,
    category: "Corretivo",
    depth: "escuro",
    undertone: "quente",
    hex: "#7A4B2C",
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/maybelline-ny-instant-age-rewind-eraser-cor-150-corretivo-liquido-6ml/",
  },
  {
    id: "p36",
    brand: "Lancôme",
    title: "Teint Idole Ultra Wear All Over Concealer 330 Bisque — Corretivo Líquido 13ml",
    price: 282.9,
    original_price: 318.9,
    category: "Corretivo",
    depth: "médio",
    undertone: "quente",
    hex: "#CB9F70",
    store: "Beleza na Web",
    url: "https://www.belezanaweb.com.br/lancome-teint-idole-ultra-wear-all-over-concealer-330-bisque-corretivo-liquido-13ml/",
  },
];

const CATEGORIES = ["Todos", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];

// --- Conversão de cor: sRGB → CIELAB, base para o cálculo de distância ---
// perceptual usada tanto no rótulo de tom (profundidade) quanto no match de
// produtos (Delta-E). Convertendo pra Lab porque distância euclidiana em RGB
// não corresponde bem à percepção humana de cor — Lab é perceptualmente mais
// uniforme, então "distância pequena em Lab" ≈ "olho humano vê como parecido".
function hexToRgbArr(hex) {
  const clean = hex.replace("#", "");
  return [
    parseInt(clean.substring(0, 2), 16),
    parseInt(clean.substring(2, 4), 16),
    parseInt(clean.substring(4, 6), 16),
  ];
}

function rgbToLab(r, g, b) {
  let [rl, gl, bl] = [r, g, b].map((v) => {
    v = v / 255;
    return v > 0.04045 ? Math.pow((v + 0.055) / 1.055, 2.4) : v / 12.92;
  });

  const x = (rl * 0.4124 + gl * 0.3576 + bl * 0.1805) / 0.95047;
  const y = (rl * 0.2126 + gl * 0.7152 + bl * 0.0722) / 1.0;
  const z = (rl * 0.0193 + gl * 0.1192 + bl * 0.9505) / 1.08883;

  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const fx = f(x);
  const fy = f(y);
  const fz = f(z);

  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

function classifyTone(r, g, b) {
  // Profundidade calculada a partir do L de Lab (mesma conversão usada no
  // match), em vez da luminância bruta de RGB — mais fiel à forma como o
  // olho humano percebe "claro vs escuro".
  const [L] = rgbToLab(r, g, b);

  let depth;
  if (L > 82) depth = "muito claro";
  else if (L > 68) depth = "claro";
  else if (L > 54) depth = "médio";
  else if (L > 38) depth = "moreno";
  else if (L > 22) depth = "escuro";
  else depth = "muito escuro";

  // Subtom: quente/fria a partir do contraste vermelho-azul (heurística
  // clássica), com uma checagem extra para subtom oliva — quando o canal
  // verde se destaca sobre os outros dois, típico de peles com reflexo
  // esverdeado/acinzentado que nem "quente" nem "fria" descrevem bem.
  const warmth = r - b;
  let undertone;
  if (g - Math.max(r, b) > 3) undertone = "oliva";
  else if (warmth > 28) undertone = "quente";
  else if (warmth < 12) undertone = "fria";
  else undertone = "neutra";

  return { depth, undertone };
}

// --- Match por cor real: CIELAB + Delta-E CIEDE2000 ---
// CIEDE2000 é a fórmula de diferença de cor mais próxima da percepção humana
// entre as padronizadas pela CIE — mais precisa que a distância euclidiana
// simples em Lab, principalmente para tons de pele (baixa luminância e baixa
// saturação), onde a euclidiana simples tende a exagerar diferenças de matiz.
function deltaE2000(labA, labB) {
  const [L1, a1, b1] = labA;
  const [L2, a2, b2] = labB;

  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const Cbar = (C1 + C2) / 2;
  const Cbar7 = Math.pow(Cbar, 7);
  const G = 0.5 * (1 - Math.sqrt(Cbar7 / (Cbar7 + Math.pow(25, 7))));

  const a1p = a1 * (1 + G);
  const a2p = a2 * (1 + G);
  const C1p = Math.sqrt(a1p * a1p + b1 * b1);
  const C2p = Math.sqrt(a2p * a2p + b2 * b2);

  const h1p = (Math.atan2(b1, a1p) * 180) / Math.PI;
  const h2p = (Math.atan2(b2, a2p) * 180) / Math.PI;
  const h1pn = h1p < 0 ? h1p + 360 : h1p;
  const h2pn = h2p < 0 ? h2p + 360 : h2p;

  const dLp = L2 - L1;
  const dCp = C2p - C1p;

  let dhp;
  if (C1p * C2p === 0) dhp = 0;
  else if (Math.abs(h2pn - h1pn) <= 180) dhp = h2pn - h1pn;
  else if (h2pn - h1pn > 180) dhp = h2pn - h1pn - 360;
  else dhp = h2pn - h1pn + 360;
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp * Math.PI) / 360);

  const Lbarp = (L1 + L2) / 2;
  const Cbarp = (C1p + C2p) / 2;

  let hbarp;
  if (C1p * C2p === 0) hbarp = h1pn + h2pn;
  else if (Math.abs(h1pn - h2pn) <= 180) hbarp = (h1pn + h2pn) / 2;
  else if (h1pn + h2pn < 360) hbarp = (h1pn + h2pn + 360) / 2;
  else hbarp = (h1pn + h2pn - 360) / 2;

  const T =
    1 -
    0.17 * Math.cos(((hbarp - 30) * Math.PI) / 180) +
    0.24 * Math.cos((2 * hbarp * Math.PI) / 180) +
    0.32 * Math.cos(((3 * hbarp + 6) * Math.PI) / 180) -
    0.2 * Math.cos(((4 * hbarp - 63) * Math.PI) / 180);

  const dTheta = 30 * Math.exp(-Math.pow((hbarp - 275) / 25, 2));
  const Cbarp7 = Math.pow(Cbarp, 7);
  const Rc = 2 * Math.sqrt(Cbarp7 / (Cbarp7 + Math.pow(25, 7)));
  const Sl = 1 + (0.015 * Math.pow(Lbarp - 50, 2)) / Math.sqrt(20 + Math.pow(Lbarp - 50, 2));
  const Sc = 1 + 0.045 * Cbarp;
  const Sh = 1 + 0.015 * Cbarp * T;
  const Rt = -Math.sin((2 * dTheta * Math.PI) / 180) * Rc;

  return Math.sqrt(
    Math.pow(dLp / Sl, 2) +
      Math.pow(dCp / Sc, 2) +
      Math.pow(dHp / Sh, 2) +
      Rt * (dCp / Sc) * (dHp / Sh)
  );
}

function deltaE(hexA, hexB) {
  const labA = rgbToLab(...hexToRgbArr(hexA));
  const labB = rgbToLab(...hexToRgbArr(hexB));
  return deltaE2000(labA, labB);
}

// Faixas calibradas empiricamente sobre o catálogo: Delta-E 2000 abaixo de 3
// já é imperceptível a olho nu; até 6, a diferença só aparece em comparação
// direta lado a lado; até 11, ainda é uma opção segura para a maioria das
// peles. Acima disso o tom já é visivelmente diferente.
function matchLabel(distance) {
  if (distance < 3) return { label: "combina perfeitamente", tier: 3 };
  if (distance < 6) return { label: "combina muito bem", tier: 2 };
  if (distance < 11) return { label: "combina bem", tier: 1 };
  return null;
}

export default function App() {
  const [inputMode, setInputMode] = useState("swatch");
  const [selectedTone, setSelectedTone] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [sampledHex, setSampledHex] = useState(null);
  const [step, setStep] = useState("input");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  const [imgLoaded, setImgLoaded] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSampledHex(null);
    setSelectedTone(null);
    setImgLoaded(false);
    setError(null);

    // Usamos FileReader (Data URL em base64) em vez de URL.createObjectURL:
    // URLs blob: costumam ser bloqueadas dentro do sandbox de artifacts do
    // Claude.ai, o que fazia a prévia da foto nunca aparecer.
    const reader = new FileReader();
    reader.onload = () => setPhotoUrl(reader.result);
    reader.onerror = () => setError("Não foi possível ler esse arquivo. Tente outra foto.");
    reader.readAsDataURL(file);
  };

  const handleCanvasClick = useCallback((e) => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    // Se a imagem ainda não terminou de carregar, naturalWidth/Height vêm
    // zerados e o clique não fazia nada. Agora avisamos em vez de falhar
    // silenciosamente.
    if (!img.complete || img.naturalWidth === 0) {
      setError("A imagem ainda está carregando, espera um instante e toque de novo.");
      return;
    }

    const rect = img.getBoundingClientRect();
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;
    const x = Math.min(img.naturalWidth - 1, Math.max(0, Math.round((e.clientX - rect.left) * scaleX)));
    const y = Math.min(img.naturalHeight - 1, Math.max(0, Math.round((e.clientY - rect.top) * scaleY)));

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    try {
      const data = ctx.getImageData(x, y, 1, 1).data;
      const [r, g, b] = data;
      const hex = "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
      setSampledHex(hex);
      const { depth, undertone } = classifyTone(r, g, b);
      setSelectedTone({ hex, label: "Seu tom", depth, undertone });
      setError(null);
    } catch (err) {
      setError("Não foi possível ler a imagem. Tente outra foto.");
    }
  }, []);

  const runSearch = () => {
    if (!selectedTone) return;
    setStep("results");
    setLoading(true);
    setError(null);

    // Catálogo local e curado — sem chamada de rede, então não depende de
    // nenhuma API externa instável (ver nota no README sobre o /sites/MLB/search
    // do Mercado Livre retornando 403 mesmo com autenticação).
    window.setTimeout(() => {
      const scored = PRODUCTS.map((item) => {
        const discountPct = Math.round(100 - (item.price / item.original_price) * 100);
        const distance = deltaE(selectedTone.hex, item.hex);
        const match = matchLabel(distance);
        return { ...item, discountPct, distance, matchTier: match ? match.tier : 0, matchLabel: match?.label };
      });

      // Ordena primeiro por quão perto a cor do produto está do tom
      // selecionado (menor distância = mais parecido) e, só entre produtos
      // com distância parecida, prioriza o maior desconto.
      scored.sort((a, b) => a.distance - b.distance || b.discountPct - a.discountPct);
      setProducts(scored);
      setLoading(false);
    }, 350);
  };

  const reset = () => {
    setStep("input");
    setProducts([]);
    setError(null);
  };

  return (
    <div style={{ background: COLORS.paper, minHeight: "100%", fontFamily: "'Work Sans', sans-serif", color: COLORS.ink }}>
      <style>{FONT_IMPORT}</style>

      {/* header */}
      <header style={{ borderBottom: `1px solid ${COLORS.line}`, padding: "28px 24px 24px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
            <h1
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 700,
                fontSize: 30,
                letterSpacing: "-0.01em",
                margin: 0,
              }}
            >
              Tom Certo
            </h1>
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                color: COLORS.gold,
                background: COLORS.goldBg,
                padding: "2px 8px",
                borderRadius: 3,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              catálogo curado · sem cadastro
            </span>
          </div>
          <p style={{ marginTop: 8, color: COLORS.inkSoft, fontSize: 15, maxWidth: 580, lineHeight: 1.5 }}>
            Encontre bases e corretivos com desconto real, combinados com o seu tom de pele por um algoritmo de
            diferença de cor perceptual (CIEDE2000) — do mesmo jeito que o Findation faz para maquiagem.
          </p>
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginTop: 16 }}>
            <TrustStat value={PRODUCTS.length} label="produtos no catálogo" />
            <TrustStat value={PRESET_TONES.length} label="tons de pele" />
            <TrustStat value={new Set(PRODUCTS.map((p) => p.brand)).size} label="marcas" />
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 980, margin: "0 auto", padding: "32px 24px 0" }}>
        {step === "input" && (
          <InputStep
            inputMode={inputMode}
            setInputMode={setInputMode}
            selectedTone={selectedTone}
            setSelectedTone={setSelectedTone}
            photoUrl={photoUrl}
            handleImageUpload={handleImageUpload}
            handleCanvasClick={handleCanvasClick}
            sampledHex={sampledHex}
            imgRef={imgRef}
            canvasRef={canvasRef}
            runSearch={runSearch}
            error={error}
            imgLoaded={imgLoaded}
            setImgLoaded={setImgLoaded}
          />
        )}

        {step === "results" && (
          <ResultsStep
            selectedTone={selectedTone}
            loading={loading}
            error={error}
            products={products}
            reset={reset}
            runSearch={runSearch}
          />
        )}
      </main>

      {step === "input" && (
        <>
          <HowItWorks />
          <Faq />
        </>
      )}

      <SiteFooter />
    </div>
  );
}

function TrustStat({ value, label }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
      <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 18, color: COLORS.primary }}>
        {value}+
      </span>
      <span style={{ fontSize: 12.5, color: COLORS.inkSoft }}>{label}</span>
    </div>
  );
}

function ToneSwatchStrip({ selectedTone, onSelect }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      {PRESET_TONES.map((tone) => {
        const active = selectedTone?.hex === tone.hex;
        return (
          <button
            key={tone.hex}
            onClick={() => onSelect(tone)}
            aria-pressed={active}
            aria-label={`Tom ${tone.label}, ${tone.depth}, subtom ${tone.undertone}`}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              width: 74,
            }}
          >
            <span
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: tone.hex,
                border: active ? `3px solid ${COLORS.primary}` : `2px solid ${COLORS.line}`,
                boxShadow: active ? `0 0 0 3px ${COLORS.primarySoft}` : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "box-shadow 0.15s ease",
              }}
            >
              {active && <Check size={16} color="#fff" style={{ filter: "drop-shadow(0 0 1px rgba(0,0,0,0.5))" }} />}
            </span>
            <span style={{ fontSize: 11, color: COLORS.inkSoft, textAlign: "center", lineHeight: 1.2 }}>
              {tone.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function InputStep({
  inputMode,
  setInputMode,
  selectedTone,
  setSelectedTone,
  photoUrl,
  handleImageUpload,
  handleCanvasClick,
  sampledHex,
  imgRef,
  canvasRef,
  runSearch,
  error,
  imgLoaded,
  setImgLoaded,
}) {
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[
          { id: "swatch", label: "Escolher tom" },
          { id: "photo", label: "Usar foto" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setInputMode(tab.id)}
            style={{
              fontFamily: "'Work Sans', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              padding: "8px 16px",
              borderRadius: 20,
              border: `1px solid ${inputMode === tab.id ? COLORS.primary : COLORS.line}`,
              background: inputMode === tab.id ? COLORS.primary : "transparent",
              color: inputMode === tab.id ? "#fff" : COLORS.inkSoft,
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 14, padding: 24 }}>
        {inputMode === "swatch" ? (
          <>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600, margin: "0 0 4px" }}>
              Qual tom mais parece com o seu?
            </h2>
            <p style={{ color: COLORS.inkSoft, fontSize: 13, margin: "0 0 18px" }}>
              Toque no círculo mais próximo da sua pele, de preferência sob luz natural.
            </p>
            <ToneSwatchStrip selectedTone={selectedTone} onSelect={setSelectedTone} />
          </>
        ) : (
          <>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600, margin: "0 0 4px" }}>
              Envie uma foto e toque na sua pele
            </h2>
            <p style={{ color: COLORS.inkSoft, fontSize: 13, margin: "0 0 18px" }}>
              Uma foto com luz natural, sem filtro, funciona melhor. Toque no rosto para captar o tom.
            </p>

            {!photoUrl ? (
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  border: `1.5px dashed ${COLORS.line}`,
                  borderRadius: 12,
                  padding: "40px 20px",
                  cursor: "pointer",
                  color: COLORS.inkSoft,
                }}
              >
                <Upload size={22} />
                <span style={{ fontSize: 13 }}>Escolher imagem</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
              </label>
            ) : (
              <div>
                <div style={{ position: "relative", display: "inline-block", maxWidth: "100%" }}>
                  <img
                    ref={imgRef}
                    src={photoUrl}
                    onLoad={() => setImgLoaded(true)}
                    onError={() => setImgLoaded(false)}
                    onClick={handleCanvasClick}
                    alt="Foto enviada pelo usuário para amostragem do tom de pele"
                    style={{
                      maxWidth: "100%",
                      maxHeight: 360,
                      borderRadius: 10,
                      cursor: "crosshair",
                      display: "block",
                      opacity: imgLoaded ? 1 : 0.4,
                      transition: "opacity 0.15s ease",
                    }}
                  />
                  {!imgLoaded && (
                    <span
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: 12,
                        color: COLORS.inkSoft,
                      }}
                    >
                      Carregando…
                    </span>
                  )}
                </div>
                <canvas ref={canvasRef} style={{ display: "none" }} />
                {error && (
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12, color: "#7A2E2E", fontSize: 13 }}>
                    <AlertCircle size={15} style={{ flexShrink: 0 }} />
                    {error}
                  </div>
                )}
                {sampledHex && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
                    <span
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: sampledHex,
                        border: `2px solid ${COLORS.line}`,
                      }}
                    />
                    <span style={{ fontSize: 13, color: COLORS.inkSoft }}>
                      Tom captado — {selectedTone?.depth}, undertone {selectedTone?.undertone}
                    </span>
                  </div>
                )}
                <label
                  style={{
                    display: "inline-block",
                    marginTop: 12,
                    fontSize: 12,
                    color: COLORS.primary,
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Trocar foto
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                </label>
              </div>
            )}
          </>
        )}
      </div>

      <button
        onClick={runSearch}
        disabled={!selectedTone}
        style={{
          marginTop: 24,
          width: "100%",
          padding: "14px 20px",
          borderRadius: 10,
          border: "none",
          background: selectedTone ? COLORS.primary : COLORS.line,
          color: selectedTone ? "#fff" : COLORS.inkSoft,
          fontFamily: "'Work Sans', sans-serif",
          fontWeight: 600,
          fontSize: 15,
          cursor: selectedTone ? "pointer" : "not-allowed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          transition: "background 0.15s ease",
        }}
      >
        <Sparkles size={17} />
        Buscar ofertas para o meu tom
      </button>
    </div>
  );
}

function ResultsStep({ selectedTone, loading, error, products, reset, runSearch }) {
  const [category, setCategory] = useState("Todos");
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(
    () => (category === "Todos" ? products : products.filter((p) => p.category === category)),
    [products, category]
  );
  const matched = filtered.filter((p) => p.matchTier > 0);
  const unmatched = filtered.filter((p) => p.matchTier === 0);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: selectedTone?.hex,
              border: `2px solid ${COLORS.line}`,
              flexShrink: 0,
            }}
          />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>
              {selectedTone?.depth} · undertone {selectedTone?.undertone}
            </div>
            <div style={{ fontSize: 12, color: COLORS.inkSoft }}>
              Catálogo checado manualmente em {CATALOG_UPDATED_AT}
            </div>
          </div>
        </div>
        <button
          onClick={reset}
          style={{
            fontSize: 13,
            color: COLORS.primary,
            background: "none",
            border: `1px solid ${COLORS.primary}`,
            borderRadius: 20,
            padding: "7px 14px",
            cursor: "pointer",
          }}
        >
          Trocar tom
        </button>
      </div>

      {!loading && !error && products.length > 0 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                padding: "6px 13px",
                borderRadius: 16,
                border: `1px solid ${category === c ? COLORS.primary : COLORS.line}`,
                background: category === c ? COLORS.primarySoft : "transparent",
                color: category === c ? COLORS.primary : COLORS.inkSoft,
                cursor: "pointer",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0", color: COLORS.inkSoft }}>
          <RefreshCw size={22} className="spin" style={{ marginBottom: 10 }} />
          <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <div style={{ fontSize: 14 }}>Combinando ofertas com seu tom…</div>
        </div>
      )}

      {!loading && error && (
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
            background: "#FBECEC",
            border: "1px solid #E9C7C7",
            borderRadius: 10,
            padding: 16,
            color: "#7A2E2E",
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 14 }}>
            {error}
            <div style={{ marginTop: 10 }}>
              <button
                onClick={runSearch}
                style={{
                  fontSize: 13,
                  background: "#7A2E2E",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "7px 14px",
                  cursor: "pointer",
                }}
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: COLORS.inkSoft, fontSize: 14 }}>
          Nenhum produto encontrado agora. Tente novamente em instantes.
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          {matched.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 16,
              }}
            >
              {matched.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 0", color: COLORS.inkSoft, fontSize: 14 }}>
              Nenhum produto dessa categoria combina de perto com esse tom. Veja as opções mais próximas abaixo.
            </div>
          )}

          {unmatched.length > 0 && (
            <div style={{ marginTop: 28 }}>
              <button
                onClick={() => setShowAll((v) => !v)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  margin: "0 auto",
                  background: "none",
                  border: "none",
                  color: COLORS.inkSoft,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: "6px 4px",
                }}
              >
                <ChevronDown size={16} style={{ transform: showAll ? "rotate(180deg)" : "none", transition: "transform 0.15s ease" }} />
                {showAll ? "Ocultar" : `Ver mais ${unmatched.length} produto${unmatched.length > 1 ? "s" : ""} fora do seu tom`}
              </button>
              {showAll && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: 16,
                    marginTop: 16,
                    opacity: 0.75,
                  }}
                >
                  {unmatched.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ProductCard({ product }) {
  const hasDiscount = product.discountPct > 0;

  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      style={{
        background: COLORS.card,
        border: `1px solid ${COLORS.line}`,
        borderRadius: 12,
        overflow: "hidden",
        textDecoration: "none",
        color: COLORS.ink,
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.12s ease, box-shadow 0.12s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 6px 18px rgba(42,26,30,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          position: "relative",
          background: "#F3ECE4",
          aspectRatio: "4 / 3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {PRODUCT_IMAGES[product.id] ? (
          <img
            src={PRODUCT_IMAGES[product.id]}
            alt={`${product.brand} ${product.title}`}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          // Sem foto real disponível — usa a cor real do tom (hex) como
          // placeholder, em vez de deixar um <img> quebrado.
          <div
            style={{
              width: "100%",
              height: "100%",
              background: `linear-gradient(135deg, ${product.hex} 0%, ${COLORS.paper} 140%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 26,
                fontWeight: 600,
                color: "rgba(255,255,255,0.9)",
                textShadow: "0 1px 3px rgba(0,0,0,0.3)",
              }}
            >
              {product.brand[0]}
            </span>
          </div>
        )}
        {hasDiscount && (
          <span
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              background: COLORS.primary,
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              padding: "3px 7px",
              borderRadius: 5,
              fontFamily: "'IBM Plex Mono', monospace",
            }}
          >
            -{product.discountPct}%
          </span>
        )}
        {product.matchTier === 3 && (
          <span
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: COLORS.primary,
              color: "#fff",
              fontSize: 10,
              fontWeight: 600,
              padding: "3px 7px",
              borderRadius: 5,
              textTransform: "uppercase",
              letterSpacing: "0.03em",
            }}
          >
            combina perfeitamente
          </span>
        )}
        {product.matchTier === 2 && (
          <span
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: COLORS.gold,
              color: "#fff",
              fontSize: 10,
              fontWeight: 600,
              padding: "3px 7px",
              borderRadius: 5,
              textTransform: "uppercase",
              letterSpacing: "0.03em",
            }}
          >
            combina muito bem
          </span>
        )}
        {product.matchTier === 1 && (
          <span
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: COLORS.goldBg,
              color: COLORS.gold,
              fontSize: 10,
              fontWeight: 600,
              padding: "3px 7px",
              borderRadius: 5,
              textTransform: "uppercase",
              letterSpacing: "0.03em",
            }}
          >
            combina bem
          </span>
        )}
      </div>
      <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        <span
          style={{
            fontSize: 10,
            color: COLORS.gold,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            fontWeight: 600,
          }}
        >
          {product.category} · {product.store}
        </span>
        <span style={{ fontSize: 13, lineHeight: 1.3, fontWeight: 500 }}>
          <strong>{product.brand}</strong> {product.title}
        </span>
        <div style={{ marginTop: "auto", display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, fontWeight: 600 }}>
            R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </span>
          {hasDiscount && (
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 12,
                color: COLORS.inkSoft,
                textDecoration: "line-through",
              }}
            >
              R$ {product.original_price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: COLORS.inkSoft, marginTop: 2 }}>
          <ExternalLink size={11} /> ver em {product.store}
        </div>
      </div>
    </a>
  );
}

function HowItWorks() {
  const steps = [
    {
      title: "1. Escolha seu tom",
      text: "Toque na paleta com 20 tons ou envie uma foto com luz natural e toque na própria pele para captar a cor exata.",
    },
    {
      title: "2. O algoritmo compara cores de verdade",
      text: "Cada tom vira uma coordenada em CIELAB e é comparado à cor real de cada produto usando Delta-E CIEDE2000 — a mesma métrica usada em laboratórios de cor.",
    },
    {
      title: "3. Veja o que combina, com desconto",
      text: "Os resultados aparecem ordenados por compatibilidade de cor e, entre tons parecidos, pelo maior desconto — com link direto pra página do produto na loja.",
    },
  ];

  return (
    <section aria-labelledby="como-funciona" style={{ maxWidth: 980, margin: "56px auto 0", padding: "0 24px" }}>
      <h2
        id="como-funciona"
        style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600, margin: "0 0 20px" }}
      >
        Como funciona
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
        {steps.map((s) => (
          <div key={s.title} style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: 18 }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 15, marginBottom: 6, color: COLORS.primary }}>
              {s.title}
            </div>
            <p style={{ fontSize: 13, color: COLORS.inkSoft, lineHeight: 1.55, margin: 0 }}>{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const FAQ_ITEMS = [
  {
    q: "Como o Tom Certo encontra o produto certo para minha pele?",
    a: "Você escolhe um tom em uma paleta com 20 opções ou envia uma foto e toca na própria pele. O app converte essa cor para o espaço CIELAB e calcula a diferença perceptual (Delta-E CIEDE2000) entre ela e a cor real de cada produto do catálogo, exibindo primeiro quem combina melhor.",
  },
  {
    q: "As ofertas mostradas são atualizadas em tempo real?",
    a: "Não. O catálogo é curado e checado manualmente em lojas como Beleza na Web, Océane e Eudora, com a data da última checagem sempre exibida na tela de resultados. Preços e disponibilidade podem mudar entre uma checagem e outra.",
  },
  {
    q: "Preciso me cadastrar para usar o Tom Certo?",
    a: "Não. Não é necessário criar conta, enviar e-mail ou senha. Basta escolher o tom e ver os resultados.",
  },
  {
    q: "A foto que eu envio fica salva em algum servidor?",
    a: "Não. A leitura de cor acontece inteiramente no seu navegador, em um <canvas> local — a imagem não é enviada para nenhum servidor.",
  },
];

function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section
      aria-labelledby="faq"
      style={{ maxWidth: 980, margin: "40px auto 0", padding: "0 24px" }}
    >
      <h2 id="faq" style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600, margin: "0 0 20px" }}>
        Perguntas frequentes
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {FAQ_ITEMS.map((item, i) => {
          const open = openIndex === i;
          return (
            <div key={item.q} style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, borderRadius: 10, overflow: "hidden" }}>
              <button
                onClick={() => setOpenIndex(open ? null : i)}
                aria-expanded={open}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  background: "none",
                  border: "none",
                  padding: "14px 16px",
                  fontSize: 14,
                  fontWeight: 600,
                  textAlign: "left",
                  cursor: "pointer",
                  color: COLORS.ink,
                }}
              >
                {item.q}
                <ChevronDown size={16} style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s ease" }} />
              </button>
              {open && (
                <p style={{ margin: 0, padding: "0 16px 16px", fontSize: 13.5, color: COLORS.inkSoft, lineHeight: 1.6 }}>
                  {item.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer style={{ borderTop: `1px solid ${COLORS.line}`, marginTop: 56 }}>
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: "24px 24px 40px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, color: COLORS.inkSoft, fontSize: 12.5, lineHeight: 1.6 }}>
          <ShieldCheck size={15} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>
            O Tom Certo não vende produtos diretamente. Os links levam à página do produto na loja parceira e podem
            incluir códigos de afiliado ou anúncios — isso não altera o preço que você paga.
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, color: COLORS.inkSoft, fontSize: 12.5, lineHeight: 1.6 }}>
          <Info size={15} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>Leitura de foto 100% local no navegador — nenhuma imagem é enviada a servidores.</span>
        </div>
        <div style={{ fontSize: 12, color: COLORS.inkSoft, opacity: 0.75, marginTop: 8 }}>
          © {new Date().getFullYear()} Tom Certo.
        </div>
      </div>
    </footer>
  );
}
