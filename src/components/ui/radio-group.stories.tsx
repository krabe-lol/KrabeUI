import type { Meta, StoryObj } from "@storybook/react-vite"
import { Label } from "./label"
import { RadioGroup, RadioGroupItem } from "./radio-group"

const meta = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A set of mutually exclusive options, built on Radix `RadioGroup`.",
          "```tsx",
          'import { RadioGroup, RadioGroupItem } from "krabeui/radio-group"',
          "```",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    disabled: { control: "boolean" },
  },
  args: {
    disabled: false,
    defaultValue: "comfortable",
  },
} satisfies Meta<typeof RadioGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <>
      <RadioGroup {...args} className="w-fit">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="default" id="radio-default" />
          <Label htmlFor="radio-default">Default</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="comfortable" id="radio-comfortable" />
          <Label htmlFor="radio-comfortable">Comfortable</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="compact" id="radio-compact" />
          <Label htmlFor="radio-compact">Compact</Label>
        </div>
      </RadioGroup>
    </>
  ),
}
