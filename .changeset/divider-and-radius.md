---
"krabeui": minor
---

Vertical `Tabs` and `MasterDetail` share one look: a divider line between the list and the content, and the selected entry has a `bg-muted` background without border or indicator bar, rounded on the left (by `--radius`) and always square on the right, where it meets the divider. Vertical `TabsList` no longer has the muted pill background (both variants); `MasterDetailList` shows the divider below itself on narrow screens.

Corner rounding is now always a fraction of `--radius`: the new token `--radius-xs` (× 0.4) joins `--radius-sm` … `--radius-4xl`, and the fixed pixel caps and offsets from shadcn are gone (`Button` xs/sm, `Toggle`/`ToggleGroup` sm, `Select` trigger sm, `Checkbox`, `InputGroup` buttons and kbd, `Tooltip` arrow, inline code in `Typography`). With the default `--radius` the look barely changes; with a large project radius small controls now get rounder too.
