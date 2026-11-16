---
"krabeui": minor
---

Add `FileTile` and `FileTileGrid` (`krabeui/file-tile`): small tiles for documents or other files, laid out side by side and wrapping on narrow screens. A tile shows an icon by the extension of `name` (PDF, image, other; override with `kind`) or an image `preview`, the name on up to two lines and an optional `meta` line (e.g. type and size). With `href` the whole tile is the link; `actions` (e.g. a `DropdownMenu`) sit in the top-right corner and stay clickable on their own.
