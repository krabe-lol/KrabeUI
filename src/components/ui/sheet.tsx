"use client"

import * as React from "react"
import { cn } from "cn"
import { Dialog as SheetPrimitive } from "radix-ui"

import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

type SheetSide = "top" | "right" | "bottom" | "left"

// Movement (px) before a touch is classified as a dismiss swipe or ignored.
const SWIPE_START_THRESHOLD = 10
// Share of the panel's size it must be dragged before release closes it...
const SWIPE_CLOSE_RATIO = 0.25
// ...unless it was flicked faster than this (px/ms).
const SWIPE_CLOSE_VELOCITY = 0.5

// Unit vector pointing from the panel's resting position off-screen.
const dismissDirection: Record<SheetSide, { x: number; y: number }> = {
  top: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
}

// Swipes starting on these keep their own touch behavior.
const noSwipeSelector =
  "input, textarea, select, [contenteditable=''], [contenteditable='true'], [role='slider'], [data-sheet-no-swipe]"

// Lets SheetContent close the sheet itself (for swipe-to-close), whether the
// consumer controls `open` or not.
const SheetOpenContext = React.createContext<
  ((open: boolean) => void) | null
>(null)

function Sheet({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Root>) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const isControlled = openProp !== undefined
  const open = isControlled ? openProp : uncontrolledOpen

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange]
  )

  return (
    <SheetOpenContext.Provider value={setOpen}>
      <SheetPrimitive.Root
        data-slot="sheet"
        open={open}
        onOpenChange={setOpen}
        {...props}
      />
    </SheetOpenContext.Provider>
  )
}

// Whether a swipe toward `side` would scroll something between `target` and
// `boundary` instead (e.g. swiping down on a bottom sheet whose content is
// scrolled away from the top).
function canScrollToward(target: Element, boundary: Element, side: SheetSide) {
  for (let el: Element | null = target; el; el = el.parentElement) {
    if (el instanceof HTMLElement) {
      const { overflowX, overflowY } = getComputedStyle(el)
      const scrollsY = /auto|scroll/.test(overflowY)
      const scrollsX = /auto|scroll/.test(overflowX)
      if (side === "bottom" && scrollsY && el.scrollTop > 0) return true
      if (side === "top" && scrollsY && el.scrollTop + el.clientHeight < el.scrollHeight - 1) return true
      if (side === "right" && scrollsX && el.scrollLeft > 0) return true
      if (side === "left" && scrollsX && el.scrollLeft + el.clientWidth < el.scrollWidth - 1) return true
    }
    if (el === boundary) break
  }
  return false
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  swipeToClose = true,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: SheetSide
  showCloseButton?: boolean
  /** Close on a touch swipe toward the sheet's edge. Mouse drags never swipe. */
  swipeToClose?: boolean
}) {
  const setOpen = React.useContext(SheetOpenContext)
  const swipe = React.useRef<{
    pointerId: number
    startX: number
    startY: number
    startTime: number
    offset: number
    active: boolean
  } | null>(null)

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    onPointerDown?.(event)
    if (!swipeToClose || !setOpen || event.defaultPrevented) return
    if (event.pointerType !== "touch" || swipe.current) return
    if ((event.target as Element).closest(noSwipeSelector)) return
    swipe.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startTime: event.timeStamp,
      offset: 0,
      active: false,
    }
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    onPointerMove?.(event)
    const state = swipe.current
    if (!state || event.pointerId !== state.pointerId) return

    const direction = dismissDirection[side]
    const dx = event.clientX - state.startX
    const dy = event.clientY - state.startY
    const along = dx * direction.x + dy * direction.y
    const content = event.currentTarget

    if (!state.active) {
      const across = Math.abs(dx * direction.y + dy * direction.x)
      if (Math.max(Math.abs(along), across) < SWIPE_START_THRESHOLD) return
      // Mostly sideways or inward, or the content can still scroll that way:
      // not a dismiss swipe, leave the touch alone.
      if (along <= across || canScrollToward(event.target as Element, content, side)) {
        swipe.current = null
        return
      }
      state.active = true
      state.startTime = event.timeStamp
      try {
        content.setPointerCapture(event.pointerId)
      } catch {
        // Synthetic pointers (e.g. in tests) can't be captured.
      }
      content.style.transition = "none"
    }

    state.offset = Math.max(0, along)
    content.style.transform = `translate3d(${state.offset * direction.x}px, ${state.offset * direction.y}px, 0)`
  }

  function endSwipe(event: React.PointerEvent<HTMLDivElement>, canClose: boolean) {
    const state = swipe.current
    if (!state || event.pointerId !== state.pointerId) return
    swipe.current = null
    if (!state.active) return

    const content = event.currentTarget
    const size = side === "left" || side === "right" ? content.offsetWidth : content.offsetHeight
    const velocity = state.offset / Math.max(1, event.timeStamp - state.startTime)
    const snapBack = () => {
      content.style.removeProperty("--tw-exit-translate-x")
      content.style.removeProperty("--tw-exit-translate-y")
      content.style.transform = ""
    }
    content.style.transition = ""

    if (canClose && setOpen && (state.offset > size * SWIPE_CLOSE_RATIO || velocity > SWIPE_CLOSE_VELOCITY)) {
      // The exit animation only defines its end frame, so it starts from the
      // dragged position; point that end fully off-screen so the panel keeps
      // moving outward instead of sliding back to the default 2.5rem offset.
      const direction = dismissDirection[side]
      content.style.setProperty("--tw-exit-translate-x", `${direction.x * 100}%`)
      content.style.setProperty("--tw-exit-translate-y", `${direction.y * 100}%`)
      setOpen(false)
      // A controlled consumer may keep it open; don't leave it half-dragged.
      requestAnimationFrame(() => {
        if (content.getAttribute("data-state") === "open") snapBack()
      })
    } else {
      snapBack()
    }
  }

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        data-side={side}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(event) => {
          onPointerUp?.(event)
          endSwipe(event, true)
        }}
        onPointerCancel={(event) => {
          onPointerCancel?.(event)
          endSwipe(event, false)
        }}
        className={cn(
          swipeToClose && "data-[side=left]:touch-pan-y data-[side=right]:touch-pan-y",
          "fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition duration-200 ease-in-out data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-[side=bottom]:data-open:slide-in-from-bottom-10 data-[side=left]:data-open:slide-in-from-left-10 data-[side=right]:data-open:slide-in-from-right-10 data-[side=top]:data-open:slide-in-from-top-10 data-closed:animate-out data-closed:fade-out-0 data-[side=bottom]:data-closed:slide-out-to-bottom-10 data-[side=left]:data-closed:slide-out-to-left-10 data-[side=right]:data-closed:slide-out-to-right-10 data-[side=top]:data-closed:slide-out-to-top-10",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close data-slot="sheet-close" asChild>
            <Button
              variant="ghost"
              className="absolute top-3 right-3"
              size="sm"
              icon
              aria-label="Close"
            >
              <XIcon />
            </Button>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-0.5 p-4", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        "font-heading text-base font-medium text-foreground",
        className
      )}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
