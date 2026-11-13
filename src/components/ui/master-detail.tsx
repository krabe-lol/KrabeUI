import * as React from "react"
import { cn } from "cn"

// KrabeUI's own master-detail layout (shadcn has no equivalent): a list of
// entries on the left, the details of the selected entry on the right. On
// narrow screens the list sits above the details.

type MasterDetailContextValue = {
  value: string | undefined
  select: (value: string) => void
}

const MasterDetailContext = React.createContext<MasterDetailContextValue | null>(null)

function useMasterDetail() {
  const context = React.useContext(MasterDetailContext)
  if (!context) {
    throw new Error("MasterDetail parts must be used within <MasterDetail>")
  }
  return context
}

type MasterDetailProps = Omit<React.ComponentProps<"div">, "defaultValue"> & {
  /** Selected entry (controlled). */
  value?: string
  /** Initially selected entry (uncontrolled). */
  defaultValue?: string
  onValueChange?: (value: string) => void
}

function MasterDetail({
  className,
  value: valueProp,
  defaultValue,
  onValueChange,
  ...props
}: MasterDetailProps) {
  const [inner, setInner] = React.useState(defaultValue)
  const controlled = valueProp !== undefined
  const value = controlled ? valueProp : inner

  const select = React.useCallback(
    (next: string) => {
      if (!controlled) setInner(next)
      onValueChange?.(next)
    },
    [controlled, onValueChange]
  )

  const context = React.useMemo(() => ({ value, select }), [value, select])

  return (
    <MasterDetailContext.Provider value={context}>
      <div
        data-slot="master-detail"
        className={cn(
          "flex flex-col gap-4 md:grid md:grid-cols-[16rem_minmax(0,1fr)] md:items-start md:gap-6",
          className
        )}
        {...props}
      />
    </MasterDetailContext.Provider>
  )
}

function MasterDetailList({ className, onKeyDown, ...props }: React.ComponentProps<"nav">) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    const keys = ["ArrowDown", "ArrowUp", "Home", "End"]
    if (!keys.includes(event.key)) return
    const items = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        "[data-slot=master-detail-item]:not(:disabled)"
      )
    )
    if (items.length === 0) return
    const current = items.indexOf(document.activeElement as HTMLElement)
    // Only react while an entry has the focus (not e.g. the action button).
    if (current === -1) return
    event.preventDefault()
    const target =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? items.length - 1
          : event.key === "ArrowDown"
            ? Math.min(current + 1, items.length - 1)
            : Math.max(current - 1, 0)
    items[target].focus()
  }

  return (
    <nav
      data-slot="master-detail-list"
      onKeyDown={handleKeyDown}
      className={cn(
        "flex max-h-72 min-w-0 flex-col gap-1 overflow-y-auto overscroll-contain md:sticky md:top-4 md:max-h-[calc(100vh-2rem)]",
        className
      )}
      {...props}
    />
  )
}

type MasterDetailItemProps = Omit<React.ComponentProps<"button">, "value" | "title"> & {
  value: string
  title: React.ReactNode
  /** Second line below the title, e.g. a date or a place. */
  description?: React.ReactNode
  /** Shown at the end of the entry, e.g. a `Badge`. */
  badge?: React.ReactNode
}

function MasterDetailItem({
  className,
  value,
  title,
  description,
  badge,
  onClick,
  ...props
}: MasterDetailItemProps) {
  const { value: selected, select } = useMasterDetail()
  const isSelected = selected === value
  // Roving tabindex: once an entry is selected, only it is a tab stop and
  // the arrow keys move between the entries.
  const tabIndex = selected === undefined || isSelected ? 0 : -1

  return (
    <button
      type="button"
      data-slot="master-detail-item"
      data-state={isSelected ? "active" : "inactive"}
      aria-current={isSelected ? "true" : undefined}
      tabIndex={tabIndex}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) select(value)
      }}
      className={cn(
        "relative flex w-full shrink-0 items-start gap-2 rounded-md border border-transparent px-3 py-2 text-left text-sm text-foreground/60 transition-colors hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-muted data-[state=active]:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "after:absolute after:inset-y-1 after:left-0 after:w-0.5 after:rounded-full after:bg-foreground after:opacity-0 after:transition-opacity data-[state=active]:after:opacity-100",
        className
      )}
      {...props}
    >
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span data-slot="master-detail-item-title" className="truncate font-medium">
          {title}
        </span>
        {description ? (
          <span
            data-slot="master-detail-item-description"
            className="truncate text-xs text-muted-foreground"
          >
            {description}
          </span>
        ) : null}
      </span>
      {badge ? <span className="shrink-0">{badge}</span> : null}
    </button>
  )
}

/** Something that belongs to the list but is no entry, e.g. a "+ New race" button. */
function MasterDetailAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="master-detail-action"
      className={cn("shrink-0 [&>*]:w-full", className)}
      {...props}
    />
  )
}

function MasterDetailContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="master-detail-content"
      className={cn("min-w-0 space-y-4", className)}
      {...props}
    />
  )
}

function MasterDetailEmpty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="master-detail-empty"
      className={cn(
        "flex min-h-40 items-center justify-center rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  MasterDetail,
  MasterDetailList,
  MasterDetailItem,
  MasterDetailAction,
  MasterDetailContent,
  MasterDetailEmpty,
}
