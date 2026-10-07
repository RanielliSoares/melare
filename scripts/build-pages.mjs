// Monta as páginas internas (404, 500, políticas...) reaproveitando o cabeçalho,
// o rodapé e os botões flutuantes do index.html. Uso: npm run pages
//
// Cada arquivo em src/pages/ começa com um comentário de configuração:
// <!--page {"title": "...", "description": "...", "base": "", "robots": "noindex"} -->
// base "" gera links relativos; base "/" gera links absolutos (obrigatório nas
// páginas de erro, que podem ser exibidas em qualquer endereço do site).
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const index = readFileSync("index.html", "utf8");

const between = (start, end) => {
  const i = index.indexOf(start);
  const j = index.indexOf(end, i);
  if (i < 0 || j < 0) throw new Error(`Marcador não encontrado: ${start}`);
  return index.slice(i, j);
};

const header = between("<!-- Barra de progresso de leitura -->", '<main id="conteudo">');
const footer = between("<!-- ==================== RODAPÉ ==================== -->", '<script src="assets/js/main.js"');
const fontLinks = between('<link rel="preconnect" href="https://fonts.googleapis.com">', '<link rel="preload"');

const rewrite = (html, base) =>
  html
    .replace(/href="#inicio"/g, `href="${base || "index.html"}"`)
    .replace(/href="#([\w-]+)"/g, (_, id) => `href="${base || "index.html"}#${id}"`)
    .replace(/(src|href|srcset)="assets\//g, `$1="${base}assets/`)
    .replace(/, assets\//g, `, ${base}assets/`)
    .replace(/href="(politica-de-privacidade|termos-de-uso)\.html"/g, `href="${base}$1.html"`);

for (const file of readdirSync("src/pages").filter((f) => f.endsWith(".html"))) {
  const raw = readFileSync(`src/pages/${file}`, "utf8");
  const match = raw.match(/^<!--page\s+(\{[\s\S]*?\})\s*-->/);
  if (!match) throw new Error(`${file}: comentário <!--page {...} --> ausente`);
  const meta = JSON.parse(match[1]);
  const base = meta.base ?? "";
  const body = raw.slice(match[0].length).trim();

  const html = `<!DOCTYPE html>
<html lang="pt-BR" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}">
  <meta name="theme-color" content="#0B0B0D">
  <meta name="robots" content="${meta.robots || "index, follow"}">
  <link rel="icon" type="image/png" sizes="32x32" href="${base}assets/img/icons/favicon-32.png">
  <link rel="apple-touch-icon" href="${base}assets/img/icons/apple-touch-icon.png">
  ${fontLinks.trim()}
  <link rel="stylesheet" href="${base}assets/css/style.css">
  <script>document.documentElement.className = document.documentElement.className.replace("no-js", "js");</script>
</head>
<body>
  <!-- Gerado por scripts/build-pages.mjs a partir de src/pages/${file} — edite a fonte, não este arquivo. -->
  ${rewrite(header, base).trim()}
  <main id="conteudo">
${body}
  </main>

  ${rewrite(footer, base).trim()}

  <script src="${base}assets/js/main.js" defer></script>
</body>
</html>
`;
  writeFileSync(file, html);
  console.log(`Gerado: ${file}`);
}

// Carrega do Google só os ícones Material Symbols realmente usados (arquivo bem menor)
const pages = readdirSync(".").filter((f) => f.endsWith(".html"));
const icons = new Set();
for (const file of pages) {
  for (const m of readFileSync(file, "utf8").matchAll(/<span class="icon[^"]*"[^>]*>\s*([a-z_]+)\s*</g)) icons.add(m[1]);
}
const iconList = [...icons].sort().join(",");
for (const file of pages) {
  const html = readFileSync(file, "utf8");
  writeFileSync(file, html.replace(/icon_names=[^&"]+/, `icon_names=${iconList}`));
}
console.log(`Ícones (${icons.size}): ${iconList}`);
