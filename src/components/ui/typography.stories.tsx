import type { Meta, StoryObj } from "@storybook/react-vite"
import { Typography } from "./typography"

const meta = {
  title: "Components/Typography",
  component: Typography,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "Text primitives -- headings, paragraph, list, quote, and inline styles -- for consistent typography across an app.",
          "```tsx",
          'import { Typography } from "krabeui/typography"',
          "```",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "h1",
        "h2",
        "h3",
        "h4",
        "p",
        "blockquote",
        "list",
        "inlineCode",
        "lead",
        "large",
        "small",
        "muted",
      ],
    },
  },
  args: {
    variant: "h1",
    children: "The quick brown fox",
  },
} satisfies Meta<typeof Typography>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <>
      <Typography {...args} />
    </>
  ),
}

export const Scale: Story = {
  render: () => (
    <>
      <div className="w-lg space-y-4">
        <Typography variant="h1">Taxing Laughter: The Joke Tax Chronicles</Typography>
        <Typography variant="lead">
          Once upon a time, in a far-off land, there lived a king who decided to tax jokes.
        </Typography>
        <Typography variant="h2">The King&apos;s Decree</Typography>
        <Typography variant="p">
          The king thought long and hard, and finally came up with a brilliant plan: tax the
          jokes in the kingdom.
        </Typography>
        <Typography variant="h3">The Joke Tax</Typography>
        <Typography variant="p">
          The king&apos;s subjects were not amused. They grumbled and complained, but the king was
          firm.
        </Typography>
        <Typography variant="h4">Types of jokes taxed</Typography>
        <Typography variant="list">
          <li>Knock-knock jokes</li>
          <li>Funny puns</li>
          <li>Wit and word play</li>
        </Typography>
        <Typography variant="blockquote">
          &quot;After all,&quot; he said, &quot;everyone enjoys a good joke, so it&apos;s only
          fair that they should pay for the privilege.&quot;
        </Typography>
        <Typography variant="p">
          The king kept the tax low, at just{" "}
          <Typography variant="inlineCode">1 gold coin</Typography> per joke.
        </Typography>
        <Typography variant="large">Large text for emphasis.</Typography>
        <Typography variant="small">Small text for fine print.</Typography>
        <Typography variant="muted">Muted text for secondary information.</Typography>
      </div>
    </>
  ),
}
