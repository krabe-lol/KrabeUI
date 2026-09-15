import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"
import { Input } from "./input"
import { Label } from "./label"

type LabelPlaygroundArgs = ComponentProps<typeof Label> & {
  inputDisabled?: boolean
}

const meta: Meta<LabelPlaygroundArgs> = {
  title: "Components/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "An accessible label for a form control, built on Radix `Label`.",
          "```tsx",
          'import { Label } from "krabeui/label"',
          "```",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    inputDisabled: {
      control: "boolean",
      description:
        "Toggle the paired input's disabled state to preview peer-disabled styling (not a real Label prop).",
    },
  },
  args: {
    children: "Email address",
    inputDisabled: false,
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: ({ inputDisabled, children, ...args }) => (
    <>
      {/* peer-disabled only applies to a label that comes *after* the peer
          element in the DOM (CSS general sibling combinator). */}
      <div className="grid gap-1.5">
        <Input
          id="playground-input"
          disabled={inputDisabled}
          placeholder="you@example.com"
          className="peer"
        />
        <Label htmlFor="playground-input" {...args}>
          {children}
        </Label>
      </div>
    </>
  ),
}
