# Agile Orbit

Agile Orbit is a static, GitHub Pages-ready knowledge and toolkit platform for Agile practitioners.

## Architecture

- HTML5 pages organised by navigation area
- CSS split into `style.css`, `components.css`, `animations.css`, `responsive.css`
- Vanilla ES6+ JavaScript
- `js/config.js` contains editable external links and site settings
- Tools run entirely in the browser
- Retro Runner uses browser `localStorage`; it does not provide remote collaboration

## Run locally

Because the project is static, you can open `index.html` directly. For best results, use a simple static server (for example VS Code Live Server) so relative navigation behaves like deployment.

## Add a new article

1. Copy an existing article page under the appropriate folder.
2. Update title, description, breadcrumbs and content.
3. Add a card/link to the relevant hub.

## Add a new tool

1. Copy a calculator page under `tools/`.
2. Keep the common tool layout.
3. Put calculation logic in a named function or in `js/calculators.js`.
4. Validate empty, negative and divide-by-zero inputs.
5. Add the tool card to `tools/index.html`.

## Update the Practice question bank

The Practice UI is in `js/practice/practice.js`; it reads the normalized 452-question data contract in `js/practice/practice-data.js`.
Refresh the data file from the master workbook without changing the UI logic. Each question needs an ID, theme, question text, options, answer IDs, and optional feedback. The bank metadata must list each theme and its question count.

## Add a resource

Put the final PDF/XLSX/etc. in `assets/downloads/` and point a resource card at the file using a relative path.

## Update LinkedIn / Coggle / Credly

Edit `js/config.js`:

```js
const SITE_CONFIG = {
  linkedin: "YOUR_LINKEDIN_URL",
  coggle: "YOUR_COGGLE_URL",
  credly: "YOUR_CREDLY_URL"
};
```

No unknown or fabricated external URLs are included by default.

## Deploy to GitHub Pages

1. Create a repository named `agile-orbit`.
2. Upload the project contents.
3. Commit to the `main` branch.
4. In GitHub: Settings → Pages → Deploy from a branch → `main` → `/ (root)`.
5. Open `https://agilecoach-ashutosh.github.io/agile-orbit/`.

No build step is required.

## Update

```bash
git add .
git commit -m "Update Agile Orbit"
git push
```

## GitHub Pages paths

All page assets and navigation are generated with relative paths. The shared JavaScript also detects the `/agile-orbit/` project prefix so navigation remains compatible with GitHub Pages project hosting.

## Accessibility

The site uses semantic HTML, labels, visible focus styles, keyboard-friendly controls and a `prefers-reduced-motion` fallback.

## Performance

The project avoids framework bundles and large media. The visual system is CSS-first; JavaScript is used for interaction and calculations.

## 3D Hero — CDN-safe implementation

The homepage 3D hero loads Three.js as an ES module from jsDelivr at runtime. This avoids the legacy `three.min.js` global build path that can disappear between Three.js releases. If the CDN is unavailable or WebGL cannot start, the homepage automatically switches to a lightweight orbital navigation fallback instead of displaying a startup error.
