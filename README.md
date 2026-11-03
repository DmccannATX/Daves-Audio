# Dave's Audio

Source for **McCann Audio Workshop**, Dave McCann’s personal website for vintage audio collecting, restoration projects, and custom speaker builds.

## Features

- 24 curated collection records, with category filters, model/brand search, sorting, and detail dialogs.
- Seven restoration and build project notebooks, with checklists and notes saved locally in the browser.
- JSON notebook export and restore for backups or moving notes between devices.
- Original vector workshop and equipment illustrations, responsive navigation, and reduced-motion support.

## Run locally

Serve the `dist` directory using any static HTTP server. For example, with Python installed:

```sh
python3 -m http.server 8000 --directory dist
```

Open `http://localhost:8000`. No package installation or build is required.

## Deploy on GitHub Pages

The included GitHub Actions workflow publishes `dist` whenever `main` changes. It requires no package installation, build command, database, server functions, paid storage, or environment secrets.

In the repository settings, select **Pages → Source → GitHub Actions** if GitHub does not enable Pages automatically during the first deployment.

## Deploy on Vercel

Import this repository into the intended Vercel team. The included `vercel.json` declares a static site with `dist` as the output directory and no installation or build commands. Keep deployment protection enabled when preserving private access. No database, server functions, paid storage, or environment secrets are required by this site.

The existing production deployment is available at [daves-audio.vercel.app](https://daves-audio.vercel.app). GitHub Pages is the primary source-controlled deployment target.

## Source structure

- `dist/index.html` — page and native dialog markup
- `dist/styles.css` — typography and responsive styling
- `dist/data.js` — curated collection and project references
- `dist/app.js` — browser interactions and local notebook
- `dist/assets/workshop.svg` — original hero illustration
- `dist/favicon.svg` — original site mark
- `vercel.json` — static hosting configuration
- `.github/workflows/deploy-pages.yml` — GitHub Pages deployment workflow

## Content provenance

Collection entries are selected from **McCann Home Audio — Master Inventory v11.5**, revised July 18, 2026. Project context comes from January–November 2026 conversations, including DaveHorns, the walnut rack, Rotel RB-991 photographs, and Klipsch KG4 crossover sourcing. Historical statuses and design targets are explicitly labeled. No current repair completion or independently verified technical specification is inferred.

## Notebook privacy and backups

Notes are stored only in browser local storage, scoped to the site origin. They do not synchronize between devices or hosting domains. Export a JSON backup before changing browsers, clearing browser data, or moving between the ChatGPT-hosted and external versions. Exported backups can be restored through the notebook.

## Validation

JavaScript syntax and data consistency checks pass. Browser verification covered archive expansion, category filtering, multiword search, no-results recovery, brand sorting, detail-to-notebook navigation, notes and checklist persistence across reload, and JSON backup round-trip. Mobile navigation and layouts were inspected at 390 px and 768 px iframe widths.
