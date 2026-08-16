# Tom Certo — ofertas de maquiagem por tom de pele

App em React (Vite) que combina o tom de pele escolhido pelo usuário com uma
lista curada de ofertas reais de base e corretivo (Beleza na Web, Eudora,
Océane).

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
  category, depth, undertone, store, url
}
```

`depth` é um de: `muito claro`, `claro`, `médio`, `moreno`, `escuro`,
`muito escuro`. `undertone` é um de: `quente`, `fria`, `neutra`. Esses dois
campos são o que o algoritmo de match usa — não são inferidos do título.

Se quiser reativar busca ao vivo no futuro, duas opções reais:
- **Programa de afiliados** de uma loja específica (ex: Mercado Livre
  Afiliados, Amazon Associates) — geralmente dão acesso a feeds de produtos
  mais estáveis que a API pública de busca.
- **Scraping via backend próprio** (não recomendo fazer isso a partir do
  navegador do usuário, nem sem checar os termos de uso de cada loja).

## O que o app faz

1. Usuário escolhe o tom de pele (paleta de 11 tons) ou envia uma foto e toca
   na própria pele — o app lê o pixel via `<canvas>` e classifica
   profundidade + subtom.
2. Compara essa classificação com o `depth`/`undertone` de cada produto do
   catálogo.
3. Ordena por compatibilidade de tom e, empatando, por % de desconto.
4. Cada card linka para a página exata do produto na loja (não uma categoria
   genérica) — a foto real do produto aparece ao clicar. 11 dos 13 produtos
   têm link direto confirmado; 2 (Maybelline Fit Me 10.5 e 12) linkam para a
   coleção da linha, porque não encontrei a página individual dessas
   tonalidades especificamente.

## Limitação conhecida

O catálogo é uma lista fixa, atualizada manualmente — não é um feed ao vivo.
Preços e disponibilidade podem ter mudado desde a última checagem (indicada
no topo da tela de resultados). Não foi possível embutir as fotos dos
produtos diretamente nos cards (a busca de imagens não expõe URLs estáveis
para hotlink), então os cards usam um gradiente com a inicial da marca — a
foto real aparece ao abrir o link do produto.
