import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { PasswordInput } from "./password-input"
import { Field, FieldDescription, FieldError, FieldLabel } from "./field"

const meta = {
  title: "Components/Password Input",
  component: PasswordInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A password field with an eye button inside the field that shows or hides the password (KrabeUI's own, shadcn has none). Built on `InputGroup`, so it looks like `Input`.",
          "Takes all props of a normal `<input>` except `type`; `className` sizes the whole field. The toggle is uncontrolled by default (`defaultVisible`), or controlled with `visible` and `onVisibleChange`.",
          'The button has `aria-pressed`, is disabled with the input and never submits a form. Its screen-reader labels are set via `showLabel` and `hideLabel` (defaults "Show password" / "Hide password").',
          "```tsx",
          'import { PasswordInput } from "krabeui/password-input"',
          "```",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    defaultVisible: { control: "boolean" },
  },
  args: {
    placeholder: "Enter your password",
    disabled: false,
    readOnly: false,
    defaultVisible: false,
  },
} satisfies Meta<typeof PasswordInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => <PasswordInput {...args} className="w-64" />,
}

export const InAField: Story = {
  render: (args) => (
    <Field className="w-72">
      <FieldLabel htmlFor="password-input-field">Password</FieldLabel>
      <PasswordInput
        {...args}
        id="password-input-field"
        autoComplete="new-password"
        minLength={12}
        required
      />
      <FieldDescription>Use at least 12 characters.</FieldDescription>
    </Field>
  ),
}

export const Disabled: Story = {
  render: (args) => (
    <PasswordInput {...args} disabled defaultValue="secret" className="w-64" />
  ),
}

export const Invalid: Story = {
  render: (args) => (
    <Field className="w-72" data-invalid>
      <FieldLabel htmlFor="password-input-invalid">Password</FieldLabel>
      <PasswordInput
        {...args}
        id="password-input-invalid"
        aria-invalid
        defaultValue="short"
      />
      <FieldError>The password is too short.</FieldError>
    </Field>
  ),
}

function Controlled(args: React.ComponentProps<typeof PasswordInput>) {
  const [value, setValue] = useState("")
  const [visible, setVisible] = useState(false)
  return (
    <div className="w-72 space-y-3">
      <PasswordInput
        {...args}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        visible={visible}
        onVisibleChange={setVisible}
      />
      <p className="text-sm text-muted-foreground">
        Password is {visible ? "shown" : "hidden"}.
      </p>
    </div>
  )
}

export const ControlledVisibility: Story = {
  render: (args) => <Controlled {...args} />,
}
