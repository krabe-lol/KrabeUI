---
"krabeui": minor
---

Add expandable rows to `Table` (`krabeui/table`): `TableExpandableRow` renders a row plus, while open, a detail row (`detail` prop, any content such as a nested table) spanning `colSpan` columns on a subtle `bg-muted/30` background. Controlled (`open`/`onOpenChange`) or uncontrolled (`defaultOpen`). `TableExpandTrigger` is a real chevron `button` (rotates when open, `aria-expanded`, `aria-controls`) that can sit in any cell, first or last; its labels are set via `expandLabel`/`collapseLabel` (English defaults "Expand details"/"Collapse details").
