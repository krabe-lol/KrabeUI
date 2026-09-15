import type { Meta, StoryObj } from "@storybook/react-vite"
import { Checkbox } from "./checkbox"
import { Label } from "./label"
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldTitle } from "./field"

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A control for toggling a single boolean value, built on Radix `Checkbox`.",
          "```tsx",
          'import { Checkbox } from "krabeui/checkbox"',
          "```",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
    "aria-invalid": { control: "boolean" },
  },
  args: {
    defaultChecked: false,
    disabled: false,
  },
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <>
      <FieldGroup className="max-w-sm">
        <Field orientation="horizontal">
          <Checkbox id="terms-checkbox" name="terms-checkbox" />
          <Label htmlFor="terms-checkbox">Accept terms and conditions</Label>
        </Field>
        <Field orientation="horizontal">
          <Checkbox
            id="terms-checkbox-2"
            name="terms-checkbox-2"
            defaultChecked
          />
          <FieldContent>
            <FieldLabel htmlFor="terms-checkbox-2">
              Accept terms and conditions
            </FieldLabel>
            <FieldDescription>
              By clicking this checkbox, you agree to the terms.
            </FieldDescription>
          </FieldContent>
        </Field>
        <Field orientation="horizontal" data-disabled>
          <Checkbox id="toggle-checkbox" name="toggle-checkbox" disabled />
          <FieldLabel htmlFor="toggle-checkbox">Enable notifications</FieldLabel>
        </Field>
        <FieldLabel>
          <Field orientation="horizontal">
            <Checkbox id="toggle-checkbox-2" name="toggle-checkbox-2" />
            <FieldContent>
              <FieldTitle>Enable notifications</FieldTitle>
              <FieldDescription>
                You can enable or disable notifications at any time.
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>
      </FieldGroup>
    </>
  ),
}
