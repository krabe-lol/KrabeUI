import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, fn, spyOn, userEvent, waitFor, within } from "storybook/test"
import { Button } from "./button"
import { Lightbox, LightboxTrigger, type LightboxImage } from "./lightbox"

// Placeholder images: colored SVG data URIs with their number on them, in
// different aspect ratios. No network involved.
function placeholder(n: number, width: number, height: number, hue: number) {
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `<rect width="100%" height="100%" fill="hsl(${hue} 55% 42%)"/>`,
    `<rect x="12" y="12" width="${width - 24}" height="${height - 24}" fill="none" stroke="white" stroke-opacity="0.6" stroke-width="6"/>`,
    `<text x="50%" y="50%" fill="white" font-family="sans-serif" font-size="${Math.round(Math.min(width, height) / 2)}" font-weight="700" text-anchor="middle" dominant-baseline="central">${n}</text>`,
    `</svg>`,
  ].join("")
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

const sizes = [
  [1200, 800],
  [800, 1200],
  [1000, 1000],
  [1600, 700],
  [900, 1400],
  [1200, 900],
  [1400, 800],
  [700, 1000],
] as const

const images: LightboxImage[] = sizes.map(([width, height], i) => ({
  src: placeholder(i + 1, width, height, (i * 47) % 360),
  thumbnail: placeholder(i + 1, width / 5, height / 5, (i * 47) % 360),
  alt: `Placeholder image ${i + 1}`,
  caption: i % 3 === 2 ? undefined : `Caption of image ${i + 1} (${width} x ${height})`,
}))

