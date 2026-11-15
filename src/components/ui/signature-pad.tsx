import * as React from "react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"

// KrabeUI's own signature pad (shadcn has none): draw a signature with mouse,
// finger or pen. While drawing the ink follows the theme (`text-foreground`);
// the exported image is always black ink on white, like a signature on paper,
// so it stays readable wherever it is shown later.

type Point = { x: number; y: number }

/** Scale of the exported image relative to the pad's CSS size. */
const EXPORT_SCALE = 2
const LINE_WIDTH = 2

type SignaturePadProps = Omit<React.ComponentProps<"div">, "onChange"> & {
  /** Called after every stroke with a PNG data URL (black ink on white), or `null` once cleared. */
  onChange?: (value: string | null) => void
  disabled?: boolean
  /** Height of the drawing area in CSS pixels. */
  height?: number
  /** Hint shown while the pad is empty. */
  placeholder?: string
  /** Label of the button that clears the pad. */
  clearLabel?: string
  /** Accessible name of the drawing area. */
  label?: string
}

function drawStrokes(
  context: CanvasRenderingContext2D,
  strokes: readonly (readonly Point[])[],
  scale: number,
  color: string
) {
  context.strokeStyle = color
  context.fillStyle = color
  context.lineWidth = LINE_WIDTH * scale
  context.lineCap = "round"
  context.lineJoin = "round"
  for (const stroke of strokes) {
    const [first, ...rest] = stroke
    if (!first) continue
    if (rest.length === 0) {
      // A single tap leaves a dot.
      context.beginPath()
      context.arc(first.x * scale, first.y * scale, (LINE_WIDTH * scale) / 2, 0, Math.PI * 2)
      context.fill()
      continue
    }
    context.beginPath()
    context.moveTo(first.x * scale, first.y * scale)
    for (const point of rest) context.lineTo(point.x * scale, point.y * scale)
    context.stroke()
  }
}

function SignaturePad({
  className,
  onChange,
  disabled = false,
  height = 160,
  placeholder = "Sign here",
  clearLabel = "Clear",
  label = "Signature",
  ...props
}: SignaturePadProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const strokes = React.useRef<Point[][]>([])
  const drawing = React.useRef(false)
  const [empty, setEmpty] = React.useState(true)

  const redraw = React.useCallback(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (!canvas || !context) return
    const ratio = window.devicePixelRatio || 1
    context.clearRect(0, 0, canvas.width, canvas.height)
    drawStrokes(context, strokes.current, ratio, getComputedStyle(canvas).color)
  }, [])

  // Keep the canvas sharp and as wide as its container; redraw after every resize.
  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      const ratio = window.devicePixelRatio || 1
      const width = canvas.clientWidth
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      redraw()
    }
    resize()
    if (typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [height, redraw])

  const exportImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const image = document.createElement("canvas")
    image.width = Math.round(canvas.clientWidth * EXPORT_SCALE)
    image.height = Math.round(height * EXPORT_SCALE)
    const context = image.getContext("2d")
    if (!context) return null
    context.fillStyle = "#ffffff"
    context.fillRect(0, 0, image.width, image.height)
    drawStrokes(context, strokes.current, EXPORT_SCALE, "#000000")
    return image.toDataURL("image/png")
  }

  const pointFor = (event: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = event.currentTarget.getBoundingClientRect()
    return { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled || (event.pointerType === "mouse" && event.button !== 0)) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    drawing.current = true
    strokes.current.push([pointFor(event)])
    redraw()
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return
    strokes.current[strokes.current.length - 1]?.push(pointFor(event))
    redraw()
  }

  const finishStroke = () => {
    if (!drawing.current) return
    drawing.current = false
    setEmpty(false)
    onChange?.(exportImage())
  }

  const clear = () => {
    strokes.current = []
    setEmpty(true)
    redraw()
    onChange?.(null)
  }

  return (
    <div
      data-slot="signature-pad"
      data-disabled={disabled || undefined}
      className={cn("group/signature-pad space-y-2", className)}
      {...props}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-lg border border-input bg-transparent dark:bg-input/30",
          "group-aria-invalid/signature-pad:border-destructive group-aria-invalid/signature-pad:ring-3 group-aria-invalid/signature-pad:ring-destructive/20",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={label}
          className={cn("block w-full touch-none text-foreground", !disabled && "cursor-crosshair")}
          style={{ height }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishStroke}
          onPointerCancel={finishStroke}
          onLostPointerCapture={finishStroke}
        />
        {empty && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
            {placeholder}
          </span>
        )}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 bottom-8 border-b border-dashed border-border"
        />
      </div>
      <div className="flex justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={clear} disabled={disabled || empty}>
          {clearLabel}
        </Button>
      </div>
    </div>
  )
}

export { SignaturePad }
export type { SignaturePadProps }
