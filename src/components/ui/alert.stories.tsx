import type { Meta, StoryObj } from "@storybook/react-vite"
import { AlertCircleIcon, CheckCircle2Icon, InfoIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./alert"

const meta = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A callout that displays a short, important message. Use the `default`, `destructive` or `success` variant, with an optional leading icon.",
          "```tsx",
          'import { Alert, AlertTitle, AlertDescription } from "krabeui/alert"',
          "```",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "success"],
    },
  },
  args: {
    variant: "default",
    className: "max-w-md",
  },
} satisfies Meta<typeof Alert>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Alert {...args}>
      <InfoIcon />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the CLI.
      </AlertDescription>
    </Alert>
  ),
}

export const Destructive: Story = {
  args: { variant: "destructive" },
  render: (args) => (
    <Alert {...args}>
      <AlertCircleIcon />
      <AlertTitle>Unable to process your payment</AlertTitle>
      <AlertDescription>
        Please verify your billing information and try again.
      </AlertDescription>
    </Alert>
  ),
}

export const Success: Story = {
  args: { variant: "success" },
  render: (args) => (
    <Alert {...args}>
      <CheckCircle2Icon />
      <AlertTitle>Changes saved</AlertTitle>
      <AlertDescription>
        Your profile has been updated successfully.
      </AlertDescription>
    </Alert>
  ),
}

export const WithoutIcon: Story = {
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Scheduled maintenance</AlertTitle>
      <AlertDescription>
        The service will be unavailable on Sunday between 02:00 and 04:00 UTC.
      </AlertDescription>
    </Alert>
  ),
}
