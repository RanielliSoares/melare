// Gera as versões otimizadas (WebP, favicons e imagem de compartilhamento)
// a partir dos originais em src/img/. Uso: npm run images
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const IMG = "assets/img";
const out = (name) => `${IMG}/${name}`;
const src = (name) => `src/img/${name}`;

await mkdir(`${IMG}/icons`, { recursive: true });

// Fotos das obras: duas larguras para srcset
for (const name of ["obra-inicio", "obra-meio", "obra-final"]) {
  for (const width of [640, 1200]) {
    await sharp(src(`${name}.jpg`))
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(out(`${name}-${width}.webp`));
  }
}

// Logo completo (fundo preto) para o rodapé e páginas internas
await sharp(src("logo-melare-grande.png"))
  .resize({ width: 480 })
  .webp({ quality: 88 })
  .toFile(out("logo-melare.webp"));

// Símbolo "M" recortado do logo para o cabeçalho e favicons
const symbol = sharp(src("logo-melare-grande.png")).extract({ left: 380, top: 40, width: 780, height: 640 });
const symbolBuf = await symbol.png().toBuffer();

await sharp(symbolBuf).resize({ width: 160 }).webp({ quality: 90 }).toFile(out("logo-simbolo.webp"));
await sharp(symbolBuf).resize({ width: 160 }).png().toFile(out("logo-simbolo.png"));

const square = (size) =>
  sharp(symbolBuf)
    .resize(Math.round(size * 0.82), Math.round(size * 0.82), { fit: "contain", background: "#0B0B0D" })
    .extend({
      top: Math.round(size * 0.09),
      bottom: size - Math.round(size * 0.82) - Math.round(size * 0.09),
      left: Math.round(size * 0.09),
      right: size - Math.round(size * 0.82) - Math.round(size * 0.09),
      background: "#0B0B0D",
    })
    .png();

for (const [size, name] of [
  [32, "favicon-32.png"],
  [180, "apple-touch-icon.png"],
  [192, "icon-192.png"],
  [512, "icon-512.png"],
]) {
  await square(size).toFile(out(`icons/${name}`));
}

// Imagem de compartilhamento (Open Graph) 1200x630
await sharp(src("obra-final.jpg"))
  .resize(1200, 630, { fit: "cover", position: "center" })
  .jpeg({ quality: 82 })
  .toFile(out("og-melare.jpg"));

console.log("Imagens otimizadas.");
