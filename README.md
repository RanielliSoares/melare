# MELARE Construção Civil — site institucional

Site estático (HTML + CSS + JS) baseado no layout do Stitch ("Obsidian Architectural Prestige"), pronto para hospedagem compartilhada (Apache/cPanel).

## Publicar na hospedagem

1. `npm install` (somente na primeira vez)
2. `npm run dist`
3. Envie **o conteúdo** da pasta `dist/` para a raiz do site (`public_html/`) por FTP ou pelo Gerenciador de Arquivos.

Depois de publicar:

- Troque `https://www.seudominio.com.br` pelo domínio real em `sitemap.xml` e `robots.txt`.
- Ative o SSL no painel da hospedagem e descomente o bloco "Forçar HTTPS" no `.htaccess`.

## Estrutura

| Caminho | O que é |
| --- | --- |
| `index.html` | Página principal (fonte do cabeçalho e rodapé de todas as páginas) |
| `404.html`, `500.html` | Páginas de erro (configuradas no `.htaccess`) |
| `politica-de-privacidade.html`, `termos-de-uso.html` | Páginas institucionais (LGPD) |
| `src/pages/` | Conteúdo das páginas internas: **edite aqui**, não nos `.html` gerados |
| `src/input.css` | Estilos e animações (Tailwind) → compilado em `assets/css/style.css` |
| `assets/js/main.js` | Animações de rolagem, menu mobile, contadores e WhatsApp flutuante |
| `src/img/` | Imagens originais → otimizadas em `assets/img/` |
| `_stitch-referencia/` | Layout original do Stitch e textos do site antigo (não publicar) |

## Comandos

- `npm run build`: gera as páginas internas e compila o CSS
- `npm run watch`: recompila o CSS automaticamente enquanto você edita
- `npm run images`: regera as imagens WebP e os ícones a partir de `src/img/`
- `npm run dist`: build completo + pasta `dist/` pronta para upload

Ao alterar o cabeçalho ou o rodapé no `index.html`, rode `npm run build` para replicar a mudança nas outras páginas.

## Novas fotos de obras

Coloque o `.jpg` original em `src/img/`, adicione o nome na lista do `scripts/optimize-images.mjs` e rode `npm run images`.
