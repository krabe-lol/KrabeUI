import type { Meta, StoryObj } from "@storybook/react-vite"
import { Checkbox } from "./checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "./field"
import { Input } from "./input"

const meta = {
  title: "Components/Field",
  component: Field,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "Layout primitives for composing consistent form fields -- label, control, description, and error state.",
          "```tsx",
          'import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from "krabeui/field"',
          "```",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal", "responsive"],
    },
  },
  args: {
    orientation: "vertical",
  },
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <>
      <FieldSet className="w-80">
        <FieldLegend>Profile</FieldLegend>
        <FieldGroup>
          <Field {...args}>
            <FieldLabel htmlFor="field-name">Name</FieldLabel>
            <Input id="field-name" placeholder="Jane Doe" />
            <FieldDescription>Shown on your public profile.</FieldDescription>
          </Field>
          <Field data-invalid="true">
            <FieldLabel htmlFor="field-email">Email</FieldLabel>
            <Input id="field-email" aria-invalid defaultValue="not-an-email" />
            <FieldError>Enter a valid email address.</FieldError>
          </Field>
          <FieldSeparator />
          <Field orientation="horizontal">
            <Checkbox id="field-notifications" defaultChecked />
            <FieldContent>
              <FieldLabel htmlFor="field-notifications">Email notifications</FieldLabel>
              <FieldDescription>Get notified when something changes.</FieldDescription>
            </FieldContent>
          </Field>
        </FieldGroup>
      </FieldSet>
    </>
  ),
}
