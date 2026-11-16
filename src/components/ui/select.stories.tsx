import type { Meta, StoryObj } from "@storybook/react-vite"
import type { ComponentProps } from "react"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select"

type SelectPlaygroundArgs = ComponentProps<typeof Select> & {
  triggerSize?: "default" | "sm"
}

const meta: Meta<SelectPlaygroundArgs> = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A dropdown for choosing one value from a list, built on Radix `Select`. The list opens below the trigger and shows at most 10.5 items before it scrolls; `searchable` on `SelectContent` adds a search field above the first item.",
          "```tsx",
          'import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "krabeui/select"',
          "```",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    disabled: { control: "boolean" },
    triggerSize: {
      control: "select",
      options: ["default", "sm"],
      description: "Preview SelectTrigger's size prop (not a real Select prop).",
    },
  },
  args: {
    disabled: false,
    triggerSize: "default",
  },
}

export default meta

type Story = StoryObj<typeof meta>

const frameworks = ["React", "Vue", "Svelte", "Solid"]

export const Default: Story = {
  render: ({ triggerSize, ...args }) => (
    <>
      <Select {...args}>
        <SelectTrigger size={triggerSize} className="w-48">
          <SelectValue placeholder="Pick a framework" />
        </SelectTrigger>
        <SelectContent>
          {frameworks.map((f) => (
            <SelectItem key={f} value={f.toLowerCase()}>
              {f}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select defaultOpen>
        <SelectTrigger className="w-48 mt-8">
          <SelectValue placeholder="Pick a timezone" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Americas</SelectLabel>
            <SelectItem value="pst">Pacific (PST)</SelectItem>
            <SelectItem value="est">Eastern (EST)</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Europe</SelectLabel>
            <SelectItem value="cet">Central European (CET)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  ),
}

const cities = [
  "Amsterdam", "Athens", "Barcelona", "Berlin", "Bratislava", "Brussels",
  "Bucharest", "Budapest", "Copenhagen", "Dublin", "Helsinki", "Lisbon",
  "Ljubljana", "London", "Luxembourg", "Madrid", "Oslo", "Paris", "Prague",
  "Riga", "Rome", "Sofia", "Stockholm", "Tallinn", "Vienna", "Vilnius",
  "Warsaw", "Zagreb",
]

const citiesByCountry = {
  Germany: ["Berlin", "Cologne", "Frankfurt", "Hamburg", "Munich", "Stuttgart"],
  Austria: ["Graz", "Innsbruck", "Linz", "Salzburg", "Vienna"],
  Switzerland: ["Basel", "Bern", "Geneva", "Lausanne", "Zurich"],
}

const toValue = (label: string) => label.toLowerCase()

export const ManyOptions: Story = {
  render: ({ triggerSize, ...args }) => (
    <Select {...args}>
      <SelectTrigger size={triggerSize} className="w-48">
        <SelectValue placeholder="Pick a city" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {cities.map((city) => (
            <SelectItem key={city} value={toValue(city)}>
              {city}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

export const Searchable: Story = {
  render: ({ triggerSize, ...args }) => (
    <Select {...args}>
      <SelectTrigger size={triggerSize} className="w-48">
        <SelectValue placeholder="Pick a city" />
      </SelectTrigger>
      <SelectContent searchable searchPlaceholder="Search cities…">
        {Object.entries(citiesByCountry).map(([country, list]) => (
          <SelectGroup key={country}>
            <SelectLabel>{country}</SelectLabel>
            {list.map((city) => (
              <SelectItem key={city} value={toValue(city)}>
                {city}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  ),
}

const listbox = () => within(document.body).getByRole("listbox")

export const ManyOptionsShowTenAndAHalf: Story = {
  ...ManyOptions,
  tags: ["!autodocs"],
  args: { defaultOpen: true },
  play: async () => {
    const content = await waitFor(listbox)
    const viewport = content.querySelector<HTMLElement>("[data-slot=select-viewport]")!
    const item = content.querySelector<HTMLElement>("[data-slot=select-item]")!
    await waitFor(() => expect(viewport.clientHeight).toBe(item.offsetHeight * 10.5))
  },
}

export const SearchFiltersItems: Story = {
  ...Searchable,
  tags: ["!autodocs"],
  args: { defaultOpen: true, onValueChange: fn() },
  play: async ({ args, step }) => {
    const content = await waitFor(listbox)
    const search = within(content).getByPlaceholderText("Search cities…")
    const visibleOptions = () =>
      within(content).queryAllByRole("option").map((option) => option.textContent)

    await step("the search field has the focus once the list is open", async () => {
      await waitFor(() => expect(search).toHaveFocus())
    })

    await step("typing filters items and hides groups without a match", async () => {
      await userEvent.keyboard("ER")
      await expect(visibleOptions()).toEqual(["Berlin", "Bern"])
      await expect(within(content).queryByText("Austria")).not.toBeVisible()
      await expect(within(content).queryByText("No results found.")).not.toBeVisible()
    })

    await step("ArrowDown moves to the first match, typing returns to the field", async () => {
      await userEvent.keyboard("{ArrowDown}")
      await waitFor(() => expect(within(content).getByRole("option", { name: "Berlin" })).toHaveFocus())
      await userEvent.keyboard("n")
      await expect(search).toHaveFocus()
      await expect(search).toHaveValue("ERn")
      await expect(visibleOptions()).toEqual(["Bern"])
    })

    await step("without a match the empty text shows", async () => {
      await userEvent.keyboard("x")
      await expect(visibleOptions()).toEqual([])
      await expect(within(content).getByText("No results found.")).toBeVisible()
    })

    await step("Enter picks the first match", async () => {
      await userEvent.clear(search)
      await userEvent.type(search, "zur{Enter}")
      await expect(args.onValueChange).toHaveBeenCalledWith("zurich")
    })
  },
}
