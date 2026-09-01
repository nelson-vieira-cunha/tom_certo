# Tom Certo — ofertas de maquiagem por tom de pele

App em React (Vite) que combina o tom de pele escolhido pelo usuário com uma
lista curada de mais de 35 ofertas reais de base e corretivo (Beleza na Web,
Eudora, Océane), usando Delta-E CIEDE2000 em CIELAB para o match de cor.

## Por que não busca em tempo real

A ideia original era consultar a API pública do Mercado Livre
(`/sites/MLB/search`) ao vivo. Na prática esse endpoint está retornando
`403 Forbidden` para a maioria das aplicações desde o início de 2026, mesmo
com OAuth configurado corretamente — é uma restrição da própria plataforma,
não um problema deste código (há vários relatos de outros desenvolvedores no
Reclame Aqui e no GitHub do Mercado Livre). Lojas de cosméticos em geral
também não expõem API pública de busca.

Por isso o app usa um **catálogo local curado** (`src/App.jsx`, array
`PRODUCTS`), com produtos, preços, descontos e tom reais, checados
manualmente. Isso elimina qualquer dependência de CORS/CSP/rate limit — o
app funciona 100% offline depois de carregado.

## Como rodar

Requer Node.js 18+ instalado.

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

## Build de produção

```bash
npm run build
npm run preview
```

Gera os arquivos estáticos em `dist/`, que podem ser hospedados em qualquer
lugar (Vercel, Netlify, GitHub Pages, etc.).

## Como atualizar o catálogo

Edite o array `PRODUCTS` em `src/App.jsx`. Cada item tem:

```js
{
  id, brand, title, price, original_price,
  category, depth, undertone, hex, store, url
}
```

`depth` é um de: `muito claro`, `claro`, `médio`, `moreno`, `escuro`,
`muito escuro`. `undertone` é um de: `quente`, `fria`, `neutra`, `oliva`.
Esses campos são só para exibição/categorização — o match de verdade usa o
campo `hex` (cor real do produto) comparado ao tom escolhido, não os rótulos.

Se o produto tiver uma foto real disponível em `src/assets/`, registre-a em
`PRODUCT_IMAGES`; caso contrário o card usa automaticamente um gradiente com
a inicial da marca como placeholder (ver "Limitação conhecida" abaixo).

Se quiser reativar busca ao vivo no futuro, duas opções reais:
- **Programa de afiliados** de uma loja específica (ex: Mercado Livre
  Afiliados, Amazon Associates) — geralmente dão acesso a feeds de produtos
  mais estáveis que a API pública de busca.
- **Scraping via backend próprio** (não recomendo fazer isso a partir do
  navegador do usuário, nem sem checar os termos de uso de cada loja).

## Matching de cor

1. Usuário escolhe um tom em uma paleta de **20 tons** (cobrindo profundidade
   de "muito claro" a "muito escuro" e as 4 famílias de subtom — quente, fria,
   neutra e oliva) ou envia uma foto e toca na própria pele — o app lê o pixel
   via `<canvas>`.
2. A cor (do swatch ou do pixel) e a cor de cada produto do catálogo são
   convertidas de sRGB para **CIELAB**.
3. A diferença entre as duas cores é calculada com **Delta-E CIEDE2000** — a
   fórmula de diferença de cor mais próxima da percepção humana entre as
   padronizadas pela CIE (mais precisa que distância euclidiana simples em
   Lab, principalmente em tons de baixa saturação como pele). A implementação
   foi validada contra o dataset de referência de Sharma, Wu & Dalal (2005).
4. Produtos com Delta-E < 3 são "combina perfeitamente", < 6 "combina muito
   bem", < 11 "combina bem" — o resto some para uma seção secundária
   ("ver mais produtos fora do seu tom"), para não poluir o resultado
   principal com opções que não servem.
5. Dentro da mesma faixa de compatibilidade, desempata por maior desconto.
6. Cada card linka para a página exata do produto na loja (não uma categoria
   genérica).

## SEO

`index.html` tem meta description, Open Graph, Twitter Card, canonical e
JSON-LD (`WebApplication` + `FAQPage`). `public/robots.txt` e
`public/sitemap.xml` são copiados para a raiz do build pelo Vite — assim como
`public/ads.txt` (antes vivia em `src/ads.txt`, onde nunca era servido na
raiz do domínio e por isso não validava no Google AdSense).

## Limitação conhecida

O catálogo é uma lista fixa, atualizada manualmente — não é um feed ao vivo.
Preços e disponibilidade podem ter mudado desde a última checagem (indicada
no topo da tela de resultados). Todos os produtos têm foto embutida em
`src/assets/` (registrada em `PRODUCT_IMAGES`); se um produto novo for
adicionado sem foto, o card usa automaticamente um gradiente com a inicial
da marca como placeholder.
