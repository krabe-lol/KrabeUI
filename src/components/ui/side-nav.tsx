import * as React from "react"
import { Slot } from "radix-ui"
import { cn } from "cn"

// KrabeUI's own side navigation (shadcn has no equivalent): a vertical menu of
// links, e.g. the sub-menu left of a page. A real navigation, not tabs: every
// entry is a link with its own address, the current one has
// `aria-current="page"`. Looks like vertical `Tabs` (`variant="line"`) and
// `MasterDetailList`: a divider towards the content, the current entry gets
// `bg-muted` and is rounded on the left only.

type SideNavProps = Omit<React.ComponentProps<"nav">, "aria-label"> & {
  /** Name of the navigation for screen readers, e.g. "Management". Required. */
  "aria-label": string
}

function SideNav({ className, children, ...props }: SideNavProps) {
  return (
    <nav
      data-slot="side-nav"
      className={cn(
        // The divider sits on the right; `self-stretch` makes it as tall as
        // the content next to it when the nav is a flex item.
        "w-fit shrink-0 self-stretch border-r",
        className
      )}
      {...props}
    >
      <ul className="flex flex-col items-stretch gap-1">{children}</ul>
    </nav>
  )
}

type SideNavItemProps = React.ComponentProps<"a"> & {
  /** Render the child (e.g. a router `Link`) instead of an `<a>`. */
  asChild?: boolean
  /** The current page: sets `aria-current="page"` and the highlighted look. */
  active?: boolean
}

function SideNavItem({
  asChild,
  active = false,
  className,
  ...props
}: SideNavItemProps) {
  const Comp = asChild ? Slot.Root : "a"

  return (
    <li data-slot="side-nav-item" className="flex flex-col">
      <Comp
        data-slot="side-nav-link"
        data-active={active ? "" : undefined}
        aria-current={active ? "page" : undefined}
        className={cn(
          // Only the left corners are rounded: the current entry reaches the
          // divider, whatever --radius is.
          "relative flex w-full items-center justify-start gap-1.5 rounded-md rounded-r-none border border-transparent px-3 py-2 text-left text-sm font-medium text-foreground/60 transition-colors hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-[current=page]:bg-muted aria-[current=page]:text-foreground dark:text-muted-foreground dark:hover:text-foreground dark:aria-[current=page]:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className
        )}
        {...props}
      />
    </li>
  )
}

export { SideNav, SideNavItem }
