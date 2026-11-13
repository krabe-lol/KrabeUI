import * as React from "react"
import { cn } from "cn"
import { ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

// Expandable rows (KrabeUI's own, shadcn has no equivalent): a normal row plus,
// while open, a detail row spanning all columns. Place <TableExpandTrigger> in
// any cell of the row.

type TableExpandableRowContextValue = {
  open: boolean
  toggle: () => void
  detailId: string
}

const TableExpandableRowContext =
  React.createContext<TableExpandableRowContextValue | null>(null)

type TableExpandableRowProps = Omit<React.ComponentProps<"tr">, "defaultValue"> & {
  /** Content of the detail row, shown while open (e.g. a nested table). */
  detail: React.ReactNode
  /** Number of columns of the table; the detail cell spans all of them. */
  colSpan: number
  /** Open state (controlled). */
  open?: boolean
  /** Initially open (uncontrolled). */
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Classes for the detail row. */
  detailClassName?: string
}

function TableExpandableRow({
  detail,
  colSpan,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  detailClassName,
  children,
  ...props
}: TableExpandableRowProps) {
  const [inner, setInner] = React.useState(defaultOpen)
  const controlled = openProp !== undefined
  const open = controlled ? openProp : inner
  const detailId = React.useId()

  const toggle = React.useCallback(() => {
    if (!controlled) setInner(!open)
    onOpenChange?.(!open)
  }, [controlled, open, onOpenChange])

  const context = React.useMemo(
    () => ({ open, toggle, detailId }),
    [open, toggle, detailId]
  )

  return (
    <TableExpandableRowContext.Provider value={context}>
      <TableRow
        data-slot="table-expandable-row"
        data-state={open ? "open" : "closed"}
        {...props}
      >
        {children}
      </TableRow>
      {open ? (
        <TableRow
          id={detailId}
          data-slot="table-expandable-detail"
          className={cn("bg-muted/30 hover:bg-muted/30", detailClassName)}
        >
          <TableCell colSpan={colSpan} className="p-4 whitespace-normal">
            {detail}
          </TableCell>
        </TableRow>
      ) : null}
    </TableExpandableRowContext.Provider>
  )
}

type TableExpandTriggerProps = Omit<
  React.ComponentProps<typeof Button>,
  "icon" | "onClick" | "children"
> & {
  /** Accessible name while closed. */
  expandLabel?: string
  /** Accessible name while open. */
  collapseLabel?: string
}

function TableExpandTrigger({
  expandLabel = "Expand details",
  collapseLabel = "Collapse details",
  variant = "ghost",
  size = "sm",
  className,
  ...props
}: TableExpandTriggerProps) {
  const context = React.useContext(TableExpandableRowContext)
  if (!context) {
    throw new Error("TableExpandTrigger must be used within <TableExpandableRow>")
  }
  const { open, toggle, detailId } = context

  return (
    <Button
      type="button"
      icon
      variant={variant}
      size={size}
      data-slot="table-expand-trigger"
      aria-expanded={open}
      aria-controls={open ? detailId : undefined}
      aria-label={open ? collapseLabel : expandLabel}
      onClick={toggle}
      className={className}
      {...props}
    >
      <ChevronRightIcon
        className={cn("transition-transform", open && "rotate-90")}
      />
    </Button>
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableExpandableRow,
  TableExpandTrigger,
}
