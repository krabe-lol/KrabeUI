import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"

type TabsPlaygroundArgs = ComponentProps<typeof Tabs> & {
  listVariant?: "default" | "line"
}

const meta: Meta<TabsPlaygroundArgs> = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A set of panels shown one at a time, built on Radix `Tabs`.",
          "```tsx",
          'import { Tabs, TabsList, TabsTrigger, TabsContent } from "krabeui/tabs"',
          "```",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    listVariant: {
      control: "select",
      options: ["default", "line"],
      description: "Preview TabsList's variant prop (not a real Tabs prop).",
    },
  },
  args: {
    defaultValue: "account",
    orientation: "horizontal",
    listVariant: "default",
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: ({ listVariant, ...args }) => (
    <>
      <Tabs {...args} className="w-80">
        <TabsList variant={listVariant}>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="settings" disabled>
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <p className="text-sm text-muted-foreground">Update your account details here.</p>
        </TabsContent>
        <TabsContent value="password">
          <p className="text-sm text-muted-foreground">Change your password here.</p>
        </TabsContent>
        <TabsContent value="settings">
          <p className="text-sm text-muted-foreground">Settings are unavailable right now.</p>
        </TabsContent>
      </Tabs>
      <Tabs defaultValue="overview" orientation="vertical" className="mt-12 w-80">
        <TabsList variant="line">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <p className="text-sm text-muted-foreground">Overview content.</p>
        </TabsContent>
        <TabsContent value="activity">
          <p className="text-sm text-muted-foreground">Activity content.</p>
        </TabsContent>
      </Tabs>
    </>
  ),
}
