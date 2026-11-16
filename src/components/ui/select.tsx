import * as React from "react"
import { cn } from "cn"
import { Select as SelectPrimitive } from "radix-ui"
import { ChevronDownIcon, CheckIcon, ChevronUpIcon, SearchIcon } from "lucide-react"

import { InputGroup, InputGroupAddon } from "@/components/ui/input-group"

// The current search text (trimmed, lowercase), or "" while nothing is filtered.
const SelectSearchContext = React.createContext("")

// Items that are neither filtered out by the search nor disabled.
const MATCHING_ITEM = "[data-slot=select-item]:not([hidden]):not([data-disabled])"

// The plain text of an item's children, which the search matches against.
function getNodeText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(getNodeText).join("")
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return getNodeText(node.props.children)
  }
  return ""
}

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  const query = React.useContext(SelectSearchContext)
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn(
        "scroll-my-1 p-1",
        // Hide groups (and their label) without a match while searching.
        query && "not-has-[[data-slot=select-item]:not([hidden])]:hidden",
        className
      )}
      {...props}
    />
  )
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex w-fit items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

// Radix moves the focus to an item when the list opens and when the pointer
// hovers an item. While a search field is shown, typing there sends the
// focus back to the field, and ArrowUp on the first match moves up into it.
function handleSearchKeyDownCapture(
  event: React.KeyboardEvent<HTMLDivElement>,
  input: HTMLInputElement | null
) {
  if (!input || event.target === input) return
  const isModified = event.ctrlKey || event.metaKey || event.altKey
  const isTyping =
    !isModified &&
    ((event.key.length === 1 && event.key !== " ") || event.key === "Backspace")
  const leavesFirstMatch =
    event.key === "ArrowUp" &&
    event.target === event.currentTarget.querySelector(MATCHING_ITEM)
  if (!isTyping && !leavesFirstMatch) return
  // Moving the focus during keydown makes the browser type the character into
  // the field; stopping the event keeps Radix's typeahead from taking it back.
  input.focus()
  event.stopPropagation()
  if (leavesFirstMatch) event.preventDefault()
}

// Rendered inside Radix's Content, which mounts it anew each time the list
// opens, so the search starts empty every time.
function SelectContentBody({
  position,
  searchable,
  searchPlaceholder,
  searchEmpty,
  searchInputRef,
  children,
}: {
  position: React.ComponentProps<typeof SelectPrimitive.Content>["position"]
  searchable: boolean
  searchPlaceholder: string
  searchEmpty: React.ReactNode
  searchInputRef: React.RefObject<HTMLInputElement | null>
  children: React.ReactNode
}) {
  const [search, setSearch] = React.useState("")
  const query = search.trim().toLocaleLowerCase()
  const viewportRef = React.useRef<HTMLDivElement>(null)

  // Radix focuses the selected item once the list is placed (after scrolling
  // it into view); hand that first focus over to the search field.
  React.useLayoutEffect(() => {
    const input = searchInputRef.current
    const content = input?.closest<HTMLElement>("[data-slot=select-content]")
    if (!input || !content) return
    const handleFocusIn = (event: FocusEvent) => {
      content.removeEventListener("focusin", handleFocusIn)
      if (event.target !== input) input.focus()
    }
    content.addEventListener("focusin", handleFocusIn)
    return () => content.removeEventListener("focusin", handleFocusIn)
  }, [searchInputRef])

  // Show the first matches, and let the scroll buttons re-check whether the
  // filtered list still scrolls (they only update on scroll events).
  React.useLayoutEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    viewport.scrollTop = 0
    viewport.dispatchEvent(new Event("scroll"))
  }, [query])

  return (
    <SelectSearchContext.Provider value={query}>
      {searchable && (
        // contain-inline-size: the field takes the list's width instead of
        // widening it to the input's built-in minimum width.
        <div data-slot="select-search" className="p-1 pb-0 contain-inline-size">
          <InputGroup className="h-8! rounded-lg! border-input/30 bg-input/30 shadow-none! *:data-[slot=input-group-addon]:pl-2!">
            <input
              ref={searchInputRef}
              data-slot="select-search-input"
              type="text"
              autoComplete="off"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  // Pick the first match, as if Enter was pressed on it.
                  event.preventDefault()
                  viewportRef.current
                    ?.querySelector(MATCHING_ITEM)
                    ?.dispatchEvent(
                      new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
                    )
                }
                // ArrowDown moves to the first match, Tab and Escape behave as
                // usual. Every other key edits the field and must not reach
                // Radix's list navigation and typeahead.
                if (!["ArrowDown", "Tab", "Escape"].includes(event.key)) {
                  event.stopPropagation()
                }
              }}
              className="w-full text-sm outline-hidden"
            />
            <InputGroupAddon>
              <SearchIcon className="size-4 shrink-0 opacity-50" />
            </InputGroupAddon>
          </InputGroup>
        </div>
      )}
      {/* At most 10.5 items (h-7 each) plus one scroll button (h-6), so a cut
          item shows that the list scrolls. */}
      <div
        data-slot="select-list"
        data-position={position}
        className="flex min-h-0 flex-1 flex-col data-[position=popper]:max-h-79.5"
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          ref={viewportRef}
          data-slot="select-viewport"
          data-position={position}
          className={cn(
            "group/select-viewport data-[position=popper]:h-(--radix-select-trigger-height) data-[position=popper]:w-full data-[position=popper]:min-w-(--radix-select-trigger-width)",
            position === "popper" && ""
          )}
        >
          {children}
          {query && (
            <div
              data-slot="select-empty"
              className="py-6 text-center text-sm group-has-[[data-slot=select-item]:not([hidden])]/select-viewport:hidden"
            >
              {searchEmpty}
            </div>
          )}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </div>
    </SelectSearchContext.Provider>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  align = "center",
  searchable = false,
  searchPlaceholder = "Search…",
  searchEmpty = "No results found.",
  onKeyDownCapture,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content> & {
  /** Shows a search field above the first item that filters the items by their text (`textValue` or plain-text children). */
  searchable?: boolean
  searchPlaceholder?: string
  /** Shown when no item matches the search. */
  searchEmpty?: React.ReactNode
}) {
  const searchInputRef = React.useRef<HTMLInputElement>(null)
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        data-align-trigger={position === "item-aligned"}
        className={cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-36 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", position ==="popper"&&"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className )}
        position={position}
        align={align}
        onKeyDownCapture={(event) => {
          onKeyDownCapture?.(event)
          if (searchable) handleSearchKeyDownCapture(event, searchInputRef.current)
        }}
        {...props}
      >
        <SelectContentBody
          position={position}
          searchable={searchable}
          searchPlaceholder={searchPlaceholder}
          searchEmpty={searchEmpty}
          searchInputRef={searchInputRef}
        >
          {children}
        </SelectContentBody>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("px-1.5 py-1 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  textValue,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  const query = React.useContext(SelectSearchContext)
  // Filtered items stay mounted (only hidden), so the trigger keeps showing
  // the selected value and Radix's keyboard navigation skips them.
  const isFilteredOut =
    query !== "" &&
    !(textValue ?? getNodeText(children)).toLocaleLowerCase().includes(query)
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      textValue={textValue}
      hidden={isFilteredOut}
      className={cn(
        "relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        isFilteredOut && "hidden",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="pointer-events-none" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  const query = React.useContext(SelectSearchContext)
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(
        "pointer-events-none -mx-1 my-1 h-px bg-border",
        query && "hidden",
        className
      )}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronUpIcon
      />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronDownIcon
      />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
