# Slides (Marp)

The knowledge-sharing deck that introduces the hackathon. Written in
[Marp](https://marp.app/) Markdown (`slides.md`).

## Preview

```bash
npm run slides
```

Opens a live-reloading server at **http://localhost:8080** — click `slides.md`
(or go straight to http://localhost:8080/slides.md). Edits to `slides.md` reload
instantly.

In **CodeSandbox**: run the `slides` task (it exposes port 8080 as a preview).

> The Marp **VS Code extension** is the other common way to preview, but it only
> works inside VS Code. The `npm run slides` server works anywhere, including
> CodeSandbox.

## Export to static HTML / PDF

```bash
npm run slides:build       # -> slides/index.html (gitignored)
npx marp slides/slides.md -o deck.pdf   # PDF (needs a local Chrome/Chromium)
```
