import type { Meta, StoryObj } from "@storybook/react-vite"
import { Checkbox } from "./checkbox"
import { Label } from "./label"

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="story-terms" />
      <Label htmlFor="story-terms">Accept terms</Label>
    </div>
  ),
}

export const Checked: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="story-terms-checked" defaultChecked />
      <Label htmlFor="story-terms-checked">Accept terms</Label>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="story-terms-disabled" disabled />
      <Label htmlFor="story-terms-disabled">Accept terms</Label>
    </div>
  ),
}

export const DisabledChecked: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="story-terms-disabled-checked" disabled defaultChecked />
      <Label htmlFor="story-terms-disabled-checked">Accept terms</Label>
    </div>
  ),
}

export const Invalid: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="story-terms-invalid" aria-invalid />
      <Label htmlFor="story-terms-invalid">Accept terms</Label>
    </div>
  ),
}
