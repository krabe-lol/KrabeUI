import type { Meta, StoryObj } from "@storybook/react-vite"
import { Badge } from "./badge"

const meta = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A small label for status, counts, or metadata.",
          "```tsx",
          'import { Badge } from "krabeui/badge"',
          "```",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "success", "outline", "ghost", "link"],
    },
    asChild: {
      description:
        "Renders as the single child element instead of a <span> (Radix Slot). The child must be one valid element, so the Playground swaps the label into a link when this is on.",
    },
  },
  args: {
    children: "Badge",
    variant: "default",
  },
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: ({ asChild, children, ...args }) => (
    <>
      {asChild ? (
        <Badge asChild {...args}>
          <a href="#story">{children}</a>
        </Badge>
      ) : (
        <Badge {...args}>{children}</Badge>
      )}
    </>
  ),
}

export const Success: Story = {
  args: {
    variant: "success",
    children: "Success",
  },
}
