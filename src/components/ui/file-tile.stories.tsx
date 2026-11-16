import type { Meta, StoryObj } from "@storybook/react-vite"
import { MoreVertical } from "lucide-react"
import { expect, within } from "storybook/test"
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
          "Compact landscape tiles for documents or other files (KrabeUI's own, shadcn has none). `FileTileGrid` lays them out side by side and wraps them on narrow screens.",
          "Each `FileTile` shows a small icon for the format by the extension of `name` (PDF, image, document, spreadsheet, presentation, archive, video, audio, other; override with `kind`) or an image `preview` on the left, the name and an optional `meta` line such as type and size in the middle (one line each), and a download button on the right.",
          "With `href` the whole tile is the link (`target=\"_blank\"` sets `rel=\"noreferrer\"`) and the download button downloads it (or `downloadHref`). `actions`, e.g. a `DropdownMenu`, sit after the download button and stay clickable on their own.",
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
    <FileTileGrid className="max-w-sm">
      <FileTile {...args} />
    </FileTileGrid>
  ),
  play: async ({ canvasElement }) => {
    const download = within(canvasElement).getByRole("link", { name: "Download" })
    await expect(download).toHaveAttribute("download")
    await expect(download).toHaveAttribute("href", "#")
    await expect(download).toHaveAccessibleDescription("Invitation to tender 2027.pdf")
  },
}

export const Grid: Story = {
  render: () => (
    <FileTileGrid className="max-w-2xl">
      <FileTile name="Invitation to tender 2027.pdf" href="#" meta="PDF · 240 KB" />
      <FileTile name="Entry form.docx" href="#" meta="DOCX · 45 KB" />
      <FileTile name="Results.xlsx" href="#" meta="XLSX · 32 KB" />
      <FileTile name="Briefing.pptx" href="#" meta="PPTX · 3.8 MB" />
      <FileTile name="Track map.png" href="#" meta="PNG · 1.1 MB" preview={PREVIEW} />
      <FileTile name="Directions and paddock for teams arriving on Saturday.jpg" href="#" meta="JPG · 2.4 MB" />
      <FileTile name="Photos.zip" href="#" meta="ZIP · 48 MB" />
      <FileTile name="Onboard lap.mp4" href="#" meta="MP4 · 120 MB" />
      <FileTile name="Notes" href="#" meta="File · 2 KB" />
    </FileTileGrid>
  ),
}

function TileActions({ name }: { name: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild showChevron={false}>
        <Button variant="ghost" icon aria-label={`Actions for ${name}`}>
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
    <FileTileGrid className="max-w-sm">
      <FileTile {...args} />
    </FileTileGrid>
  ),
}
