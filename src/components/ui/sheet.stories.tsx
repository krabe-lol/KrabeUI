import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn, waitFor } from "storybook/test"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet"

const meta = {
  title: "Components/Sheet",
  component: Sheet,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "A panel that slides in from an edge of the screen, built on Radix `Dialog`. `side` on `SheetContent` picks the edge (`right` by default).",
          "",
          "**KrabeUI has no `Drawer`.** shadcn's `drawer` is built on `vaul` instead of Radix, so every edge-anchored panel -- bottom sheets on mobile included -- is a `Sheet`.",
          "",
          "**Swipe to close** (a KrabeUI addition, not in shadcn): on touch devices, swiping the panel toward its edge closes it once it's dragged past a quarter of its size or flicked. Mouse drags never swipe, so text selection and sliders keep working on desktop. Swipes are ignored when they start in an input, textarea, select, slider, or an element with `data-sheet-no-swipe`, and when the content can still scroll in that direction. Opt out per sheet with `<SheetContent swipeToClose={false}>`.",
          "```tsx",
          'import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "krabeui/sheet"',
          "```",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof Sheet>

export default meta

type Story = StoryObj<typeof meta>

const sides = ["top", "right", "bottom", "left"] as const

export const Default: Story = {
  render: (args) => (
    <>
      <Sheet {...args}>
        <SheetTrigger asChild>
          <Button variant="outline">Edit profile</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>Make changes to your profile here.</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 px-4">
            <div className="grid gap-1.5">
              <Label htmlFor="sheet-name">Name</Label>
              <Input id="sheet-name" defaultValue="Pedro Duarte" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="sheet-username">Username</Label>
              <Input id="sheet-username" defaultValue="@peduarte" />
            </div>
          </div>
          <SheetFooter>
            <Button>Save changes</Button>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  ),
}

export const Sides: Story = {
  render: (args) => (
    <>
      <div className="flex flex-wrap gap-2">
        {sides.map((side) => (
          <Sheet key={side} {...args}>
            <SheetTrigger asChild>
              <Button variant="outline" className="capitalize">
                {side}
              </Button>
            </SheetTrigger>
            <SheetContent side={side}>
              <SheetHeader>
                <SheetTitle>Sheet from the {side}</SheetTitle>
                <SheetDescription>Closes via the X, the overlay, or Esc.</SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        ))}
      </div>
    </>
  ),
}

// Dispatches a pointer drag from the center of `el`, spread over ~160ms so the
// release velocity is realistic.
async function drag(
  el: Element,
  { dx = 0, dy = 0, pointerType = "touch" }: { dx?: number; dy?: number; pointerType?: string }
) {
  const rect = el.getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2
  const init = { bubbles: true, cancelable: true, pointerId: 1, isPrimary: true, pointerType }
  el.dispatchEvent(new PointerEvent("pointerdown", { ...init, clientX: x, clientY: y }))
  const steps = 10
  for (let i = 1; i <= steps; i++) {
    await new Promise((resolve) => setTimeout(resolve, 16))
    el.dispatchEvent(
      new PointerEvent("pointermove", { ...init, clientX: x + (dx * i) / steps, clientY: y + (dy * i) / steps })
    )
  }
  el.dispatchEvent(new PointerEvent("pointerup", { ...init, clientX: x + dx, clientY: y + dy }))
}

const sheetContent = () => document.querySelector<HTMLElement>("[data-slot=sheet-content]")

export const SwipeToClose: Story = {
  tags: ["!autodocs"],
  args: {
    defaultOpen: true,
    onOpenChange: fn(),
  },
  render: (args) => (
    <>
      <Sheet {...args}>
        <SheetTrigger asChild>
          <Button variant="outline">Open</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Swipe me</SheetTitle>
            <SheetDescription>On a touch device, swipe right to close.</SheetDescription>
          </SheetHeader>
          <div className="px-4">
            <Input aria-label="Search" defaultValue="Swipes starting here are ignored" />
          </div>
        </SheetContent>
      </Sheet>
    </>
  ),
  play: async ({ args, step }) => {
    const content = await waitFor(() => sheetContent() ?? Promise.reject(new Error("sheet not open")))

    await step("mouse drags never swipe", async () => {
      await drag(content, { dx: 300, pointerType: "mouse" })
      await expect(content.style.transform).toBe("")
      await expect(args.onOpenChange).not.toHaveBeenCalled()
    })

    await step("short, slow touch swipe snaps back", async () => {
      await drag(content, { dx: 30 })
      await expect(content.style.transform).toBe("")
      await expect(args.onOpenChange).not.toHaveBeenCalled()
    })

    await step("touch swipe perpendicular to the edge is ignored", async () => {
      await drag(content, { dy: 300 })
      await expect(args.onOpenChange).not.toHaveBeenCalled()
    })

    await step("touch swipe starting in an input is ignored", async () => {
      await drag(content.querySelector("input")!, { dx: 300 })
      await expect(args.onOpenChange).not.toHaveBeenCalled()
    })

    await step("long touch swipe toward the edge closes", async () => {
      await drag(content, { dx: 300 })
      await expect(args.onOpenChange).toHaveBeenCalledWith(false)
      await waitFor(() => expect(sheetContent()).toBeNull())
    })
  },
}

export const SwipeWithScrollableContent: Story = {
  tags: ["!autodocs"],
  args: {
    defaultOpen: true,
    onOpenChange: fn(),
  },
  render: (args) => (
    <>
      <Sheet {...args}>
        <SheetTrigger asChild>
          <Button variant="outline">Open</Button>
        </SheetTrigger>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
            <SheetDescription>Swiping down scrolls the list until it's at the top, then closes.</SheetDescription>
          </SheetHeader>
          <div data-testid="sheet-scroll" className="max-h-40 overflow-y-auto px-4 pb-4">
            {Array.from({ length: 30 }, (_, i) => (
              <p key={i} className="py-1">
                Notification {i + 1}
              </p>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  ),
  play: async ({ args, step }) => {
    const content = await waitFor(() => sheetContent() ?? Promise.reject(new Error("sheet not open")))
    const list = content.querySelector<HTMLElement>("[data-testid=sheet-scroll]")!

    await step("swiping down while the list is scrolled is left to scrolling", async () => {
      list.scrollTop = 200
      await drag(list, { dy: 200 })
      await expect(content.style.transform).toBe("")
      await expect(args.onOpenChange).not.toHaveBeenCalled()
    })

    await step("swiping down with the list at the top closes", async () => {
      list.scrollTop = 0
      await drag(list, { dy: 200 })
      await expect(args.onOpenChange).toHaveBeenCalledWith(false)
      await waitFor(() => expect(sheetContent()).toBeNull())
    })
  },
}
