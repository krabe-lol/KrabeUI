import type { Meta, StoryObj } from "@storybook/react-vite"
import { CheckIcon, ChevronRightIcon, Loader2Icon } from "lucide-react"
import type { ComponentProps } from "react"
import { Button } from "./button"

type ButtonPlaygroundArgs = ComponentProps<typeof Button> & {
  iconPreview?: "none" | "leading" | "trailing" | "loading"
}

const meta: Meta<ButtonPlaygroundArgs> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A clickable element for triggering an action, built on top of `class-variance-authority` and Radix `Slot`.",
          "```tsx",
          'import { Button } from "krabeui/button"',
          "```",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "destructive", "outline", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    icon: {
      control: "boolean",
      description:
        "Renders an icon-only button: sizes to a square matching the current size (e.g. lg looks like the old icon-lg) and stops rendering any text label.",
    },
    iconPreview: {
      control: "select",
      options: ["none", "leading", "trailing", "loading"],
      description: "Preview an icon alongside the label (not a real Button prop).",
    },
    asChild: {
      description:
        "Renders as the single child element instead of a <button> (Radix Slot). The child must be one valid element, so the Playground swaps the label into a link when this is on.",
    },
  },
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
    icon: false,
    iconPreview: "none",
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: ({ iconPreview, asChild, children, ...args }) => {
    const iconElement =
      iconPreview === "leading" ? (
        <CheckIcon data-icon="inline-start" />
      ) : iconPreview === "trailing" ? (
        <ChevronRightIcon data-icon="inline-end" />
      ) : iconPreview === "loading" ? (
        <Loader2Icon data-icon="inline-start" className="animate-spin" />
      ) : null

    const content =
      iconPreview === "trailing" ? (
        <>
          {children}
          {iconElement}
        </>
      ) : iconElement ? (
        <>
          {iconElement}
          {children}
        </>
      ) : (
        children
      )

    return (
      <>
        {asChild ? (
          <Button asChild {...args}>
            <a href="#story">{content}</a>
          </Button>
        ) : (
          <Button {...args} disabled={args.disabled || iconPreview === "loading"}>
            {content}
          </Button>
        )}
      </>
    )
  },
}
