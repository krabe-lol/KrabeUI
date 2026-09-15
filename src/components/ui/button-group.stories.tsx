import type { Meta, StoryObj } from "@storybook/react-vite"
import { BoldIcon, ChevronDownIcon, ItalicIcon, UnderlineIcon } from "lucide-react"
import { Button } from "./button"
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "./button-group"

const meta = {
  title: "Components/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "Visually groups related buttons, merging their borders/corners together.",
          "```tsx",
          'import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "krabeui/button-group"',
          "```",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
  args: {
    orientation: "horizontal",
  },
} satisfies Meta<typeof ButtonGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <>
      <ButtonGroup {...args}>
        <Button variant="outline" icon>
          <BoldIcon />
        </Button>
        <Button variant="outline" icon>
          <ItalicIcon />
        </Button>
        <Button variant="outline" icon>
          <UnderlineIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup className="mt-8">
        <Button variant="outline">Today</Button>
        <ButtonGroupSeparator />
        <Button variant="outline" icon>
          <ChevronDownIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup className="mt-8">
        <ButtonGroupText>Filter by</ButtonGroupText>
        <Button variant="outline">Status</Button>
        <Button variant="outline">Owner</Button>
      </ButtonGroup>
    </>
  ),
}
