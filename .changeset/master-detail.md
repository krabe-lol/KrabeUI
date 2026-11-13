---
"krabeui": minor
---

Add `MasterDetail`, KrabeUI's own list-with-details layout (`krabeui/master-detail`): `MasterDetailList` with `MasterDetailItem` (title, optional second line and badge) and `MasterDetailAction` (e.g. a "+ New" button inside the list) on the left, `MasterDetailContent` and `MasterDetailEmpty` on the right. Controlled (`value`/`onValueChange`) or uncontrolled (`defaultValue`); the selected entry carries `aria-current`, arrow keys/Home/End move between entries. The list sits above the details on narrow screens and scrolls when it is longer than the screen.
