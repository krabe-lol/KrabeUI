import type { Meta, StoryObj } from "@storybook/react-vite"
import { Label } from "./label"
import { Switch } from "./switch"

const meta = {
  title: "Components/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A control for toggling a boolean value on/off, built on Radix `Switch`.",
          "```tsx",
          'import { Switch } from "krabeui/switch"',
          "```",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["default", "sm"],
    },
    disabled: { control: "boolean" },
  },
  args: {
    size: "default",
    disabled: false,
    defaultChecked: true,
  },
} satisfies Meta<typeof Switch>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <>
      <div className="flex items-center gap-2">
        <Switch {...args} id="switch-playground" />
        <Label htmlFor="switch-playground">Airplane mode</Label>
      </div>
    </>
  ),
}
