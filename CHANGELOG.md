# krabeui

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
