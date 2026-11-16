# krabeui

## 0.11.0

### Minor Changes

- ec9b01c: Vertical `Tabs` and `MasterDetail` share one look: a divider line between the list and the content, and the selected entry has a `bg-muted` background without border or indicator bar, rounded on the left (by `--radius`) and always square on the right, where it meets the divider. Vertical `TabsList` no longer has the muted pill background (both variants); `MasterDetailList` shows the divider below itself on narrow screens.

  Corner rounding is now always a fraction of `--radius`: the new token `--radius-xs` (× 0.4) joins `--radius-sm` … `--radius-4xl`, and the fixed pixel caps and offsets from shadcn are gone (`Button` xs/sm, `Toggle`/`ToggleGroup` sm, `Select` trigger sm, `Checkbox`, `InputGroup` buttons and kbd, `Tooltip` arrow, inline code in `Typography`). With the default `--radius` the look barely changes; with a large project radius small controls now get rounder too.

## 0.10.0

### Minor Changes

- cc9599e: `FileTile` (`krabeui/file-tile`) is now a compact landscape tile: a small format icon (or image `preview`) on the left, name and `meta` in the middle on one line each (two lines of text in total), and a new download button on the right (`<a download>` for `href`, or `downloadHref`; label via `downloadLabel`, default "Download"). `actions` sit after the download button instead of in the top-right corner. More formats get their own icon: document, spreadsheet, presentation, archive, video and audio besides PDF and image (`kind` accepts them too). `FileTileGrid` columns are at least 16rem wide.

## 0.9.0

### Minor Changes

- deee2b8: Add `FileTile` and `FileTileGrid` (`krabeui/file-tile`): small tiles for documents or other files, laid out side by side and wrapping on narrow screens. A tile shows an icon by the extension of `name` (PDF, image, other; override with `kind`) or an image `preview`, the name on up to two lines and an optional `meta` line (e.g. type and size). With `href` the whole tile is the link; `actions` (e.g. a `DropdownMenu`) sit in the top-right corner and stay clickable on their own.

## 0.8.0

### Minor Changes

- 33fe9bd: `Select` (`krabeui/select`): the list now opens below the trigger (`position="popper"` is the default) and shows at most 10.5 items before it scrolls. New `searchable` prop on `SelectContent` adds a search field above the first item that filters items by their text (`textValue`, or plain-text children) while typing; groups and separators without a match are hidden, `searchEmpty` (default "No results found.") shows when nothing matches, Enter picks the first match. Placeholder via `searchPlaceholder` (default "Search…"). `position="item-aligned"` keeps the old placement, but without the height limit and not for use with `searchable`.

## 0.7.0

### Minor Changes

- 876c13f: Add `SignaturePad` (`krabeui/signature-pad`): draw a signature with mouse, finger or pen. `onChange` receives a PNG data URL after every stroke (always black ink on white, like paper) or `null` once cleared. Texts via `placeholder`, `clearLabel` and `label`; `aria-invalid` marks it as missing; `disabled` and `height` props.

## 0.6.0

### Minor Changes

- 569a71e: Add expandable rows to `Table` (`krabeui/table`): `TableExpandableRow` renders a row plus, while open, a detail row (`detail` prop, any content such as a nested table) spanning `colSpan` columns on a subtle `bg-muted/30` background. Controlled (`open`/`onOpenChange`) or uncontrolled (`defaultOpen`). `TableExpandTrigger` is a real chevron `button` (rotates when open, `aria-expanded`, `aria-controls`) that can sit in any cell, first or last; its labels are set via `expandLabel`/`collapseLabel` (English defaults "Expand details"/"Collapse details").

## 0.5.0

### Minor Changes

- c09b1fb: Add `MasterDetail`, KrabeUI's own list-with-details layout (`krabeui/master-detail`): `MasterDetailList` with `MasterDetailItem` (title, optional second line and badge) and `MasterDetailAction` (e.g. a "+ New" button inside the list) on the left, `MasterDetailContent` and `MasterDetailEmpty` on the right. Controlled (`value`/`onValueChange`) or uncontrolled (`defaultValue`); the selected entry carries `aria-current`, arrow keys/Home/End move between entries. The list sits above the details on narrow screens and scrolls when it is longer than the screen.
- c09b1fb: Typography: no letter-spacing (tracking) on h1-h4, h2 loses its underline, and the default bottom margin is `mb-4`.

