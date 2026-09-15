import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "./combobox"

const frameworks = ["React", "Vue", "Svelte", "Solid", "Angular", "Ember"]

const meta = {
  title: "Components/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A searchable dropdown for choosing a value from a filtered list, built on Base UI `Combobox`.",
          "```tsx",
          'import { Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem } from "krabeui/combobox"',
          "```",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof Combobox>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <>
      <Combobox items={frameworks}>
        <ComboboxInput placeholder="Pick a framework" showClear className="w-64" />
        <ComboboxContent>
          <ComboboxEmpty>No framework found.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </>
  ),
}
