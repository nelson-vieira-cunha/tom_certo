import { useState, useRef, useCallback } from "react";
import { Upload, Camera, ExternalLink, RefreshCw, Sparkles, AlertCircle, Check } from "lucide-react";
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
};

// -- preset skin-tone swatches (depth + undertone), used for one-tap matching --
const PRESET_TONES = [
  { hex: "#F5DCC8", label: "Porcelana", depth: "muito claro", undertone: "fria" },
  { hex: "#F0D5B0", label: "Marfim", depth: "muito claro", undertone: "quente" },
  { hex: "#E8C39E", label: "Bege claro", depth: "claro", undertone: "neutra" },
  { hex: "#D9AE85", label: "Bege dourado", depth: "claro", undertone: "quente" },
  { hex: "#D2A679", label: "Areia", depth: "médio", undertone: "quente" },
  { hex: "#C08A5D", label: "Amêndoa", depth: "médio", undertone: "neutra" },
  { hex: "#A6743F", label: "Caramelo", depth: "moreno", undertone: "quente" },
  { hex: "#8B5A2B", label: "Canela", depth: "moreno", undertone: "neutra" },
  { hex: "#6B4226", label: "Café", depth: "escuro", undertone: "fria" },
  { hex: "#4A2C17", label: "Chocolate", depth: "escuro", undertone: "quente" },
  { hex: "#2E1B0F", label: "Ébano", depth: "muito escuro", undertone: "neutra" },
];

// Ordem de profundidade — usada só para exibição textual (ex: "claro",
// "moreno"), não mais para o cálculo de compatibilidade (ver deltaE abaixo).

// --- Catálogo curado com ofertas reais, checadas manualmente em 12/08/2026 ---
// Fonte: Beleza na Web, Eudora e Océane (páginas de promoção linkadas abaixo).
// Não existe API pública estável de busca em tempo real nessas lojas nem no
// Mercado Livre (ver nota no README), então esse catálogo é atualizado sob
// pedido em vez de em tempo real.
const CATALOG_UPDATED_AT = "13 de agosto de 2026";

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
];

function classifyTone(r, g, b) {
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  const l = (max + min) / 2;
  const warmth = r - b;

  let depth;
  if (l > 0.78) depth = "muito claro";
  else if (l > 0.63) depth = "claro";
  else if (l > 0.48) depth = "médio";
  else if (l > 0.33) depth = "moreno";
  else if (l > 0.18) depth = "escuro";
  else depth = "muito escuro";

  let undertone;
  if (warmth > 28) undertone = "quente";
  else if (warmth < 12) undertone = "fria";
  else undertone = "neutra";

  return { depth, undertone };
}

// --- Match por cor real (CIELAB + Delta-E), em vez de categorias amplas ---
// Convertendo pra Lab porque distância euclidiana em RGB não corresponde
// bem à percepção humana de cor — Lab é perceptualmente mais uniforme,
// então "distância pequena em Lab" ≈ "olho humano vê como parecido".
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

function deltaE(hexA, hexB) {
  const [r1, g1, b1] = hexToRgbArr(hexA);
  const [r2, g2, b2] = hexToRgbArr(hexB);
  const [L1, a1, bb1] = rgbToLab(r1, g1, b1);
  const [L2, a2, bb2] = rgbToLab(r2, g2, b2);
  return Math.sqrt((L1 - L2) ** 2 + (a1 - a2) ** 2 + (bb1 - bb2) ** 2);
}

// Delta-E aproximado: <10 = combina muito bem, <20 = combina razoável,
// acima disso o tom já é visivelmente diferente.
function matchLabel(distance) {
  if (distance < 10) return { label: "combina muito bem", tier: 2 };
  if (distance < 20) return { label: "combina bem", tier: 1 };
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
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 30, letterSpacing: "-0.01em" }}>
              Tom Certo
            </span>
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
              ofertas · mercado livre
            </span>
          </div>
          <p style={{ marginTop: 8, color: COLORS.inkSoft, fontSize: 15, maxWidth: 560, lineHeight: 1.5 }}>
            Encontre bases e corretivos com desconto real, combinados com o seu tom de pele — do mesmo jeito
            que o Findation faz para maquiagem. Catálogo checado manualmente em Beleza na Web, Eudora e Océane.
          </p>
        </div>
      </header>

      <main style={{ maxWidth: 980, margin: "0 auto", padding: "32px 24px 80px" }}>
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
                    alt="Foto enviada"
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
        }}
      >
        <Sparkles size={17} />
        Buscar ofertas para o meu tom
      </button>
    </div>
  );
}

function ResultsStep({ selectedTone, loading, error, products, reset, runSearch }) {
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

      {!loading && !error && products.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

// swatch de referência só pra dar cor ao card — não é o tom real do produto

function ProductCard({ product }) {
  const hasDiscount = product.discountPct > 0;

  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        background: COLORS.card,
        border: `1px solid ${COLORS.line}`,
        borderRadius: 12,
        overflow: "hidden",
        textDecoration: "none",
        color: COLORS.ink,
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.12s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
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
