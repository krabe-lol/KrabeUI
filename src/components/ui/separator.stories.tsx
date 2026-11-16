import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"
import { Button } from "./button"
import { Separator } from "./separator"

const meta = {
  title: "Components/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A thin line between pieces of content, built on Radix `Separator`. `horizontal` (default) spans the full width; `vertical` stretches to the height of its flex row.",
          "",
          "Children become a label in the middle, with a line on each side (`<Separator>or</Separator>`). The lines stop at the label instead of running behind it, so it works on any background.",
          "",
          "It is decorative by default and hidden from screen readers (a label is still read as plain text). Set `decorative={false}` when the line separates content semantically: it then gets `role=\"separator\"` (plus `aria-orientation=\"vertical\"` when vertical), and a label becomes its accessible name.",
          "```tsx",
          'import { Separator } from "krabeui/separator"',
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
    decorative: { control: "boolean" },
    children: {
      control: "text",
      description: "Optional label shown in the middle of the line.",
    },
  },
  args: {
    orientation: "horizontal",
    decorative: true,
  },
  // A horizontal line needs a block to span, a vertical one a flex row to
  // stretch in, so the surroundings follow the orientation control.
  render: (args) =>
    args.orientation === "vertical" ? (
      <div className={`flex items-center gap-4 text-sm ${args.children ? "h-24" : "h-5"}`}>
        <span>Blog</span>
        <Separator {...args} />
        <span>Docs</span>
        <Separator {...args} />
        <span>Source</span>
      </div>
    ) : (
      <div className="w-72 text-sm">
        <p className="font-medium">KrabeUI</p>
        <p className="text-muted-foreground">A versioned React component library.</p>
        <Separator {...args} className="my-4" />
        <p className="text-muted-foreground">Built on shadcn/ui and Radix.</p>
      </div>
    ),
} satisfies Meta<typeof Separator>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },
}

/** Both orientations together: a heading block above a row of links. */
export const Combined: Story = {
  render: (args) => (
    <div className="w-72 text-sm">
      <p className="font-medium">KrabeUI</p>
      <p className="text-muted-foreground">A versioned React component library.</p>
      <Separator {...args} orientation="horizontal" className="my-4" />
      <div className="flex h-5 items-center gap-4">
        <span>Blog</span>
        <Separator {...args} orientation="vertical" />
        <span>Docs</span>
        <Separator {...args} orientation="vertical" />
        <span>Source</span>
      </div>
    </div>
  ),
}

/** A label in the middle, e.g. between two alternatives. */
export const WithLabel: Story = {
  args: {
    children: "or",
  },
  render: (args) => (
    <div className="flex w-72 flex-col gap-4">
      <Button variant="outline">Sign in with a passkey</Button>
      <Separator {...args} orientation="horizontal" />
      <Button>Sign in with email</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const label = within(canvasElement).getByText("or")
    const separator = label.closest<HTMLElement>("[data-slot=separator]")!
    const [before, , after] = Array.from(separator.children) as HTMLElement[]
    const labelBox = label.getBoundingClientRect()
    const beforeBox = before.getBoundingClientRect()
    const afterBox = after.getBoundingClientRect()

    // Equal lines on both sides, ending at the label, centered on it.
    await expect(beforeBox.height).toBe(1)
    await expect(beforeBox.width).toBeGreaterThan(50)
    await expect(afterBox.width).toBeCloseTo(beforeBox.width, 1)
    await expect(beforeBox.right).toBeLessThan(labelBox.left)
    await expect(afterBox.left).toBeGreaterThan(labelBox.right)
    await expect(beforeBox.top + beforeBox.height / 2).toBeCloseTo(
      labelBox.top + labelBox.height / 2,
      0
    )
  },
}

/** A label in the middle of a vertical line, e.g. between two columns. */
export const VerticalWithLabel: Story = {
  args: {
    children: "or",
    orientation: "vertical",
  },
  render: (args) => (
    <div className="flex h-32 w-96 gap-4 text-sm">
      <div className="flex flex-1 items-center justify-center rounded-lg border p-4">
        Upload a file
      </div>
      <Separator {...args} />
      <div className="flex flex-1 items-center justify-center rounded-lg border p-4">
        Paste a link
      </div>
    </div>
  ),
}

/** `decorative={false}`: screen readers announce the line as a separator. */
export const Semantic: Story = {
  args: {
    decorative: false,
    orientation: "vertical",
  },
  play: async ({ canvasElement }) => {
    const separators = within(canvasElement).getAllByRole("separator")
    await expect(separators).toHaveLength(2)
    for (const separator of separators) {
      await expect(separator).toHaveAttribute("aria-orientation", "vertical")
    }
  },
}

/** A semantic separator with a label takes the label as its accessible name. */
export const SemanticWithLabel: Story = {
  args: {
    decorative: false,
    children: "Archived",
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("separator", { name: "Archived" })
    ).toBeVisible()
  },
}