## 0.4.1

### Patch Changes

- Ship the `accordion-down`/`accordion-up` keyframes and `--animate-accordion-*` tokens in `krabeui/styles.css` itself, so `Accordion` animates without relying on `tw-animate-css` or shadcn's `tailwind.css` providing them.

## 0.4.0

### Minor Changes

- **Breaking:** Rename `Sonner` to `Toast`, the more common name. The subpath export is now `krabeui/toast`; `krabeui/sonner` is removed, so change `import { Toaster } from "krabeui/sonner"` to `"krabeui/toast"`. `krabeui/toast` also re-exports `toast()`, so `import { Toaster, toast } from "krabeui/toast"` works without depending on `sonner` directly and always reaches the same `sonner` instance as `<Toaster />`. The Storybook page moves from Components/Sonner to Components/Toast.
- Add `Alert`, `Accordion` and `Lightbox`, each with its own `krabeui/<component>` subpath export and Storybook coverage.

  - `Alert` is shadcn's, plus a `success` variant using the new `--success` token.
  - `Accordion` is shadcn's (Radix `Accordion`).
  - `Lightbox` is KrabeUI's own image viewer on Radix `Dialog`: `<Lightbox images>` with `<LightboxTrigger index>` around your own previews, previous/next buttons, arrow keys, a counter, a thumbnail strip, touch swipes to page and to close, controllable `open`/`index`, and translatable `labels`.

- Add a `success` variant to `Badge`, styled like `destructive` but green. It uses a new `--success` token (`bg-success`, `text-success`, ...), with defaults for light and dark mode that projects can override like any other token.

## 0.3.0

### Minor Changes

- Add Command (built on `cmdk`, with `CommandDialog` for command palettes), Sheet, Skeleton, and Slider, each with its own `krabeui/<component>` subpath export and Storybook coverage.

  `Sheet` goes beyond shadcn's version: on touch devices it closes when swiped toward its edge (past a quarter of its size, or with a quick flick), and snaps back otherwise. Mouse drags never swipe; swipes starting in inputs, sliders, or elements with `data-sheet-no-swipe` are ignored, and scrollable content scrolls before the sheet moves. Opt out with `<SheetContent swipeToClose={false}>`.

  KrabeUI deliberately ships no `Drawer`: when shadcn offers several components for the same job, only the Radix-based one is included, so edge-anchored panels are always a `Sheet` (Radix `Dialog`) rather than shadcn's `vaul`-based `Drawer`.

## 0.2.0

### Minor Changes

- **Breaking:** `Button`'s `icon`/`icon-xs`/`icon-sm`/`icon-lg` size values are removed. Icon-only buttons are now a boolean `icon` prop combined with the regular `size` (`xs`/`sm`/`md`/`lg`), e.g. `size="lg" icon` replaces `size="icon-lg"`. When `icon` is set, any plain-text children are no longer rendered, so an icon-only button's accessible name should come from `aria-label` instead.

  Also, an icon child tagged `data-icon="inline-start"` or `data-icon="inline-end"` now actually controls its visual position (via `order`), instead of only affecting padding as before.

- `DropdownMenuTrigger` now renders a chevron-down indicator after its content by default; pass `showChevron={false}` to opt out.

  Fixed `--font-heading` so it can actually be overridden independently of `--font-sans` -- it now falls back to `--font-sans` only when a project doesn't set it, instead of always resolving to the main font regardless of what a project sets `--font-heading` to.

- Add Field, Separator, Tabs, Typography, AspectRatio, Breadcrumb, ButtonGroup, InputGroup, Combobox, Empty, RadioGroup, Sonner (Toaster), Spinner, Switch, Textarea, Toggle, ToggleGroup, and Tooltip, each with its own `krabeui/<component>` subpath export and Storybook coverage. `Combobox` is built on Base UI's `Combobox` rather than Radix, since Radix has no native combobox primitive.

## 0.1.0

### Minor Changes

- 1d6fef3: Initial release: Button, Input, Label, Card, Dialog, Dropdown Menu, Select, Checkbox, Badge, and Table, built on shadcn/ui + Radix primitives, with the KrabeUI CSS custom-property theming layer.
