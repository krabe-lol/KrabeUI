"use client"

import * as React from "react"
import { cn } from "cn"
import { Dialog as LightboxPrimitive } from "radix-ui"

import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react"

type LightboxImage = {
  src: string
  alt: string
  caption?: React.ReactNode
  /** Smaller image for the thumbnail strip. Falls back to `src`. */
  thumbnail?: string
}

type LightboxLabels = {
  /** Accessible title of the viewer dialog (screen readers only). */
  title?: string
  close?: string
  previous?: string
  next?: string
  /** Accessible name of the thumbnail strip. */
  thumbnails?: string
  /** Accessible name of a thumbnail button; `n` is 1-based. */
  showImage?: (n: number) => string
}

const defaultLabels = {
  title: "Image viewer",
  close: "Close",
  previous: "Previous",
  next: "Next",
  thumbnails: "Thumbnails",
  showImage: (n: number) => `Show image ${n}`,
} satisfies Required<LightboxLabels>

// Movement (px) before a touch is classified as a horizontal or downward swipe.
const SWIPE_START_THRESHOLD = 10
// Share of the viewer's width a horizontal swipe must cover to turn the page...
const SWIPE_NAVIGATE_RATIO = 0.2
// ...and of its height a downward swipe must cover to close.
const SWIPE_CLOSE_RATIO = 0.25
// A swipe faster than this (px/ms) counts regardless of distance, as long as
// it covers a minimum distance (so a twitch isn't a flick).
const SWIPE_FLICK_VELOCITY = 0.5
const SWIPE_FLICK_MIN_DISTANCE = 40
// Share of the finger movement the image follows when there's nothing further
// in that direction (first/last image).
const SWIPE_EDGE_RESISTANCE = 0.3

// Swipes starting on these keep their own behavior (and clicks on them never
// count as clicks on the backdrop).
const noSwipeSelector =
  "a, button, input, textarea, select, [contenteditable=''], [contenteditable='true'], [role='slider'], [data-lightbox-no-swipe]"
const noCloseSelector = "img, figcaption, button, a, [data-lightbox-no-close]"

type LightboxContextValue = {
  images: LightboxImage[]
  index: number
  setIndex: (index: number) => void
  setOpen: (open: boolean) => void
  labels: typeof defaultLabels
  // The trigger that opened the viewer, so focus can go back to exactly that
  // one (Radix only knows the last mounted trigger).
  triggerRef: React.RefObject<HTMLElement | null>
}

const LightboxContext = React.createContext<LightboxContextValue | null>(null)

function useLightbox() {
  const context = React.useContext(LightboxContext)
  if (!context) {
    throw new Error("Lightbox components must be used within <Lightbox>")
  }
  return context
}

function Lightbox({
  images,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  index: indexProp,
  defaultIndex = 0,
  onIndexChange,
  labels,
  children,
  ...props
}: Omit<
  React.ComponentProps<typeof LightboxPrimitive.Root>,
  "open" | "defaultOpen" | "onOpenChange"
> & {
  images: LightboxImage[]
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Index of the shown image (controlled). */
  index?: number
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  /** Override the (English) texts, e.g. to translate them. */
  labels?: LightboxLabels
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const isOpenControlled = openProp !== undefined
  const open = isOpenControlled ? openProp : uncontrolledOpen

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isOpenControlled) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [isOpenControlled, onOpenChange]
  )

  const [uncontrolledIndex, setUncontrolledIndex] = React.useState(defaultIndex)
  const isIndexControlled = indexProp !== undefined
  const lastIndex = Math.max(0, images.length - 1)
  const index = Math.min(
    Math.max(isIndexControlled ? indexProp : uncontrolledIndex, 0),
    lastIndex
  )

  const setIndex = React.useCallback(
    (next: number) => {
      const clamped = Math.min(Math.max(next, 0), lastIndex)
      if (clamped === index) return
      if (!isIndexControlled) setUncontrolledIndex(clamped)
      onIndexChange?.(clamped)
    },
    [index, isIndexControlled, lastIndex, onIndexChange]
  )

  const triggerRef = React.useRef<HTMLElement | null>(null)

  const mergedLabels = React.useMemo(
    () => ({ ...defaultLabels, ...labels }),
    [labels]
  )

  const context = React.useMemo(
    () => ({
      images,
      index,
      setIndex,
      setOpen,
      labels: mergedLabels,
      triggerRef,
    }),
    [images, index, setIndex, setOpen, mergedLabels]
  )

  return (
    <LightboxContext.Provider value={context}>
      <LightboxPrimitive.Root open={open} onOpenChange={setOpen} {...props}>
        {children}
        <LightboxViewer />
      </LightboxPrimitive.Root>
    </LightboxContext.Provider>
  )
}

