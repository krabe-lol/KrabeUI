---
"krabeui": minor
---

Add `SideNav` and `SideNavItem` (`krabeui/side-nav`): a vertical navigation of real links, e.g. a page's sub-menu. `SideNav` is a `<nav>` (required `aria-label`) with a list inside; `SideNavItem` renders an `<a>` or, with `asChild`, the given child such as a router `Link`. `active` sets `aria-current="page"` and the highlighted look. It looks like vertical `Tabs` (`variant="line"`) and `MasterDetailList`: a divider towards the content, the current entry with `bg-muted`, rounded on the left only. Use it instead of vertical `Tabs` when each entry has its own address.
