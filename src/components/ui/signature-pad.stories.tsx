import { useState, type ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { SignaturePad } from "./signature-pad"

const meta = {
  title: "Components/Signature Pad",
  component: SignaturePad,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A surface for drawing a signature with mouse, finger or pen (KrabeUI's own, shadcn has none).",
          "`onChange` receives a PNG data URL after every stroke — always black ink on white, like a signature on paper — or `null` once cleared.",
          "Texts are set via `placeholder`, `clearLabel` and `label` (accessible name). Set `aria-invalid` to mark it as missing.",
          "```tsx",
          'import { SignaturePad } from "krabeui/signature-pad"',
          "```",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    disabled: { control: "boolean" },
    height: { control: { type: "number", min: 80, max: 400, step: 20 } },
  },
  args: {
    disabled: false,
    height: 160,
    placeholder: "Sign here",
    clearLabel: "Clear",
    label: "Signature",
  },
} satisfies Meta<typeof SignaturePad>

export default meta

type Story = StoryObj<typeof meta>

function WithPreview(args: ComponentProps<typeof SignaturePad>) {
  const [value, setValue] = useState<string | null>(null)
  return (
    <div className="max-w-md space-y-4">
      <SignaturePad {...args} onChange={setValue} aria-invalid={value === null || undefined} />
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Exported image:</p>
        {value ? (
          <img src={value} alt="Exported signature" className="h-20 rounded-md border border-border" />
        ) : (
          <p className="text-sm text-muted-foreground">– nothing drawn yet –</p>
        )}
      </div>
    </div>
  )
}

export const Default: Story = {
  render: (args) => <WithPreview {...args} />,
}

export const German: Story = {
  args: {
    placeholder: "Hier unterschreiben",
    clearLabel: "Löschen",
    label: "Unterschrift",
  },
  render: (args) => <WithPreview {...args} />,
}

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div className="max-w-md">
      <SignaturePad {...args} />
    </div>
  ),
}