const meta = {
  title: "Components/Lightbox",
  component: Lightbox,
  tags: ["autodocs"],
  args: {
    images,
  },
  parameters: {
    docs: {
      description: {
        component: [
          "A fullscreen image viewer for single images and galleries, built on Radix `Dialog`. KrabeUI-only -- shadcn has no equivalent.",
          "",
          "`Lightbox` takes the `images` and renders the viewer itself; `LightboxTrigger` (with `asChild`, like every other trigger) opens it at a given `index`. For keyboard access wrap an `<img>` in a `<button>` and make that the trigger.",
          "",
          "- **Close** with the X, Esc, or a click on the backdrop (not on the image).",
          "- **Gallery** (more than one image): previous/next buttons, left/right arrow keys, a counter (\"3 / 12\") and a thumbnail strip. The buttons are disabled at the ends -- there is no looping. The neighbors of the shown image are preloaded.",
          "- **Touch swipes** (touch and pen, never the mouse): swipe sideways to page (the image follows the finger; past ~20% of the width or with a quick flick it turns, otherwise it snaps back; at the first/last image it only resists), swipe down to close. The axis is locked after a few pixels. Swipes starting on a button or link are ignored.",
          "- **Always dark**: overlay and content carry a `dark` class, so the viewer looks the same whatever the theme of the page.",
          "- `open` / `index` are each controlled or uncontrolled (`defaultOpen`, `defaultIndex`, `onOpenChange`, `onIndexChange`).",
          "- `labels` overrides the English texts (`title`, `close`, `previous`, `next`, `thumbnails`, `showImage(n)`), e.g. to translate them.",
          "",
          "Each image is `{ src, alt, caption?, thumbnail? }`; `thumbnail` is shown in the strip instead of `src`.",
          "```tsx",
          'import { Lightbox, LightboxTrigger } from "krabeui/lightbox"',
          "```",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof Lightbox>

export default meta

type Story = StoryObj<typeof meta>

const dialog = () => within(document.body).findByRole("dialog", { name: "Image viewer" })
const counter = (el: HTMLElement) => el.querySelector("[data-slot=lightbox-counter]")

function Grid({ items }: { items: LightboxImage[] }) {
  return (
    <div className="grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((image, i) => (
        <LightboxTrigger key={image.src} index={i} asChild>
          <button
            type="button"
            className="overflow-hidden rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <img
              src={image.thumbnail ?? image.src}
              alt={image.alt}
              className="aspect-4/3 w-full object-cover transition-opacity hover:opacity-80"
            />
          </button>
        </LightboxTrigger>
      ))}
    </div>
  )
}

export const Gallery: Story = {
  render: (args) => (
    <Lightbox {...args}>
      <Grid items={args.images} />
    </Lightbox>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    const trigger = canvas.getByRole("button", { name: "Placeholder image 1" })
    const next = () => body.getByRole("button", { name: "Next" })
    const previous = () => body.getByRole("button", { name: "Previous" })
    let viewer!: HTMLElement
    const expectCounter = (text: string) =>
      waitFor(() => expect(counter(viewer)).toHaveTextContent(text))

    await step("opens at the clicked trigger", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Placeholder image 3" }))
      viewer = await dialog()
      await expectCounter("3 / 8")
      // The viewer fades in from opacity 0, so visibility needs a moment.
      await waitFor(() => expect(body.getByRole("img", { name: "Placeholder image 3" })).toBeVisible())
      // Close it again to try the first trigger below.
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(document.querySelector("[data-slot=lightbox-content]")).toBeNull())
    })

    await step("opens at the first image", async () => {
      await userEvent.click(trigger)
      viewer = await dialog()
      await expectCounter("1 / 8")
      await expect(previous()).toBeDisabled()
      await waitFor(() => expect(body.getByText("Caption of image 1 (1200 x 800)")).toBeVisible())
    })

    await step("the next button turns the page", async () => {
      await userEvent.click(next())
      await expectCounter("2 / 8")
      await expect(previous()).toBeEnabled()
    })

    await step("a portrait image fits the viewport with its caption", async () => {
      const img = body.getByRole("img", { name: "Placeholder image 2" })
      const caption = body.getByText("Caption of image 2 (800 x 1200)")
      await expect(getComputedStyle(img).objectFit).toBe("contain")
      const rect = img.getBoundingClientRect()
      await expect(rect.top).toBeGreaterThanOrEqual(0)
      await expect(rect.left).toBeGreaterThanOrEqual(0)
      await expect(rect.right).toBeLessThanOrEqual(window.innerWidth)
      await expect(caption.getBoundingClientRect().bottom).toBeLessThanOrEqual(window.innerHeight)
      await expect(rect.bottom).toBeLessThanOrEqual(caption.getBoundingClientRect().top)
    })

    await step("arrow keys turn the page", async () => {
      await userEvent.keyboard("{ArrowRight}")
      await expectCounter("3 / 8")
      await userEvent.keyboard("{ArrowLeft}")
      await expectCounter("2 / 8")
    })

    await step("a thumbnail jumps to its image and is marked current", async () => {
      await userEvent.click(body.getByRole("button", { name: "Show image 5" }))
      await expectCounter("5 / 8")
      await expect(body.getByRole("button", { name: "Show image 5" })).toHaveAttribute("aria-current", "true")
      await expect(body.getByRole("button", { name: "Show image 2" })).not.toHaveAttribute("aria-current")
    })

    await step("the active thumbnail is scrolled into view", async () => {
      const spy = spyOn(Element.prototype, "scrollIntoView")
      await userEvent.click(body.getByRole("button", { name: "Show image 6" }))
      await expectCounter("6 / 8")
      await waitFor(() =>
        expect(spy).toHaveBeenCalledWith({ block: "nearest", inline: "center" })
      )
      spy.mockRestore()
    })

    await step("Next is disabled on the last image and arrows don't loop", async () => {
      await userEvent.click(body.getByRole("button", { name: "Show image 8" }))
      await expectCounter("8 / 8")
      await expect(next()).toBeDisabled()
      await userEvent.keyboard("{ArrowRight}")
      await expectCounter("8 / 8")
    })

    await step("Esc closes and focus returns to the trigger", async () => {
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(document.querySelector("[data-slot=lightbox-content]")).toBeNull())
      await expect(trigger).toHaveFocus()
    })
  },
}

export const SingleImage: Story = {
  args: {
    images: [images[0]],
  },
  render: (args) => (
    <Lightbox {...args}>
      <LightboxTrigger index={0} asChild>
        <button type="button" className="rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
          <img src={images[0].thumbnail} alt={images[0].alt} className="w-48 rounded-lg" />
        </button>
      </LightboxTrigger>
    </Lightbox>
  ),
  play: async ({ canvasElement, step }) => {
    const body = within(document.body)
    const open = async () => {
      await userEvent.click(within(canvasElement).getByRole("button", { name: "Placeholder image 1" }))
      return dialog()
    }

    await step("has no navigation, counter or thumbnails", async () => {
      const viewer = await open()
      // The viewer fades in, so wait until it's fully opaque.
      await waitFor(() => expect(body.getByRole("img", { name: "Placeholder image 1" })).toBeVisible())
      await expect(body.getByText("Caption of image 1 (1200 x 800)")).toBeVisible()
      await expect(body.queryByRole("button", { name: "Next" })).toBeNull()
      await expect(body.queryByRole("button", { name: "Previous" })).toBeNull()
      await expect(body.queryByRole("group", { name: "Thumbnails" })).toBeNull()
      await expect(counter(viewer)).toBeEmptyDOMElement()
    })

    await step("a click on the image keeps it open, one on the backdrop closes", async () => {
      await userEvent.click(body.getByRole("img", { name: "Placeholder image 1" }))
      await expect(document.querySelector("[data-slot=lightbox-content]")).not.toBeNull()
      await userEvent.click(document.querySelector<HTMLElement>("[data-slot=lightbox-stage]")!)
      await waitFor(() => expect(document.querySelector("[data-slot=lightbox-content]")).toBeNull())
    })

    await step("the close button closes", async () => {
      await open()
      await userEvent.click(body.getByRole("button", { name: "Close" }))
      await waitFor(() => expect(document.querySelector("[data-slot=lightbox-content]")).toBeNull())
    })

    await step("Esc closes", async () => {
      await open()
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(document.querySelector("[data-slot=lightbox-content]")).toBeNull())
    })
  },
}

