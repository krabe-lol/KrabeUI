import type { Meta, StoryObj } from "@storybook/react-vite"
import { SearchIcon } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "./input-group"

const meta = {
  title: "Components/InputGroup",
  component: InputGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "Wraps an input with leading/trailing addons -- icons, text, or buttons -- inside one bordered control.",
          "```tsx",
          'import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupButton } from "krabeui/input-group"',
          "```",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof InputGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <>
      <InputGroup className="w-64">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search..." />
      </InputGroup>
      <InputGroup className="mt-8 w-64">
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="example.com" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="xs">Copy</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </>
  ),
}