function LightboxTrigger({
  index,
  onClick,
  ...props
}: React.ComponentProps<typeof LightboxPrimitive.Trigger> & {
  /** The image this trigger opens the viewer at. */
  index: number
}) {
  const { setIndex, triggerRef } = useLightbox()

  return (
    <LightboxPrimitive.Trigger
      data-slot="lightbox-trigger"
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        triggerRef.current = event.currentTarget
        setIndex(index)
      }}
      {...props}
    />
  )
}

// Portal, overlay and content. Both get a `dark` class so the tokens (and
// `dark:` variants of the buttons inside) always render in their dark look,
// whatever theme the page uses.
function LightboxViewer() {
  const { images, index, setIndex, triggerRef } = useLightbox()
  const contentRef = React.useRef<HTMLDivElement>(null)
  if (images.length === 0) return null

  return (
    <LightboxPrimitive.Portal data-slot="lightbox-portal">
      <LightboxPrimitive.Overlay
        data-slot="lightbox-overlay"
        className="dark fixed inset-0 isolate z-50 bg-background/95 duration-150 supports-backdrop-filter:backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
      />
      <LightboxPrimitive.Content
        ref={contentRef}
        data-slot="lightbox-content"
        className="dark fixed inset-0 z-50 flex flex-col overflow-hidden text-foreground outline-none duration-150 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
        onOpenAutoFocus={(event) => {
          // Focus the viewer itself instead of the first button, so the arrow
          // keys work right away without showing a focus ring on "Close".
          event.preventDefault()
          contentRef.current?.focus()
        }}
        onCloseAutoFocus={(event) => {
          const trigger = triggerRef.current
          triggerRef.current = null
          if (trigger?.isConnected) {
            event.preventDefault()
            trigger.focus()
          }
        }}
        onKeyDown={(event) => {
          if (images.length < 2 || event.defaultPrevented) return
          if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
          if (event.key === "ArrowLeft") {
            event.preventDefault()
            setIndex(index - 1)
          } else if (event.key === "ArrowRight") {
            event.preventDefault()
            setIndex(index + 1)
          }
        }}
      >
        <LightboxBody contentRef={contentRef} />
      </LightboxPrimitive.Content>
    </LightboxPrimitive.Portal>
  )
}

