import * as React from "react"
import { cn } from "cn"
import { Separator as SeparatorPrimitive } from "radix-ui"

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  children,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  const labelId = React.useId()

  if (children == null || children === false) {
    return (
      <SeparatorPrimitive.Root
        data-slot="separator"
        decorative={decorative}
        orientation={orientation}
        className={cn(
          "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
          className
        )}
        {...props}
      />
    )
  }

  // With a label: a line on each side of it. The lines are drawn next to the
  // label instead of behind it, so no background has to hide them and the
  // separator works on any surface. A semantic separator takes the label as
  // its name, since role="separator" hides its content from screen readers.
  const line = cn(
    "flex-1 bg-border",
    orientation === "vertical" ? "w-px" : "h-px"
  )

  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      aria-labelledby={decorative ? undefined : labelId}
      className={cn(
        "flex shrink-0 items-center gap-2 text-sm text-muted-foreground data-horizontal:w-full data-vertical:flex-col data-vertical:self-stretch",
        className
      )}
      {...props}
    >
      <span aria-hidden className={line} />
      <span data-slot="separator-label" id={labelId}>
        {children}
      </span>
      <span aria-hidden className={line} />
    </SeparatorPrimitive.Root>
  )
}

export { Separator }
