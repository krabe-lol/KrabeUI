import type { Meta, StoryObj } from "@storybook/react-vite"
import { Slider } from "./slider"

const meta = {
  title: "Components/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A control for picking a number (or a range, with two thumbs) by dragging along a track, built on Radix `Slider`. One thumb is rendered per entry in `value`/`defaultValue`.",
          "```tsx",
          'import { Slider } from "krabeui/slider"',
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
    max: 100,
    step: 1,
  },
} satisfies Meta<typeof Slider>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <>
      <div className="flex w-64 flex-col gap-8">
        <Slider {...args} defaultValue={[50]} aria-label="Volume" />
        <Slider {...args} defaultValue={[25, 75]} aria-label="Price range" />
        <Slider {...args} defaultValue={[30]} disabled aria-label="Disabled" />
      </div>
      <div className="mt-8 flex h-40 gap-8">
        <Slider {...args} defaultValue={[60]} orientation="vertical" aria-label="Bass" />
        <Slider {...args} defaultValue={[20, 80]} orientation="vertical" aria-label="Band" />
      </div>
    </>
  ),
}
