import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "./button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu"

const meta = {
  title: "Components/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A menu of actions or options anchored to a trigger, built on Radix `DropdownMenu`.",
          "```tsx",
          'import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "krabeui/dropdown-menu"',
          "```",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof DropdownMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Open menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Edit
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-4">
            View options
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>Name</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>Status</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Owner</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger asChild showChevron={false}>
          <Button variant="outline" className="ml-4">
            No chevron
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>More tools</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Save page as...</DropdownMenuItem>
              <DropdownMenuItem>Create shortcut...</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  ),
}
