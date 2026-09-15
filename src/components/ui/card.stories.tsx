import type { Meta, StoryObj } from "@storybook/react-vite"
import { Badge } from "./badge"
import { Button } from "./button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card"

const meta = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A container for grouping related content, composed from header, content, and footer sections.",
          "```tsx",
          'import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "krabeui/card"',
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
  },
  args: {
    size: "default",
  },
} satisfies Meta<typeof Card>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <>
      <Card {...args} className="w-80">
        <CardHeader>
          <CardTitle>Project settings</CardTitle>
          <CardDescription>Update your project configuration.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Changes here apply to every environment.
          </p>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </CardFooter>
      </Card>
      <Card className="w-80 mt-8">
        <CardHeader>
          <CardTitle>Deploys</CardTitle>
          <CardDescription>3 pending</CardDescription>
          <CardAction>
            <Badge>Live</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">main@a1b2c3d</p>
        </CardContent>
      </Card>
    </>
  ),
}
