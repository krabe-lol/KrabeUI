---
"krabeui": minor
---

Rename `Sonner` to `Toast`, the more common name. The subpath export is now `krabeui/toast`; `krabeui/sonner` is removed, so change `import { Toaster } from "krabeui/sonner"` to `"krabeui/toast"`. `krabeui/toast` also re-exports `toast()`, so `import { Toaster, toast } from "krabeui/toast"` works without depending on `sonner` directly and always reaches the same `sonner` instance as `<Toaster />`. The Storybook page moves from Components/Sonner to Components/Toast.
