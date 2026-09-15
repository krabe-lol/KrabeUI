import type { Meta, StoryObj } from "@storybook/react-vite"
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "./toggle-group"

const meta = {
  title: "Components/ToggleGroup",
  component: ToggleGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A set of two-state toggle buttons, single- or multi-select, built on Radix `ToggleGroup`.",
          "```tsx",
          'import { ToggleGroup, ToggleGroupItem } from "krabeui/toggle-group"',
          "```",
        ].join("\n"),
      },
    },
  },
  args: {
    type: "single",
  },
} satisfies Meta<typeof ToggleGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <>
      <ToggleGroup type="single" defaultValue="left">
        <ToggleGroupItem value="left" aria-label="Align left">
          <AlignLeftIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">
          <AlignCenterIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <AlignRightIcon />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="multiple" variant="outline" className="mt-8">
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          <span className="font-bold">B</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          <span className="italic">I</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Toggle underline">
          <span className="underline">U</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </>
  ),
}
