import type { Meta, StoryObj } from "@storybook/react-vite"
import { Skeleton } from "./skeleton"

const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A pulsing placeholder shown in place of content while it loads. Size and shape come entirely from `className`.",
          "```tsx",
          'import { Skeleton } from "krabeui/skeleton"',
          "```",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof Skeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <>
      <div className="flex items-center gap-4">
        <Skeleton {...args} className="size-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton {...args} className="h-4 w-56" />
          <Skeleton {...args} className="h-4 w-40" />
        </div>
      </div>
      <div className="mt-8 flex w-64 flex-col gap-3">
        <Skeleton {...args} className="aspect-video w-full rounded-xl" />
        <Skeleton {...args} className="h-4 w-3/4" />
        <Skeleton {...args} className="h-4 w-1/2" />
      </div>
    </>
  ),
}
