---
"krabeui": patch
---

`Tabs` (`krabeui/tabs`): `TabsList` and `TabsTrigger` now style themselves by their own orientation instead of the outer `group/tabs`. Horizontal tabs inside vertical tabs (e.g. in the content next to a vertical sub-menu) were shown vertically before. No visible change for tabs that are not nested. Adds the `Nested` story.
