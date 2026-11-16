import type { Meta, StoryObj } from "@storybook/react-vite"
import { MoreVertical } from "lucide-react"
import { Button } from "./button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu"
import { FileTile, FileTileGrid } from "./file-tile"

const meta = {
  title: "Components/File Tile",
  component: FileTile,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "Small tiles for documents or other files (KrabeUI's own, shadcn has none). `FileTileGrid` lays them out side by side and wraps them on narrow screens.",
          "Each `FileTile` shows an icon by the extension of `name` (PDF, image, other; override with `kind`) or an image `preview`, the name on up to two lines and an optional `meta` line such as type and size.",
          "With `href` the whole tile is the link (`target=\"_blank\"` sets `rel=\"noreferrer\"`). `actions`, e.g. a `DropdownMenu`, sit in the top-right corner and stay clickable on their own.",
          "```tsx",
          'import { FileTile, FileTileGrid } from "krabeui/file-tile"',
          "```",
        ].join("\n"),
      },
    },
  },
  args: {
    name: "Invitation to tender 2027.pdf",
    href: "#",
    meta: "PDF · 240 KB",
  },
} satisfies Meta<typeof FileTile>

export default meta

type Story = StoryObj<typeof meta>

// Small inline image so the preview story needs no network.
const PREVIEW = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="90"><rect width="160" height="90" fill="#cbd5e1"/><path d="M10 70 C 50 10, 90 90, 150 25" stroke="#475569" stroke-width="6" fill="none"/></svg>'
)}`

export const Default: Story = {
  render: (args) => (
    <FileTileGrid className="max-w-md">
      <FileTile {...args} />
    </FileTileGrid>
  ),
}

export const Grid: Story = {
  render: () => (
    <FileTileGrid className="max-w-2xl">
      <FileTile name="Invitation to tender 2027.pdf" href="#" meta="PDF · 240 KB" />
      <FileTile name="Schedule.pdf" href="#" meta="PDF · 80 KB" />
      <FileTile name="Track map.png" href="#" meta="PNG · 1.1 MB" preview={PREVIEW} />
      <FileTile name="Directions and paddock for teams arriving on Saturday.jpg" href="#" meta="JPG · 2.4 MB" />
      <FileTile name="Results.xlsx" href="#" meta="XLSX · 32 KB" />
    </FileTileGrid>
  ),
}

function TileActions({ name }: { name: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="xs" icon aria-label={`Actions for ${name}`}>
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Rename</DropdownMenuItem>
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const WithActions: Story = {
  render: () => (
    <FileTileGrid className="max-w-2xl">
      <FileTile name="Invitation to tender 2027.pdf" href="#" meta="PDF · 240 KB" actions={<TileActions name="Invitation to tender 2027.pdf" />} />
      <FileTile name="Track map.png" href="#" meta="PNG · 1.1 MB" preview={PREVIEW} actions={<TileActions name="Track map.png" />} />
    </FileTileGrid>
  ),
}

export const WithoutLink: Story = {
  args: { href: undefined, meta: "Uploading …" },
  render: (args) => (
    <FileTileGrid className="max-w-md">
      <FileTile {...args} />
    </FileTileGrid>
  ),
}
