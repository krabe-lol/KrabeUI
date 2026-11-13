import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, userEvent, within } from "storybook/test"
import { Badge } from "./badge"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableExpandableRow,
  TableExpandTrigger,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table"

const meta = {
  title: "Components/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A composable set of primitives for displaying tabular data.",
          "```tsx",
          'import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "krabeui/table"',
          "```",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof Table>

export default meta

type Story = StoryObj<typeof meta>

const rows = [
  { name: "Button", status: "Ready", loc: 66 },
  { name: "Dialog", status: "Ready", loc: 169 },
  { name: "Table", status: "Ready", loc: 114 },
]

export const Default: Story = {
  render: () => (
    <>
      <Table>
        <TableCaption>KrabeUI components.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Lines</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell>
                <Badge variant="secondary">{row.status}</Badge>
              </TableCell>
              <TableCell className="text-right">{row.loc}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Table className="mt-12">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={row.name} data-state={i === 1 ? "selected" : undefined}>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell>
                <Badge variant="secondary">{row.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Table className="mt-12">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Lines</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell className="text-right">{row.loc}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell className="text-right">
              {rows.reduce((sum, r) => sum + r.loc, 0)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  ),
}

const invoices = [
  {
    id: "INV-1042",
    customer: "Meadow Racing Club",
    total: 312.5,
    items: [
      { description: "Entry fee, class A", qty: 2, price: 85 },
      { description: "Transponder rental", qty: 3, price: 12.5 },
      { description: "Late registration", qty: 1, price: 105 },
    ],
  },
  {
    id: "INV-1043",
    customer: "Harbour Motorsport",
    total: 170,
    items: [{ description: "Entry fee, class B", qty: 2, price: 85 }],
  },
]

const money = (value: number) => `${value.toFixed(2)} EUR`

function InvoiceItems({ items }: { items: (typeof invoices)[number]["items"] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead className="text-right">Qty</TableHead>
          <TableHead className="text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.description}>
            <TableCell>{item.description}</TableCell>
            <TableCell className="text-right">{item.qty}</TableCell>
            <TableCell className="text-right">{money(item.price)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export const ExpandableRows: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`TableExpandableRow` renders the row and, while open, a detail row (`detail`) spanning `colSpan` columns. Put `TableExpandTrigger` (a real `button`, so Enter/Space work) in any cell, first or last. Uncontrolled via `defaultOpen`; the button labels are English by default and set via `expandLabel`/`collapseLabel`.",
      },
    },
  },
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10" />
          <TableHead>Invoice</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice, i) => (
          <TableExpandableRow
            key={invoice.id}
            colSpan={4}
            defaultOpen={i === 0}
            detail={<InvoiceItems items={invoice.items} />}
          >
            <TableCell>
              <TableExpandTrigger />
            </TableCell>
            <TableCell className="font-medium">{invoice.id}</TableCell>
            <TableCell>{invoice.customer}</TableCell>
            <TableCell className="text-right">{money(invoice.total)}</TableCell>
          </TableExpandableRow>
        ))}
      </TableBody>
    </Table>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const [first, second] = canvas.getAllByRole("button")
    await expect(first).toHaveAttribute("aria-expanded", "true")
    await expect(second).toHaveAttribute("aria-expanded", "false")
    await expect(canvas.getByText("Transponder rental")).toBeVisible()

    // Keyboard: focus the button and press Enter.
    second.focus()
    await userEvent.keyboard("{Enter}")
    await expect(second).toHaveAttribute("aria-expanded", "true")
    await expect(second).toHaveAccessibleName("Collapse details")
    await expect(second).toHaveAttribute(
      "aria-controls",
      canvas
        .getByText("Entry fee, class B")
        .closest("[data-slot=table-expandable-detail]")!.id
    )

    await userEvent.keyboard(" ")
    await expect(second).toHaveAttribute("aria-expanded", "false")
    await expect(canvas.queryByText("Entry fee, class B")).toBeNull()

    await userEvent.click(first)
    await expect(canvas.queryByText("Transponder rental")).toBeNull()
  },
}

export const ExpandableRowsControlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Controlled with `open`/`onOpenChange` (here: only one row open at a time), with the trigger in the last cell and custom labels.",
      },
    },
  },
  render: function Render() {
    const [openId, setOpenId] = React.useState<string | null>("INV-1043")
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableExpandableRow
              key={invoice.id}
              colSpan={4}
              open={openId === invoice.id}
              onOpenChange={(open) => setOpenId(open ? invoice.id : null)}
              detail={<InvoiceItems items={invoice.items} />}
            >
              <TableCell className="font-medium">{invoice.id}</TableCell>
              <TableCell>{invoice.customer}</TableCell>
              <TableCell className="text-right">{money(invoice.total)}</TableCell>
              <TableCell>
                <TableExpandTrigger
                  expandLabel={`Show items of ${invoice.id}`}
                  collapseLabel={`Hide items of ${invoice.id}`}
                />
              </TableCell>
            </TableExpandableRow>
          ))}
        </TableBody>
      </Table>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Entry fee, class B")).toBeVisible()
    await userEvent.click(
      canvas.getByRole("button", { name: "Show items of INV-1042" })
    )
    await expect(canvas.getByText("Transponder rental")).toBeVisible()
    await expect(canvas.queryByText("Entry fee, class B")).toBeNull()
  },
}
