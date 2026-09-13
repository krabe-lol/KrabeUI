import type { Meta, StoryObj } from "@storybook/react-vite"
import { Input } from "./input"

const meta = {
  title: "Components/Input",
  component: Input,
  args: {
    placeholder: "you@example.com",
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithValue: Story = {
  args: { defaultValue: "hello@krabe.ui" },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Can't touch this" },
}

export const Invalid: Story = {
  args: { "aria-invalid": true, defaultValue: "not-an-email" },
}

export const FileInput: Story = {
  args: { type: "file" },
}
