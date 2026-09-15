import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "./button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A popup shown on hover/focus with a short hint, built on Radix `Tooltip`.",
          "```tsx",
          'import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "krabeui/tooltip"',
          "```",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof Tooltip>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>Add to library</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  ),
}
