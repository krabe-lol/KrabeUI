import type { Meta, StoryObj } from "@storybook/react-vite"
import { Input } from "./input"
import { Label } from "./label"

const meta = {
  title: "Components/Label",
  component: Label,
  args: {
    children: "Email address",
  },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithInput: Story = {
  render: () => (
    <div className="grid gap-1.5">
      <Label htmlFor="story-email">Email</Label>
      <Input id="story-email" placeholder="you@example.com" />
    </div>
  ),
}

export const WithDisabledInput: Story = {
  name: "With disabled input (peer-disabled)",
  render: () => (
    // peer-disabled only applies to a label that comes *after* the peer
    // element in the DOM (CSS general sibling combinator), hence the order.
    <div className="grid gap-1.5">
      <Input id="story-email-disabled" disabled placeholder="you@example.com" className="peer" />
      <Label htmlFor="story-email-disabled">Email</Label>
    </div>
  ),
}
