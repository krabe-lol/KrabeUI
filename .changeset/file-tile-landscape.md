---
"krabeui": minor
---

`FileTile` (`krabeui/file-tile`) is now a compact landscape tile: a small format icon (or image `preview`) on the left, name and `meta` in the middle on one line each (two lines of text in total), and a new download button on the right (`<a download>` for `href`, or `downloadHref`; label via `downloadLabel`, default "Download"). `actions` sit after the download button instead of in the top-right corner. More formats get their own icon: document, spreadsheet, presentation, archive, video and audio besides PDF and image (`kind` accepts them too). `FileTileGrid` columns are at least 16rem wide.
