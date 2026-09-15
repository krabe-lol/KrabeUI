import type { Meta, StoryObj } from "@storybook/react-vite"
import { toast } from "sonner"
import { Button } from "./button"
import { Toaster } from "./sonner"

const meta = {
  title: "Components/Sonner",
  component: Toaster,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A toast notification renderer, built on `sonner`. Render one `<Toaster />` at the app root, then call `toast()` from anywhere.",
          "```tsx",
          'import { Toaster } from "krabeui/sonner"',
          "```",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof Toaster>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => toast("Event has been created.")}>
          Default
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.success("Changes saved successfully.")}
        >
          Success
        </Button>
        <Button variant="outline" onClick={() => toast.error("Something went wrong.")}>
          Error
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast("Uh oh, something went wrong.", {
              description: "There was a problem with your request.",
              action: {
                label: "Retry",
                onClick: () => toast("Retried"),
              },
            })
          }
        >
          With action
        </Button>
      </div>
    </>
  ),
}
