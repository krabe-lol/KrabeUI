import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { CalculatorIcon, CalendarIcon, CreditCardIcon, SettingsIcon, SmileIcon, UserIcon } from "lucide-react"
import { Button } from "./button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./command"

const meta = {
  title: "Components/Command",
  component: Command,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A searchable, keyboard-navigable list of actions, built on `cmdk`. Use it inline, or as a command palette via `CommandDialog`.",
          "```tsx",
          'import { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator, CommandShortcut } from "krabeui/command"',
          "```",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof Command>

export default meta

type Story = StoryObj<typeof meta>

function CommandItems() {
  return (
    <>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Suggestions">
        <CommandItem>
          <CalendarIcon />
          Calendar
        </CommandItem>
        <CommandItem>
          <SmileIcon />
          Search emoji
        </CommandItem>
        <CommandItem disabled>
          <CalculatorIcon />
          Calculator
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Settings">
        <CommandItem>
          <UserIcon />
          Profile
          <CommandShortcut>⌘P</CommandShortcut>
        </CommandItem>
        <CommandItem>
          <CreditCardIcon />
          Billing
          <CommandShortcut>⌘B</CommandShortcut>
        </CommandItem>
        <CommandItem>
          <SettingsIcon />
          Settings
          <CommandShortcut>⌘S</CommandShortcut>
        </CommandItem>
      </CommandGroup>
    </>
  )
}

export const Default: Story = {
  render: () => (
    <>
      <Command className="max-w-sm rounded-lg border">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandItems />
        </CommandList>
      </Command>
    </>
  ),
}

function CommandDialogDemo() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open command palette
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandItems />
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}

export const Palette: Story = {
  render: () => <CommandDialogDemo />,
}
