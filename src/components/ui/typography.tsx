import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "font-heading scroll-m-20 text-4xl font-extrabold text-balance",
      h2: "font-heading scroll-m-20 text-3xl font-semibold first:mt-0",
      h3: "font-heading scroll-m-20 text-2xl font-semibold",
      h4: "font-heading scroll-m-20 text-xl font-semibold",
      p: "leading-7 [&:not(:first-child)]:mt-6",
      blockquote: "mt-6 border-l-2 pl-6 italic",
      list: "my-6 ml-6 list-disc [&>li]:mt-2",
      inlineCode:
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      lead: "text-xl text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm leading-none font-medium",
      muted: "text-sm text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "p",
  },
})

const defaultElement = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  p: "p",
  blockquote: "blockquote",
  list: "ul",
  inlineCode: "code",
  lead: "p",
  large: "div",
  small: "small",
  muted: "p",
} as const satisfies Record<
  NonNullable<VariantProps<typeof typographyVariants>["variant"]>,
  React.ElementType
>

function Typography({
  className,
  variant = "p",
  asChild = false,
  ...props
}: React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof typographyVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : defaultElement[variant ?? "p"]

  return (
    <Comp
      data-slot="typography"
      data-variant={variant}
      className={cn("mb-4", typographyVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Typography, typographyVariants }