function ControlledExample({ items }: { items: LightboxImage[] }) {
  const [open, setOpen] = React.useState(false)
  const [index, setIndex] = React.useState(0)

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => {
            setIndex(2)
            setOpen(true)
          }}
        >
          Open at image 3
        </Button>
        <Button variant="outline" onClick={() => setIndex(items.length - 1)}>
          Jump to last image
        </Button>
      </div>
      <p data-testid="state" className="text-sm text-muted-foreground">
        {`open: ${open}, index: ${index}`}
      </p>
      <Lightbox
        images={items}
        open={open}
        onOpenChange={setOpen}
        index={index}
        onIndexChange={setIndex}
      />
    </div>
  )
}

export const Controlled: Story = {
  render: (args) => <ControlledExample items={args.images} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)
    const state = canvas.getByTestId("state")

    await step("opens from outside at the given index", async () => {
      await expect(state).toHaveTextContent("open: false, index: 0")
      await userEvent.click(canvas.getByRole("button", { name: "Open at image 3" }))
      const viewer = await dialog()
      await expect(counter(viewer)).toHaveTextContent("3 / 8")
      await expect(state).toHaveTextContent("open: true, index: 2")
    })

    await step("navigation reports back", async () => {
      await userEvent.click(body.getByRole("button", { name: "Next" }))
      await expect(state).toHaveTextContent("open: true, index: 3")
      await expect(counter(await dialog())).toHaveTextContent("4 / 8")
    })

    await step("closing reports back", async () => {
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(state).toHaveTextContent("open: false, index: 3"))
      await waitFor(() => expect(document.querySelector("[data-slot=lightbox-content]")).toBeNull())
    })

    await step("the index can be changed from outside", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Jump to last image" }))
      await userEvent.click(canvas.getByRole("button", { name: "Open at image 3" }))
      await expect(counter(await dialog())).toHaveTextContent("3 / 8")
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(document.querySelector("[data-slot=lightbox-content]")).toBeNull())
    })
  },
}

export const CustomLabels: Story = {
  args: {
    labels: {
      title: "Bildbetrachter",
      close: "Schließen",
      previous: "Zurück",
      next: "Weiter",
      thumbnails: "Vorschaubilder",
      showImage: (n: number) => `Bild ${n} anzeigen`,
    },
  },
  render: (args) => (
    <Lightbox {...args}>
      <Grid items={args.images} />
    </Lightbox>
  ),
  play: async ({ canvasElement }) => {
    const body = within(document.body)
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Placeholder image 1" }))
    await within(document.body).findByRole("dialog", { name: "Bildbetrachter" })
    // The viewer fades in, so wait until it's fully opaque.
    await waitFor(() => expect(body.getByRole("button", { name: "Schließen" })).toBeVisible())
    await expect(body.getByRole("button", { name: "Zurück" })).toBeVisible()
    await expect(body.getByRole("button", { name: "Weiter" })).toBeVisible()
    await expect(body.getByRole("group", { name: "Vorschaubilder" })).toBeVisible()
    await expect(body.getByRole("button", { name: "Bild 2 anzeigen" })).toBeVisible()
  },
}

// Dispatches a pointer drag from the center of `el`. Spread over
// `steps * stepDelay` ms so the release velocity is realistic; with
// `release: false` it stays down and returns the function that lifts the
// pointer.
async function drag(
  el: Element,
  {
    dx = 0,
    dy = 0,
    pointerType = "touch",
    steps = 10,
    stepDelay = 16,
    release = true,
  }: {
    dx?: number
    dy?: number
    pointerType?: string
    steps?: number
    stepDelay?: number
    release?: boolean
  }
) {
  const rect = el.getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2
  const init = { bubbles: true, cancelable: true, pointerId: 1, isPrimary: true, pointerType }
  const up = () => el.dispatchEvent(new PointerEvent("pointerup", { ...init, clientX: x + dx, clientY: y + dy }))
  el.dispatchEvent(new PointerEvent("pointerdown", { ...init, clientX: x, clientY: y }))
  for (let i = 1; i <= steps; i++) {
    await new Promise((resolve) => setTimeout(resolve, stepDelay))
    el.dispatchEvent(
      new PointerEvent("pointermove", { ...init, clientX: x + (dx * i) / steps, clientY: y + (dy * i) / steps })
    )
  }
  if (release) up()
  return up
}

