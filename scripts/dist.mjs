// Copia para dist/ somente os arquivos que vão para a hospedagem (public_html).
// Uso: npm run dist
import { cpSync, rmSync, mkdirSync, readdirSync } from "node:fs";

const OUT = "dist";
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT);

const rootFiles = readdirSync(".").filter((f) => f.endsWith(".html"));
for (const file of [...rootFiles, ".htaccess", "robots.txt", "sitemap.xml", "site.webmanifest"]) {
  cpSync(file, `${OUT}/${file}`);
}
cpSync("assets", `${OUT}/assets`, { recursive: true });

console.log(`Pronto! Envie o conteúdo da pasta "${OUT}/" para a raiz (public_html) da hospedagem.`);
