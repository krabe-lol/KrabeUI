import type { Meta, StoryObj } from "@storybook/react-vite"
import { Textarea } from "./textarea"

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A multi-line text field for user input.",
          "```tsx",
          'import { Textarea } from "krabeui/textarea"',
          "```",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    disabled: { control: "boolean" },
  },
  args: {
    placeholder: "Type your message here.",
    disabled: false,
  },
} satisfies Meta<typeof Textarea>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <>
      <Textarea {...args} className="w-64" />
    </>
  ),
}
