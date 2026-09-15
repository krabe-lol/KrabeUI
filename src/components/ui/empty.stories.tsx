import type { Meta, StoryObj } from "@storybook/react-vite"
import { InboxIcon } from "lucide-react"
import { Button } from "./button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./empty"

const meta = {
  title: "Components/Empty",
  component: Empty,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A placeholder for a section with no content yet -- an empty inbox, search results, list, etc.",
          "```tsx",
          'import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "krabeui/empty"',
          "```",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof Empty>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <>
      <Empty className="w-96 border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <InboxIcon />
          </EmptyMedia>
          <EmptyTitle>No messages yet</EmptyTitle>
          <EmptyDescription>
            When you receive a message, it will show up here.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="sm">Compose a message</Button>
        </EmptyContent>
      </Empty>
    </>
  ),
}
