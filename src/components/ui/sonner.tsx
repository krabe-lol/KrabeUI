import * as React from "react"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

/**
 * KrabeUI has no theme-provider context (consumers toggle dark mode by
 * putting a `.dark` class on `<html>`, per the README), so this tracks that
 * class directly instead of depending on `next-themes`, which only works
 * inside a Next.js `<ThemeProvider>`.
 */
function useColorScheme(): "light" | "dark" {
  const [scheme, setScheme] = React.useState<"light" | "dark">(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
      ? "dark"
      : "light"
  )

  React.useEffect(() => {
    const root = document.documentElement
    const update = () => setScheme(root.classList.contains("dark") ? "dark" : "light")
    update()
    const observer = new MutationObserver(update)
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  return scheme
}

function Toaster({ ...props }: ToasterProps) {
  const theme = useColorScheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
