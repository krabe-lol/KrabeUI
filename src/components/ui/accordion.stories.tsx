import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion"

const meta = {
  title: "Components/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A vertically stacked set of interactive headings that each reveal a section of content, built on Radix `Accordion`.",
          "```tsx",
          'import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "krabeui/accordion"',
          "```",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof Accordion>

export default meta

type Story = StoryObj<typeof meta>

export const Single: Story = {
  args: { type: "single", collapsible: true, defaultValue: "item-1" },
  render: (args) => (
    <Accordion {...args} className="w-96">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It follows the WAI-ARIA accordion pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It uses the same design tokens as the other components.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. Items expand and collapse with a short height animation.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const Multiple: Story = {
  args: { type: "multiple", defaultValue: ["item-1", "item-2"] },
  render: (args) => (
    <Accordion {...args} className="w-96">
      <AccordionItem value="item-1">
        <AccordionTrigger>Shipping</AccordionTrigger>
        <AccordionContent>
          Orders ship within two business days.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Returns</AccordionTrigger>
        <AccordionContent>
          You can return items within 30 days of delivery.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Support</AccordionTrigger>
        <AccordionContent>
          Our support team is available around the clock.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const Disabled: Story = {
  args: { type: "single", collapsible: true },
  render: (args) => (
    <Accordion {...args} className="w-96">
      <AccordionItem value="item-1">
        <AccordionTrigger>Available section</AccordionTrigger>
        <AccordionContent>This section can be opened.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" disabled>
        <AccordionTrigger>Disabled section</AccordionTrigger>
        <AccordionContent>This section cannot be opened.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Another available section</AccordionTrigger>
        <AccordionContent>This section can be opened too.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}
