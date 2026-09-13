# KrabeUI

A personal, versioned React component library built on [shadcn/ui](https://ui.shadcn.com) and [Radix UI](https://radix-ui.com) primitives, distributed as a normal npm dependency instead of shadcn's usual copy-paste-per-project flow.

**Why:** copy-pasting the same component set into every project makes them drift apart over time. KrabeUI is the one canonical implementation. Each consuming project pins a version, and an update to KrabeUI never changes that project's UI until you deliberately bump the pin.

Currently ships: Button, Input, Label, Card, Dialog, Dropdown Menu, Select, Checkbox, Badge, Table.

## Install

Pinned by git tag, no registry required:

```bash
npm install "krabeui@github:krabe-lol/krabeui#v0.1.0"
```

npm clones the repo at that tag, runs its `prepare` script (`npm run build`) to produce `dist/`, and installs the result — you get compiled JS + types the same as any registry package, you just never move forward until you edit the pinned tag yourself.

Peer dependencies: `react` and `react-dom` (^18.3 or ^19).

## Usage

```tsx
import { Button } from "krabeui/button"
// or: import { Button, Input, Card } from "krabeui"
```

Every component is importable both from the main entry (`krabeui`) and from its own subpath (`krabeui/button`, `krabeui/dialog`, ...) for cleaner tree-shaking.

Once, in your app's root CSS (next to your own `@import "tailwindcss"`):

```css
@import "krabeui/styles.css";
```

And make sure Tailwind can see class names used inside the package (Tailwind v4 only scans your own project by default):

```css
@source "../node_modules/krabeui/dist";
```

(adjust the relative path to wherever `node_modules` actually sits.)

## Theming

KrabeUI never hard-codes color/spacing choices into component markup — every component is styled purely through Tailwind utility classes that resolve to CSS custom properties (`bg-primary`, `text-foreground`, `rounded-lg`, ...). Restyle KrabeUI for a project by overriding those custom properties in *that project's own* `globals.css`, after the `krabeui/styles.css` import — never by editing or forking component source.

```css
@import "krabeui/styles.css";

:root {
  --primary: oklch(0.68 0.13 350);
  --primary-foreground: oklch(0.15 0.01 350);
  --radius: 0.5rem;
}

.dark {
  --background: oklch(0.145 0.014 55);
  --foreground: oklch(0.93 0.012 70);
  --primary: oklch(0.68 0.13 350);
  --primary-foreground: oklch(0.15 0.01 350);
}
```

Dark mode is the standard shadcn convention: put a `.dark` class on `<html>` (or any ancestor) and provide dark-mode values for the same variable names.

At minimum, override:

| Token(s) | Controls |
|---|---|
| `--primary` / `--primary-foreground` | accent color + the text/icon color that sits on it |
| `--radius` | corner rounding for every component (`--radius-sm/md/lg/xl` all derive from this one value) |
| `--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--border`, `--input`, `--ring` | the neutral surface ramp |

`--destructive` is also available if a project wants a different error/danger color than the default.

Values can be any valid CSS color — the default theme uses `oklch()`, but `hsl()`/`rgb()`/hex all work fine as raw custom-property values.

**Note on existing projects:** Brettchen, Racehub, and Lagerist don't currently share one convention — Brettchen and Racehub already use this shadcn-style `--primary`/`--radius` variable set (Racehub via an older Tailwind v3 config, which still works since these are just CSS custom properties), but Lagerist is built on DaisyUI, which has entirely different variable names and semantics (`--color-primary`/`--color-primary-content` vs. `--primary`/`--primary-foreground`). Adopting KrabeUI in Lagerist means mapping its dracula palette onto KrabeUI's variable names, component by component — that migration is intentionally out of scope for this initial setup.

## Adding a new component later

1. `npx shadcn@latest add <component>` — pulls it in the same way the current ten were added (Radix primitive + `cn` + `class-variance-authority`, styled with the existing token classes).
2. Add the entry to `src/index.ts` and to `tsup.config.ts`'s `entry` map.
3. Add the matching subpath to `package.json`'s `exports`.
4. `npm run build` to confirm it compiles; `npm run dev` to eyeball it in `src/App.tsx` (the playground).
5. Add `src/components/ui/<component>.stories.tsx` covering its variants/states, and check it in `npm run storybook`.
6. `npm run changeset` to record the change, then follow the release steps below.

## Releasing a new version

```bash
npm run changeset   # describe the change, pick a semver bump
npm run version     # applies the bump to package.json + CHANGELOG.md
git add -A && git commit -m "Release vX.Y.Z"
git tag vX.Y.Z
git push && git push --tags
```

Consuming projects stay on their old pin until someone edits the `#vX.Y.Z` in their `package.json` and runs `npm install`.

## Local development

```bash
npm install
npm run dev      # Vite playground at src/App.tsx, exercises every component
npm run build    # tsup -> dist/ (ESM + .d.ts per component) + dist/styles.css
npm run typecheck
```

## Storybook

```bash
npm run storybook         # dev server at http://localhost:6006
npm run build-storybook   # static export to storybook-static/
```

Every component has a story at `src/components/ui/<name>.stories.tsx`, covering its meaningful variants/states (sizes, disabled, invalid, open popovers, etc). Storybook reuses the project's own `vite.config.ts` (so the same `@tailwindcss/vite` pipeline compiles the stories) and imports `src/index.css` once in `.storybook/preview.tsx`.

The toolbar has four controls for checking the theming contract without a second real project:

- **Theme preset** — KrabeUI default, or the actual token values from Brettchen / Racehub / Lagerist (see "Theming" above), or "Custom override".
- **Scheme** — light / dark (`.dark` class, same as consumers use).
- **Accent** / **Radius** — only apply when the preset is "Custom override"; pick any accent hue and any radius independently.

This is implemented as a single global decorator in `.storybook/preview.tsx` that reads `context.globals` and sets the corresponding `--primary`/`--radius`/etc. custom properties as inline styles on the story's wrapper `div` — the same mechanism a consuming project's `globals.css` override uses, just applied live instead of at build time.
