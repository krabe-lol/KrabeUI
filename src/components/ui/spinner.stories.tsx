import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "./button"
import { Spinner } from "./spinner"

const meta = {
  title: "Components/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A spinning loading indicator.",
          "```tsx",
          'import { Spinner } from "krabeui/spinner"',
          "```",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof Spinner>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <>
      <div className="flex items-center gap-4">
        <Spinner {...args} className="size-3" />
        <Spinner {...args} className="size-4" />
        <Spinner {...args} className="size-6" />
        <Spinner {...args} className="size-8" />
      </div>
      <Button disabled className="mt-8">
        <Spinner data-icon="inline-start" />
        Please wait
      </Button>
    </>
  ),
}
