import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, within } from "storybook/test"
import { PlusIcon } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion"
import { Badge } from "./badge"
import { Button } from "./button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import {
  MasterDetail,
  MasterDetailAction,
  MasterDetailContent,
  MasterDetailEmpty,
  MasterDetailItem,
  MasterDetailList,
} from "./master-detail"

const races = [
  { id: "r1", name: "Season opener", date: "12 Apr 2027", place: "Hamburg", open: true },
  { id: "r2", name: "Spring cup", date: "03 May 2027", place: "Kiel", open: true },
  { id: "r3", name: "Harbor race", date: "21 Jun 2027", place: "Lübeck", open: false },
  { id: "r4", name: "Summer night", date: "17 Jul 2027", place: "Bremen", open: false },
  { id: "r5", name: "Autumn cup", date: "05 Sep 2027", place: "Rostock", open: false },
  { id: "r6", name: "Final", date: "10 Oct 2027", place: "Hamburg", open: false },
  { id: "r7", name: "Night sprint", date: "24 Oct 2027", place: "Kiel", open: false },
  { id: "r8", name: "Trophy", date: "07 Nov 2027", place: "Bremen", open: false },
]

const classes = ["Class A", "Class B", "Class C"]

const meta = {
  title: "Components/Master Detail",
  component: MasterDetail,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A list of entries on the left and the details of the selected entry on the right. KrabeUI-only -- shadcn has no equivalent.",
          "",
          "- `MasterDetail` holds the selection: controlled with `value` / `onValueChange`, or uncontrolled with `defaultValue`.",
          "- `MasterDetailList` is a `<nav>`; give it an `aria-label`. Put `MasterDetailItem`s and `MasterDetailAction`s inside.",
          '- `MasterDetailItem` (`value`, `title`, optional `description` and `badge`) is a button; the selected one has `aria-current` and `data-state="active"`. Arrow up/down, Home and End move the focus, Enter/Space selects. Once an entry is selected only it is a tab stop.',
          '- `MasterDetailAction` is part of the list but no entry, e.g. a "+ New race" button. It scrolls with the entries.',
          '- `MasterDetailContent` holds the details; `MasterDetailEmpty` is a placeholder for "nothing selected" or "no entries".',
          "",
          "From the `md` breakpoint on the list is a 16rem column that stays in view (sticky) and scrolls when it is taller than the screen. Below, the list sits above the details with a limited height and scrolls.",
          "```tsx",
          "import {",
          "  MasterDetail, MasterDetailList, MasterDetailItem,",
          "  MasterDetailAction, MasterDetailContent, MasterDetailEmpty,",
          '} from "krabeui/master-detail"',
          "```",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof MasterDetail>

export default meta

type Story = StoryObj<typeof meta>

function RaceDemo() {
  const [value, setValue] = React.useState("r1")
  const race = races.find((r) => r.id === value)
  return (
    <MasterDetail value={value} onValueChange={setValue} className="max-w-4xl">
      <MasterDetailList aria-label="Races">
        <MasterDetailAction>
          <Button variant="outline" size="sm">
            <PlusIcon /> New race
          </Button>
        </MasterDetailAction>
        {races.map((r) => (
          <MasterDetailItem
            key={r.id}
            value={r.id}
            title={r.name}
            description={`${r.date} · ${r.place}`}
            badge={r.open ? <Badge variant="success">Open</Badge> : undefined}
          />
        ))}
      </MasterDetailList>
      <MasterDetailContent>
        {race ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>{race.name}</CardTitle>
                <CardDescription>
                  {race.date} · {race.place}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Documents and announcements for this race.
              </CardContent>
            </Card>
            <Accordion type="multiple" defaultValue={[classes[0]]}>
              {classes.map((c) => (
                <AccordionItem key={c} value={c}>
                  <AccordionTrigger>{c}</AccordionTrigger>
                  <AccordionContent>
                    Entries of {c} for {race.name}.
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </>
        ) : null}
      </MasterDetailContent>
    </MasterDetail>
  )
}

export const Default: Story = {
  render: () => <RaceDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const first = canvas.getByRole("button", { name: /Season opener/ })
    const second = canvas.getByRole("button", { name: /Spring cup/ })
    await expect(first).toHaveAttribute("aria-current", "true")
    first.focus()
    await userEvent.keyboard("{ArrowDown}")
    await expect(second).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    await expect(second).toHaveAttribute("aria-current", "true")
    await expect(first).not.toHaveAttribute("aria-current")
  },
}

export const Uncontrolled: Story = {
  render: () => (
    <MasterDetail defaultValue="a" className="max-w-3xl">
      <MasterDetailList aria-label="Entries">
        <MasterDetailItem value="a" title="First" />
        <MasterDetailItem value="b" title="Second" description="With a second line" />
        <MasterDetailItem value="c" title="Disabled" disabled />
      </MasterDetailList>
      <MasterDetailContent>
        <p className="text-sm text-muted-foreground">Details of the selected entry.</p>
      </MasterDetailContent>
    </MasterDetail>
  ),
}

export const Empty: Story = {
  render: () => (
    <MasterDetail className="max-w-4xl">
      <MasterDetailList aria-label="Races">
        <MasterDetailAction>
          <Button variant="outline" size="sm">
            <PlusIcon /> New race
          </Button>
        </MasterDetailAction>
      </MasterDetailList>
      <MasterDetailContent>
        <MasterDetailEmpty>No races in this season yet. Create the first one.</MasterDetailEmpty>
      </MasterDetailContent>
    </MasterDetail>
  ),
}
