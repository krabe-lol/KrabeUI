import type { Meta, StoryObj } from "@storybook/react-vite"
import { AspectRatio } from "./aspect-ratio"

const meta = {
  title: "Components/AspectRatio",
  component: AspectRatio,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "Constrains content to a fixed width/height ratio, built on Radix `AspectRatio`.",
          "```tsx",
          'import { AspectRatio } from "krabeui/aspect-ratio"',
          "```",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    ratio: {
      control: "number",
    },
  },
  args: {
    ratio: 16 / 9,
  },
} satisfies Meta<typeof AspectRatio>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <>
      <div className="w-96">
        <AspectRatio {...args} className="overflow-hidden rounded-lg bg-muted">
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            16:9
          </div>
        </AspectRatio>
      </div>
    </>
  ),
}
