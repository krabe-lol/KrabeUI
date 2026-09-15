import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select"

type SelectPlaygroundArgs = ComponentProps<typeof Select> & {
  triggerSize?: "default" | "sm"
}

const meta: Meta<SelectPlaygroundArgs> = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A dropdown for choosing one value from a list, built on Radix `Select`.",
          "```tsx",
          'import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "krabeui/select"',
          "```",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    disabled: { control: "boolean" },
    triggerSize: {
      control: "select",
      options: ["default", "sm"],
      description: "Preview SelectTrigger's size prop (not a real Select prop).",
    },
  },
  args: {
    disabled: false,
    triggerSize: "default",
  },
}

export default meta

type Story = StoryObj<typeof meta>

const frameworks = ["React", "Vue", "Svelte", "Solid"]

export const Default: Story = {
  render: ({ triggerSize, ...args }) => (
    <>
      <Select {...args}>
        <SelectTrigger size={triggerSize} className="w-48">
          <SelectValue placeholder="Pick a framework" />
        </SelectTrigger>
        <SelectContent>
          {frameworks.map((f) => (
            <SelectItem key={f} value={f.toLowerCase()}>
              {f}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select defaultOpen>
        <SelectTrigger className="w-48 mt-8">
          <SelectValue placeholder="Pick a timezone" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Americas</SelectLabel>
            <SelectItem value="pst">Pacific (PST)</SelectItem>
            <SelectItem value="est">Eastern (EST)</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Europe</SelectLabel>
            <SelectItem value="cet">Central European (CET)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  ),
}
