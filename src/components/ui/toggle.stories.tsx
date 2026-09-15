import type { Meta, StoryObj } from "@storybook/react-vite"
import { BoldIcon } from "lucide-react"
import { Toggle } from "./toggle"

const meta = {
  title: "Components/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A two-state button that can be on or off, built on Radix `Toggle`.",
          "```tsx",
          'import { Toggle } from "krabeui/toggle"',
          "```",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline"],
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
    },
    disabled: { control: "boolean" },
  },
  args: {
    variant: "default",
    size: "default",
    disabled: false,
  },
} satisfies Meta<typeof Toggle>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <>
      <Toggle {...args} aria-label="Toggle bold">
        <BoldIcon data-icon="inline-start" />
        Bold
      </Toggle>
    </>
  ),
}