function LightboxBody({
  contentRef,
}: {
  contentRef: React.RefObject<HTMLDivElement | null>
}) {
  const { images, index, setIndex, setOpen, labels } = useLightbox()
  const image = images[index]
  const lastIndex = images.length - 1
  const multiple = images.length > 1

  const stageRef = React.useRef<HTMLDivElement>(null)
  const slideRef = React.useRef<HTMLElement>(null)
  const thumbnailsRef = React.useRef<HTMLDivElement>(null)
  const preloaded = React.useRef<HTMLImageElement[]>([])
  // Set while/after a swipe so the click the browser may still emit afterwards
  // isn't mistaken for a click on the backdrop.
  const suppressClick = React.useRef(false)
  const swipe = React.useRef<{
    pointerId: number
    startX: number
    startY: number
    startTime: number
    dx: number
    dy: number
    axis: "x" | "y" | null
  } | null>(null)

  // Direction of the last page turn, so the new image slides in from that side.
  const [previousIndex, setPreviousIndex] = React.useState(index)
  const [direction, setDirection] = React.useState<-1 | 0 | 1>(0)
  if (index !== previousIndex) {
    setPreviousIndex(index)
    setDirection(index > previousIndex ? 1 : -1)
  }

  // Load the neighbors ahead of time so paging doesn't flash.
  React.useEffect(() => {
    preloaded.current = [images[index - 1], images[index + 1]]
      .filter((neighbor) => neighbor !== undefined)
      .map((neighbor) => {
        const el = new Image()
        el.src = neighbor.src
        return el
      })
  }, [images, index])

  // Keep the active thumbnail in view.
  React.useEffect(() => {
    thumbnailsRef.current
      ?.querySelector<HTMLElement>("[aria-current=true]")
      ?.scrollIntoView({ block: "nearest", inline: "center" })
  }, [index])

  // A button that just became disabled (Next on the last image) would drop the
  // focus and with it the arrow keys; move it to the viewer instead.
  React.useEffect(() => {
    const active = document.activeElement
    if (active instanceof HTMLButtonElement && active.disabled) {
      contentRef.current?.focus()
    }
  }, [index, contentRef])

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    suppressClick.current = false
    if (event.pointerType === "mouse" || swipe.current) return
    if ((event.target as Element).closest(noSwipeSelector)) return
    swipe.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startTime: event.timeStamp,
      dx: 0,
      dy: 0,
      axis: null,
    }
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const state = swipe.current
    const slide = slideRef.current
    if (!state || !slide || event.pointerId !== state.pointerId) return

    const dx = event.clientX - state.startX
    const dy = event.clientY - state.startY

    if (!state.axis) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_START_THRESHOLD) return
      const axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y"
      // Nothing to page to, or an upward swipe: leave the touch alone.
      if ((axis === "x" && !multiple) || (axis === "y" && dy < 0)) {
        swipe.current = null
        return
      }
      state.axis = axis
      state.startTime = event.timeStamp
      suppressClick.current = true
      try {
        event.currentTarget.setPointerCapture(event.pointerId)
      } catch {
        // Synthetic pointers (e.g. in tests) can't be captured.
      }
      slide.style.transition = "none"
    }

    state.dx = dx
    state.dy = dy

    if (state.axis === "x") {
      const atEdge = (dx > 0 && index === 0) || (dx < 0 && index === lastIndex)
      const offset = atEdge ? dx * SWIPE_EDGE_RESISTANCE : dx
      slide.style.transform = `translate3d(${offset}px, 0, 0)`
    } else {
      slide.style.transform = `translate3d(0, ${Math.max(0, dy)}px, 0)`
    }
  }

  function endSwipe(event: React.PointerEvent<HTMLDivElement>, canCommit: boolean) {
    const state = swipe.current
    const slide = slideRef.current
    const stage = stageRef.current
    if (!state || event.pointerId !== state.pointerId) return
    swipe.current = null
    if (!state.axis || !slide || !stage) return

    const snapBack = () => {
      slide.style.transform = ""
    }
    const elapsed = Math.max(1, event.timeStamp - state.startTime)
    slide.style.transition = ""

    if (state.axis === "x") {
      const distance = Math.abs(state.dx)
      const target = index + (state.dx < 0 ? 1 : -1)
      const exists = target >= 0 && target <= lastIndex
      const flicked =
        distance >= SWIPE_FLICK_MIN_DISTANCE && distance / elapsed > SWIPE_FLICK_VELOCITY
      if (canCommit && exists && (distance > stage.offsetWidth * SWIPE_NAVIGATE_RATIO || flicked)) {
        snapBack()
        setIndex(target)
      } else {
        snapBack()
      }
      return
    }

    const distance = Math.max(0, state.dy)
    const flicked =
      distance >= SWIPE_FLICK_MIN_DISTANCE && distance / elapsed > SWIPE_FLICK_VELOCITY
    if (canCommit && (distance > stage.offsetHeight * SWIPE_CLOSE_RATIO || flicked)) {
      setOpen(false)
      // A controlled consumer may keep it open; don't leave it half-dragged.
      requestAnimationFrame(() => {
        if (contentRef.current?.getAttribute("data-state") === "open") snapBack()
      })
    } else {
      snapBack()
    }
  }

  return (
    <div
      className="flex size-full flex-col"
      onClick={(event) => {
        if (suppressClick.current) {
          suppressClick.current = false
          return
        }
        // Anywhere but on the image, its caption or a control: backdrop.
        if ((event.target as Element).closest(noCloseSelector)) return
        setOpen(false)
      }}
    >
      <LightboxPrimitive.Title className="sr-only">{labels.title}</LightboxPrimitive.Title>
      <LightboxPrimitive.Description className="sr-only">
        {image.alt}
      </LightboxPrimitive.Description>

      <div className="pointer-events-none relative z-10 flex h-14 shrink-0 items-center justify-between px-3">
        <span
          data-slot="lightbox-counter"
          aria-live="polite"
          aria-atomic="true"
          className="text-sm text-muted-foreground tabular-nums"
        >
          {multiple ? `${index + 1} / ${images.length}` : null}
        </span>
        <LightboxPrimitive.Close data-slot="lightbox-close" asChild>
          <Button
            variant="ghost"
            size="sm"
            icon
            aria-label={labels.close}
            className="pointer-events-auto"
          >
            <XIcon />
          </Button>
        </LightboxPrimitive.Close>
      </div>

      <div
        ref={stageRef}
        data-slot="lightbox-stage"
        className="relative flex min-h-0 flex-1 touch-none px-4 pb-2 sm:px-16"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(event) => endSwipe(event, true)}
        onPointerCancel={(event) => endSwipe(event, false)}
      >
        <figure
          key={index}
          ref={slideRef}
          data-slot="lightbox-slide"
          className={cn(
            "flex size-full flex-col items-center transition-transform duration-200 ease-out motion-reduce:transition-none",
            direction === 1 &&
              "animate-in fade-in-0 slide-in-from-right-10 motion-reduce:animate-none",
            direction === -1 &&
              "animate-in fade-in-0 slide-in-from-left-10 motion-reduce:animate-none"
          )}
        >
          <div className="flex min-h-0 w-full flex-1 items-center justify-center">
            <img
              src={image.src}
              alt={image.alt}
              draggable={false}
              className="max-h-full max-w-full object-contain select-none"
            />
          </div>
          {image.caption ? (
            <figcaption
              data-slot="lightbox-caption"
              className="max-w-prose shrink-0 pt-3 text-center text-sm text-muted-foreground"
            >
              {image.caption}
            </figcaption>
          ) : null}
        </figure>

        {multiple ? (
          <>
            <Button
              variant="secondary"
              size="lg"
              icon
              aria-label={labels.previous}
              disabled={index === 0}
              onClick={() => setIndex(index - 1)}
              className="absolute top-1/2 left-3 z-10 -translate-y-1/2"
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              icon
              aria-label={labels.next}
              disabled={index === lastIndex}
              onClick={() => setIndex(index + 1)}
              className="absolute top-1/2 right-3 z-10 -translate-y-1/2"
            >
              <ChevronRightIcon />
            </Button>
          </>
        ) : null}
      </div>

      {multiple ? (
        <div
          ref={thumbnailsRef}
          role="group"
          aria-label={labels.thumbnails}
          data-slot="lightbox-thumbnails"
          data-lightbox-no-close=""
          className="flex shrink-0 touch-pan-x gap-2 overflow-x-auto p-3 [&>:first-child]:ml-auto [&>:last-child]:mr-auto"
        >
          {images.map((thumb, i) => (
            <button
              key={i}
              type="button"
              aria-label={labels.showImage(i + 1)}
              aria-current={i === index ? "true" : undefined}
              onClick={() => setIndex(i)}
              className="shrink-0 overflow-hidden rounded-md opacity-60 outline-none transition-opacity hover:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/50 aria-[current=true]:opacity-100 aria-[current=true]:ring-2 aria-[current=true]:ring-primary"
            >
              <img
                src={thumb.thumbnail ?? thumb.src}
                alt=""
                draggable={false}
                className="h-14 w-20 object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export { Lightbox, LightboxTrigger }
export type { LightboxImage, LightboxLabels }
