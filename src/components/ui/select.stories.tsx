import type { Meta, StoryObj } from "@storybook/react-vite"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./select"

const meta = {
  title: "Components/Select",
  component: Select,
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const frameworks = ["React", "Vue", "Svelte", "Solid"]

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-48">
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
  ),
}

export const WithDefaultValue: Story = {
  render: () => (
    <Select defaultValue="react">
      <SelectTrigger className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {frameworks.map((f) => (
          <SelectItem key={f} value={f.toLowerCase()}>
            {f}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
}

export const SmallSize: Story = {
  render: () => (
    <Select defaultValue="react">
      <SelectTrigger size="sm" className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {frameworks.map((f) => (
          <SelectItem key={f} value={f.toLowerCase()}>
            {f}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Select disabled defaultValue="react">
      <SelectTrigger className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {frameworks.map((f) => (
          <SelectItem key={f} value={f.toLowerCase()}>
            {f}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
}

export const WithGroups: Story = {
  render: () => (
    <Select defaultOpen>
      <SelectTrigger className="w-48">
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
  ),
}
