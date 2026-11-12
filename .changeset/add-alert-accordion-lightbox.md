---
"krabeui": minor
---

Add `Alert`, `Accordion` and `Lightbox`, each with its own `krabeui/<component>` subpath export and Storybook coverage.

- `Alert` is shadcn's, plus a `success` variant using the new `--success` token.
- `Accordion` is shadcn's (Radix `Accordion`).
- `Lightbox` is KrabeUI's own image viewer on Radix `Dialog`: `<Lightbox images>` with `<LightboxTrigger index>` around your own previews, previous/next buttons, arrow keys, a counter, a thumbnail strip, touch swipes to page and to close, controllable `open`/`index`, and translatable `labels`.
