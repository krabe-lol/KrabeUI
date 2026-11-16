---
"krabeui": minor
---

`Select` (`krabeui/select`): the list now opens below the trigger (`position="popper"` is the default) and shows at most 10.5 items before it scrolls. New `searchable` prop on `SelectContent` adds a search field above the first item that filters items by their text (`textValue`, or plain-text children) while typing; groups and separators without a match are hidden, `searchEmpty` (default "No results found.") shows when nothing matches, Enter picks the first match. Placeholder via `searchPlaceholder` (default "Search…"). `position="item-aligned"` keeps the old placement, but without the height limit and not for use with `searchable`.
