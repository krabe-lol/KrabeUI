import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"
import { Badge } from "./badge"
import { SideNav, SideNavItem } from "./side-nav"

const pages = [
  { key: "overview", label: "Overview" },
  { key: "members", label: "Members" },
  { key: "events", label: "Events" },
  { key: "invoices", label: "Invoices" },
  { key: "settings", label: "Settings with a longer label that wraps" },
]

const meta = {
  title: "Components/Side Nav",
  component: SideNav,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A vertical menu of links, e.g. the sub-menu left of a page. KrabeUI-only -- shadcn has no equivalent. Use it when every entry has its own address; use `Tabs` when the entries switch panels on the same page.",
          "",
          "- `SideNav` is a `<nav>` with a list inside; `aria-label` is required. It has a divider on its right and is as tall as the content next to it when it is a flex item. Set its width with `className`.",
          '- `SideNavItem` is a link (`<a>`). `active` marks the current page: `aria-current="page"` and the highlighted look (`bg-muted`, rounded on the left only). Other props go to the link.',
          "- `asChild` renders the child instead, e.g. a router `Link`, so the app does the routing and middle click / open in new tab keep working.",
          "- Children are free: a label, an icon, a `Badge` or a notification dot.",
          "",
          'Looks like vertical `Tabs` (`variant="line"`) and `MasterDetailList`.',
          "```tsx",
          'import { SideNav, SideNavItem } from "krabeui/side-nav"',
          "```",
        ].join("\n"),
      },
    },
  },
  args: {
    "aria-label": "Sections",
    className: "w-56",
  },
} satisfies Meta<typeof SideNav>

export default meta

type Story = StoryObj<typeof meta>

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-8">
      {children}
      <div className="min-w-0 flex-1 text-sm text-muted-foreground">
        The content of the current page.
      </div>
    </div>
  )
}

export const Default: Story = {
  render: (args) => (
    <Frame>
      <SideNav {...args}>
        {pages.map((page) => (
          <SideNavItem key={page.key} href={`#${page.key}`} active={page.key === "members"}>
            {page.label}
          </SideNavItem>
        ))}
      </SideNav>
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole("navigation", { name: "Sections" })).toBeInTheDocument()
    await expect(canvas.getByRole("link", { name: "Members" })).toHaveAttribute(
      "aria-current",
      "page"
    )
    await expect(canvas.getByRole("link", { name: "Overview" })).not.toHaveAttribute(
      "aria-current"
    )
  },
}

export const WithBadge: Story = {
  render: (args) => (
    <Frame>
      <SideNav {...args}>
        <SideNavItem href="#overview">Overview</SideNavItem>
        <SideNavItem href="#members" active>
          <span className="flex w-full items-center justify-between gap-2">
            Members
            <Badge variant="secondary">3</Badge>
          </span>
        </SideNavItem>
        <SideNavItem href="#events">
          <span className="relative">
            Events
            <span
              aria-hidden
              className="absolute -top-0.5 -right-2.5 size-2 rounded-full bg-destructive"
            />
          </span>
        </SideNavItem>
      </SideNav>
    </Frame>
  ),
}

// A router `Link` stands in for any link component: `asChild` hands the
// styling and `aria-current` to it.
function RouterLink({ to, ...props }: React.ComponentProps<"a"> & { to: string }) {
  return <a href={to} {...props} />
}

export const AsChild: Story = {
  render: (args) => (
    <Frame>
      <SideNav {...args}>
        {pages.slice(0, 3).map((page) => (
          <SideNavItem key={page.key} asChild active={page.key === "overview"}>
            <RouterLink to={`#${page.key}`}>{page.label}</RouterLink>
          </SideNavItem>
        ))}
      </SideNav>
    </Frame>
  ),
}

export const Disabled: Story = {
  render: (args) => (
    <Frame>
      <SideNav {...args}>
        <SideNavItem href="#overview" active>
          Overview
        </SideNavItem>
        <SideNavItem aria-disabled="true">Invoices (not available)</SideNavItem>
      </SideNav>
    </Frame>
  ),
}
