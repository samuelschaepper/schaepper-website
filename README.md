# Schäpper Consulting GmbH – Website

Astro-Website für Azure Static Web Apps. Alle Website-Texte liegen unter `src/data/website.json`.

## Installation und lokale Vorschau

Voraussetzung: Node.js 22.23.4+ (unterstützte gerade Version).

```bash
npm install
npm run dev
```

Danach `http://localhost:4321` aufrufen. Für die Produktionsversion:

```bash
npm run build
npm run preview
```

## Integration in das bestehende GitHub-Repository

WICHTIG: Das bereits von Azure angelegte Workflow-YAML unter `.github/workflows/` **behalten**, nicht durch ein zweites ersetzen. In diesem Workflow im Schritt `Azure/static-web-apps-deploy@v1` ändern:

```yaml
app_location: "/"
api_location: ""
output_location: "dist"
```

Deployment-Token / Secret und alle anderen Workflow-Einstellungen unverändert lassen. `package.json` und `astro.config.mjs` im Repository-Stamm speichern. Die frühere Testdatei `index.html` im Repository-Stamm **löschen**, damit sie nicht mit dem Astro-Projekt verwechselt wird.

## Vor der Veröffentlichung

- Impressum und Datenschutz durch vollständige, rechtlich passende Texte ersetzen (`src/pages/impressum.astro` und `src/pages/datenschutz.astro`).
- Texte, Nachweise und berufliche Angaben auf Richtigkeit prüfen.
- Porträt / Logo ergänzen und dafür die nötigen Bildrechte sicherstellen.
- Zwei weitere Fachartikel sind nur als Vorschauen gekennzeichnet, nicht als vollständige Artikel umgesetzt.
- Derzeit zeigt www.schaepper.com und schaepper.com die gleiche Website. Die kanonische SEO-Adresse ist www.schaepper.com; eine HTTP-Weiterleitung von der Hauptdomain ist **nicht** inbegriffen.
- Für Änderungen der Website-Dateien sorgt GitHub Actions automatisch für ein neues Deployment.

## Dateien

`src/pages/` Routing und Seiten; `src/components/` Content-Ausgabe; `src/layouts/` Layout und Styling; `public/` statische Ressourcen und Azure Static Web Apps Konfiguration; `src/data/website.json` Inhalte.