export const Swipe: Story = {
  tags: ["!autodocs"],
  args: {
    defaultOpen: true,
    defaultIndex: 1,
    onOpenChange: fn(),
    onIndexChange: fn(),
  },
  render: (args) => (
    <Lightbox {...args}>
      <Grid items={args.images} />
    </Lightbox>
  ),
  play: async ({ args, step }) => {
    const viewer = await dialog()
    const stage = viewer.querySelector<HTMLElement>("[data-slot=lightbox-stage]")!
    const slide = () => viewer.querySelector<HTMLElement>("[data-slot=lightbox-slide]")!
    const expectCounter = (text: string) =>
      waitFor(() => expect(counter(viewer)).toHaveTextContent(text))
    const openChanged = args.onOpenChange as ReturnType<typeof fn>
    const indexChanged = args.onIndexChange as ReturnType<typeof fn>

    await expectCounter("2 / 8")

    await step("mouse drags never swipe", async () => {
      await drag(stage, { dx: -500, pointerType: "mouse" })
      await drag(stage, { dy: 500, pointerType: "mouse" })
      await expect(slide().style.transform).toBe("")
      await expect(indexChanged).not.toHaveBeenCalled()
      await expect(openChanged).not.toHaveBeenCalled()
    })

    await step("the image follows the finger, a short slow swipe snaps back", async () => {
      const up = await drag(stage, { dx: -60, release: false })
      await expect(slide().style.transform).toContain("-60px")
      // Held for a while: slow and short, so releasing doesn't count.
      await new Promise((resolve) => setTimeout(resolve, 400))
      up()
      await expect(slide().style.transform).toBe("")
      await expect(indexChanged).not.toHaveBeenCalled()
    })

    await step("a long swipe to the left shows the next image", async () => {
      await drag(stage, { dx: -500 })
      await expectCounter("3 / 8")
      await expect(indexChanged).toHaveBeenLastCalledWith(2)
      await expect(slide().style.transform).toBe("")
    })

    await step("a swipe to the right shows the previous image", async () => {
      await drag(stage, { dx: 500 })
      await expectCounter("2 / 8")
      await expect(indexChanged).toHaveBeenLastCalledWith(1)
    })

    await step("a quick flick turns the page without covering much distance", async () => {
      await drag(stage, { dx: -80, steps: 5, stepDelay: 6 })
      await expectCounter("3 / 8")
      await drag(stage, { dx: 80, steps: 5, stepDelay: 6 })
      await expectCounter("2 / 8")
    })

    await step("swiping past the first or last image does nothing", async () => {
      await userEvent.click(within(viewer).getByRole("button", { name: "Show image 1" }))
      await expectCounter("1 / 8")
      indexChanged.mockClear()
      await drag(stage, { dx: 500 })
      await expect(slide().style.transform).toBe("")
      await expectCounter("1 / 8")
      await expect(indexChanged).not.toHaveBeenCalled()

      await userEvent.click(within(viewer).getByRole("button", { name: "Show image 8" }))
      await expectCounter("8 / 8")
      indexChanged.mockClear()
      await drag(stage, { dx: -500 })
      await expect(slide().style.transform).toBe("")
      await expectCounter("8 / 8")
      await expect(indexChanged).not.toHaveBeenCalled()
    })

    await step("swiping from a control is ignored", async () => {
      await drag(within(viewer).getByRole("button", { name: "Previous" }), { dx: -500 })
      await expectCounter("8 / 8")
      await expect(indexChanged).not.toHaveBeenCalled()
    })

    await step("an upward swipe or a short downward swipe keeps it open", async () => {
      await drag(stage, { dy: -500 })
      await drag(stage, { dy: 30 })
      await expect(slide().style.transform).toBe("")
      await expect(openChanged).not.toHaveBeenCalled()
    })

    await step("a long swipe down closes", async () => {
      await drag(stage, { dy: 500 })
      await expect(openChanged).toHaveBeenCalledWith(false)
      await waitFor(() => expect(document.querySelector("[data-slot=lightbox-content]")).toBeNull())
    })
  },
}
