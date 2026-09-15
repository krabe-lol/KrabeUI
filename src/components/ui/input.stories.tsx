import type { Meta, StoryObj } from "@storybook/react-vite"
import { Input } from "./input"
import { Field, FieldDescription, FieldLabel } from "./field"

const meta = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A single-line text field for user input.",
          "```tsx",
          'import { Input } from "krabeui/input"',
          "```",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "file", "tel", "url"],
    },
  },
  args: {
    type: "text",
    placeholder: "you@example.com",
  },
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <>
      <Input {...args} className="w-64" />

      <p className="mt-8">Input in a Field</p>
      <Field>
        <FieldLabel htmlFor="input-field-username">Username</FieldLabel>
          <Input
            id="input-field-username"
            type="text"
            placeholder="Enter your username"
          />
          <FieldDescription>
            Choose a unique username for your account.
          </FieldDescription>
      </Field>
    </>
  ),
}
