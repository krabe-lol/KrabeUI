# KrabeUI

A personal, versioned React component library built on [shadcn/ui](https://ui.shadcn.com) and [Radix UI](https://radix-ui.com) primitives, distributed as a normal npm dependency instead of shadcn's usual copy-paste-per-project flow.

**Why:** copy-pasting the same component set into every project makes them drift apart over time. KrabeUI is the one canonical implementation. Each consuming project pins a version, and an update to KrabeUI never changes that project's UI until you deliberately bump the pin.

Currently ships: Accordion, Alert, Aspect Ratio, Badge, Breadcrumb, Button, Button Group, Card, Checkbox, Combobox, Command, Dialog, Dropdown Menu, Empty, Field, Input, Input Group, Label, Lightbox, Master Detail, Radio Group, Select, Separator, Sheet, Skeleton, Slider, Spinner, Switch, Table, Tabs, Textarea, Toast, Toggle, Toggle Group, Tooltip, Typography.

Deliberately **not** shipped: Drawer -- see [Radix first](#radix-first).

## Install

Pinned by git tag, no registry required:

```bash
npm install "krabeui@github:krabe-lol/krabeui#v0.3.0"
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

`--destructive` and `--success` are also available if a project wants a different error/danger or success color than the default (`Badge` and `Alert` use them for their `destructive` and `success` variants).

Values can be any valid CSS color — the default theme uses `oklch()`, but `hsl()`/`rgb()`/hex all work fine as raw custom-property values.

### Fonts

`--font-sans` is the main font for everything (Tailwind's own `font-sans`/Preflight default — override it like any other token). `--font-heading` is a separate accent font used by headings and title-ish text (`Typography`'s `h1`–`h4`, `CardTitle`, `DialogTitle`, ...); if a project doesn't set `--font-heading`, it automatically falls back to whatever `--font-sans` is set to, so setting only one variable still themes the whole app consistently:

```css
:root {
  --font-sans: "Inter", sans-serif;
  --font-heading: "Fraunces", serif; /* optional -- omit to reuse --font-sans */
}
```

**Note on existing projects:** Brettchen, Racehub, and Lagerist don't currently share one convention — Brettchen and Racehub already use this shadcn-style `--primary`/`--radius` variable set (Racehub via an older Tailwind v3 config, which still works since these are just CSS custom properties), but Lagerist is built on DaisyUI, which has entirely different variable names and semantics (`--color-primary`/`--color-primary-content` vs. `--primary`/`--primary-foreground`). Adopting KrabeUI in Lagerist means mapping its dracula palette onto KrabeUI's variable names, component by component — that migration is intentionally out of scope for this initial setup.

## Radix first

When shadcn offers several components for the same job, KrabeUI ships the one built on Radix and excludes the others. One primitive family means one set of conventions everywhere (`asChild`, `data-state`, portals, focus handling) and no extra third-party packages with their own maintenance cycles. Non-Radix libraries are only used where Radix has no equivalent at all.

| Job | Shipped | Excluded |
|---|---|---|
| Panel sliding in from a screen edge | `Sheet` (Radix `Dialog`) | `Drawer` (built on [`vaul`](https://github.com/emilkowalski/vaul)) |

So every edge-anchored panel, including mobile-style bottom sheets, is a `Sheet`, with `side` on `SheetContent` picking the edge:

```tsx
<Sheet>
  <SheetTrigger asChild><Button>Filters</Button></SheetTrigger>
  <SheetContent side="bottom">...</SheetContent>
</Sheet>
```

Besides the X button, an overlay click, Esc, and `SheetClose`, KrabeUI's `Sheet` adds what shadcn's lacks: **swipe to close** on touch devices. Swiping the panel toward its edge makes it follow the finger; releasing past a quarter of its size (or with a quick flick) closes it, otherwise it snaps back. To stay out of the way of content:

- Only touch swipes count -- mouse drags never move the panel, so text selection and sliders work normally on desktop.
- Swipes that start in an input, textarea, select, slider, or an element with `data-sheet-no-swipe` are ignored, as are swipes mostly perpendicular to the edge.
- If the content under the finger can still scroll in the swipe direction (e.g. a scrolled list in a bottom sheet), the swipe scrolls instead.

Disable it per sheet with `<SheetContent swipeToClose={false}>`. It's implemented in `sheet.tsx` with plain pointer events -- no extra dependency.

Non-Radix components KrabeUI does ship, because there is no Radix alternative:

- `Combobox` -- Base UI (Radix has no combobox primitive).
- `Command` -- `cmdk`.
- `Toast` -- `sonner` (shadcn calls the component `sonner`; KrabeUI uses the more common name). shadcn's Radix-based `toast` is gone from the registry for Radix projects (the CLI points to `sonner` instead), so there is nothing to choose between.

## Lightbox

`Lightbox` isn't in shadcn; it's KrabeUI's own, built on Radix `Dialog` like `Sheet`. Wrap your own previews in `LightboxTrigger`s (a `<button>` around the `<img>` keeps them keyboard-accessible):

```tsx
<Lightbox images={[{ src: "/a.jpg", alt: "Harbor at dusk", caption: "Harbor" }, ...]}>
  <LightboxTrigger index={0} asChild>
    <button><img src="/a-thumb.jpg" alt="Harbor at dusk" /></button>
  </LightboxTrigger>
</Lightbox>
```

- Shows one image at a time, scaled to fit, with an optional caption. Closes via the X button, Esc, or a click next to the image.
- With more than one image: previous/next buttons, arrow keys, a counter ("3 / 12") and a thumbnail strip (`thumbnail` falls back to `src`).
- Touch swipes left/right page through the images, a swipe down closes -- same rules as `Sheet` (touch only, past a share of the size or a quick flick, otherwise it snaps back). Swipes starting on a button, link or an element with `data-lightbox-no-swipe` are ignored.
- `open`/`onOpenChange` and `index`/`onIndexChange` make it controllable; `labels` translates the (English) screen-reader texts.
- It always renders in the dark theme, whatever the page uses.

## Adding a new component later

1. `npx shadcn@latest add <component>` — pulls it in the same way the existing components were added (a headless primitive -- usually Radix, occasionally Base UI for things Radix has no equivalent of, like `combobox` -- plus `cn` and `class-variance-authority`, styled with the existing token classes). If the component depends on one KrabeUI already has (e.g. `command` pulls in `button`, `dialog`, `input-group`), the CLI offers to overwrite it with the upstream version: **always answer no** -- the local copies carry KrabeUI-specific changes (e.g. `Button`'s `icon` prop, `Sheet`'s swipe-to-close). Never add `drawer`, and check [Radix first](#radix-first) before adding anything not built on Radix.
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
npm run dev      # Vite playground at src/App.tsx (http://localhost:4060)
npm run build    # tsup -> dist/ (ESM + .d.ts per component) + dist/styles.css
npm run typecheck
```

## Ports

All local ports are fixed (`strictPort` -- a busy port fails instead of silently moving) and registered as `krabeui-*` in `../ports.md`, the shared port list for all projects next to this repo:

| Port | Used by |
|---|---|
| 4060 | `npm run dev` (Vite playground) |
| 4061 | `npm run storybook` |
| 4062 | `npm run test` (Vitest browser mode) |
| 4063 | `npm run preview` |

## Storybook

```bash
npm run storybook         # dev server at http://localhost:4061
npm run build-storybook   # static export to storybook-static/
npm run test              # runs each story's play function as a Vitest test in a real browser
```

Every component has a story at `src/components/ui/<name>.stories.tsx`, covering its meaningful variants/states (sizes, disabled, invalid, open popovers, etc). Storybook reuses the project's own `vite.config.ts` (so the same `@tailwindcss/vite` pipeline compiles the stories) and imports `src/index.css` once in `.storybook/preview.tsx`. `@storybook/addon-vitest` wires those same stories into Vitest's browser mode (via `@vitest/browser-playwright`), so any story with a `play` function doubles as an interaction/regression test — see the `SwipeToClose` and `SwipeWithScrollableContent` stories in `sheet.stories.tsx`.

The toolbar has a **Scheme** control (light / dark, toggling the `.dark` class the same way consumers do) implemented as a single global decorator in `.storybook/preview.tsx` that reads `context.globals`.
