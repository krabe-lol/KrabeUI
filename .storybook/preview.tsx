import type { Decorator, Preview } from "@storybook/react-vite"
import type { CSSProperties } from "react"
import { mswLoader } from "msw-storybook-addon/csf3"
import "../src/index.css"
import { type ColorFamily, colorFamilies, colorFamilyShades } from "./color-families"
import { mswHandlers } from "./msw-handlers"

type Scheme = "light" | "dark"

/**
 * Fixed shade per brand token -- only the Tailwind color family (toolbar
 * below) varies, so switching families always previews a consistent look.
 * Separate maps per scheme so secondary/muted/accent stay light tints on
 * light backgrounds and dark tints on dark backgrounds, same as the neutral
 * default theme does. Storybook demo only: real consumers override these CSS
 * custom properties directly in their own globals.css, so nothing here ships
 * in src/index.css.
 */
const familyShadesByScheme = {
  light: {
    "--primary": 500,
    "--primary-foreground": 50,
    "--secondary": 100,
    "--secondary-foreground": 900,
    "--muted": 50,
    "--muted-foreground": 600,
    "--accent": 100,
    "--accent-foreground": 900,
  },
  dark: {
    "--primary": 600,
    "--primary-foreground": 50,
    "--secondary": 900,
    "--secondary-foreground": 100,
    "--muted": 900,
    "--muted-foreground": 300,
    "--accent": 900,
    "--accent-foreground": 100,
  },
} as const

const withTheme: Decorator = (Story, context) => {
  const { scheme = "light", colorFamily = "none" } = context.globals as {
    scheme?: Scheme
    colorFamily?: ColorFamily | "none"
  }

  const vars: Record<string, string> =
    colorFamily === "none"
      ? {}
      : Object.fromEntries(
          Object.entries(familyShadesByScheme[scheme]).map(([token, shade]) => [
            token,
            colorFamilyShades[colorFamily][shade],
          ])
        )

  return (
    <div
      className={scheme === "dark" ? "dark" : undefined}
      style={{ ...vars, colorScheme: scheme } as CSSProperties}
    >
      <div className="min-h-24 bg-background p-8 text-foreground">
        <Story />
      </div>
    </div>
  )
}

const preview: Preview = {
  tags: ["autodocs"],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        method: "alphabetical",
      },
    },
  },
  globalTypes: {
    scheme: {
      description: "Light / dark color scheme",
      toolbar: {
        title: "Scheme",
        icon: "contrast",
        dynamicTitle: true,
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
      },
    },
    colorFamily: {
      description:
        "Preview primary/secondary/muted/accent with a Tailwind color family at fixed shades -- demo only, not a real Button/Card/etc prop.",
      toolbar: {
        title: "Color family",
        icon: "paintbrush",
        dynamicTitle: true,
        items: [
          { value: "none", title: "KrabeUI default" },
          ...colorFamilies.map((family) => ({
            value: family,
            title: family[0].toUpperCase() + family.slice(1),
          })),
        ],
      },
    },
  },
  initialGlobals: {
    scheme: "light",
    colorFamily: "none",
  },
  decorators: [withTheme],
  loaders: [mswLoader()],
  async beforeEach({ msw }) {
    msw.use(...mswHandlers)
  },
}

export default preview
