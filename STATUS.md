# Status

## Aktueller Stand
- KrabeUI ist eine React-Komponentenbibliothek (shadcn/ui + Radix, Tailwind v4), die per Git-Tag als npm-Abhängigkeit eingebunden wird. Version `0.4.0` (Tag `v0.4.0`), Branch `main`.
- Ausgeliefert: 35 Komponenten, jede mit eigenem `krabeui/<komponente>`-Subpath-Export und Storybook-Story (Liste in der README).
- 0.4.0 brachte: Sonner → Toast (`krabeui/toast`, inkl. `toast()`), Badge `success` mit Token `--success`, Alert (inkl. `success`), Accordion, Lightbox.
- Storybook-Showcase wird per `Dockerfile` (Build + nginx) gepackt. Der Gitea-Workflow `.gitea/workflows/build-and-push-docker.yml` baut bei Push auf `main` das Image `git.krabe.lol/krabe-lol/krabeui:latest`; `stack.yml` ist das Portainer-Stack dazu (Host-Port 5003).
- Ports (belegt): dev 4060 und preview 4063 (`vite.config.ts`, `strictPort: true`), Storybook 4061 (`npm run storybook`, `--exact-port`), Vitest-Browser-API 4062 (`strictPort: true`), lokaler Docker-Container 4064 (`docker-compose.yml`). Entspricht `ports.md`.
- Nicht eingecheckt (untracked): `docker-compose.yml`, `.dockerignore`.

## Offene Aufgaben
- Beim Update auf 0.4.0 in den Projekten `krabeui/sonner` durch `krabeui/toast` ersetzen: delidishes (`LazyToaster.tsx`, dazu die `toast`-Importe aus `sonner`) und papierstau (`components/ui/sonner.tsx`, wird dort selbst erledigt).
- Entscheiden, ob `docker-compose.yml` (lokaler Build) neben `stack.yml` (Registry-Image) bleibt; danach `docker-compose.yml` und `.dockerignore` einchecken oder verwerfen.

## Entscheidungen
- `optimizeDeps.include: ['expect-type']` im Storybook-Testprojekt (`vite.config.ts`): Ohne Vorbündeln des CommonJS-Pakets hing der Vitest-Browserlauf zeitweise, weil keine Testdatei `expectTypeOf` importieren konnte.
- Lightbox ist ein Eigenbau auf Radix `Dialog` (shadcn hat keine): Galerie-Navigation, Wischgesten nach dem Muster von `Sheet`, Thumbnail-Leiste; kein Zoom. Rendert immer im Dark-Look (`dark`-Klasse auf Overlay und Content).
- Grün für Erfolg kommt aus dem neuen Token `--success` (wie `--destructive` ohne Foreground-Token), damit Projekte es überschreiben können.
- Toast statt Sonner als Komponentenname, weil geläufiger. `krabeui/sonner` entfällt ohne Übergangs-Alias, da Projekte Versionen pinnen. `toast()` wird mitexportiert, damit Projekte kein eigenes `sonner` brauchen und `toast()` sicher dieselbe Instanz wie `<Toaster />` erreicht.
- Auslieferung per Git-Tag statt Registry: Projekte pinnen eine Version, Updates ändern deren UI erst bei bewusstem Bump (README). `prepare`-Script baut `dist/` bei der Installation.
- Radix zuerst: Gibt es mehrere shadcn-Komponenten für dieselbe Aufgabe, wird die Radix-basierte ausgeliefert (daher `Sheet` statt `Drawer`/vaul). Nicht-Radix nur ohne Radix-Alternative (z. B. `Combobox` mit Base UI, `Command` mit cmdk) – README.
- Theming nur über CSS-Variablen im jeweiligen Projekt, nie durch Ändern des Komponenten-Quellcodes (README).
- Versionierung und Changelog über Changesets (`.changeset/`, `CHANGELOG.md`).
- Fester Port-Block ab 4060 mit `strictPort`, damit KrabeUI nicht mit Nachbarprojekten kollidiert (Kommentar in `vite.config.ts`). Vitest-Port 4062 explizit, weil der Vitest-Standard (63315) unter Windows in einen reservierten Bereich fallen und mit EACCES scheitern kann.
- Docker-Image enthält nur den Storybook-Build, da die Bibliothek selbst keinen Server hat; `npm ci --ignore-scripts`, weil `prepare` (tsup) `src/` bräuchte und der Storybook-Build `dist/` nicht benötigt (Dockerfile).
- Workflow nutzt kein Marketplace-Action, nur Shell, weil diese Actions mit dem Runner in einem anderen Projekt nicht funktionierten (Kommentar im Workflow).

## Bekannte Probleme
- `package.json` nutzt `latest` für `vitest`, `@vitest/browser-playwright`, `@vitest/coverage-v8` und `playwright` – Builds sind dadurch nicht reproduzierbar (nur über `package-lock.json` abgefedert).
- `.dockerignore` ist untracked: Der CI-Build klont das Repo und bekommt sie nicht.
