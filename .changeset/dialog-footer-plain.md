---
"krabeui": minor
---

`DialogFooter` (`krabeui/dialog`) is now just the row of buttons: the grey strip with the top border, the muted background, the rounded bottom corners and its own padding are gone, and the footer no longer reaches to the dialog edges (no negative margins). The spacing to the content above comes from the gap of `DialogContent`. Visible change for every dialog with a footer in projects that move to this version.
