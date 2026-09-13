import type { Decorator, Preview } from "@storybook/react-vite"
import type { CSSProperties } from "react"
import "../src/index.css"

type TokenVars = Record<string, string>

type Scheme = "light" | "dark"

/**
 * Real token values lifted from Brettchen/Racehub/Lagerist's own globals.css
 * (see krabeui's README "Theming" section) so switching presets here shows
 * what an actual consuming project's override would look like, not a made-up
 * palette.
 */
const consumerPresets: Record<
  string,
  { radius: string; light: TokenVars; dark: TokenVars }
> = {
  brettchen: {
    radius: "0.625rem",
    light: {
      "--background": "oklch(0.97 0.014 70)",
      "--foreground": "oklch(0.28 0.03 40)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.145 0 0)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.145 0 0)",
      "--primary": "oklch(0.56 0.14 350)",
      "--primary-foreground": "oklch(0.99 0.01 70)",
      "--secondary": "oklch(0.97 0 0)",
      "--secondary-foreground": "oklch(0.205 0 0)",
      "--muted": "oklch(0.97 0 0)",
      "--muted-foreground": "oklch(0.556 0 0)",
      "--accent": "oklch(0.52 0.11 130)",
      "--accent-foreground": "oklch(0.99 0.01 130)",
      "--destructive": "oklch(0.577 0.245 27.325)",
      "--border": "oklch(0.922 0 0)",
      "--input": "oklch(0.922 0 0)",
      "--ring": "oklch(0.8 0 0)",
    },
    dark: {
      "--background": "oklch(0.145 0.014 55)",
      "--foreground": "oklch(0.93 0.012 70)",
      "--card": "oklch(0.205 0 0)",
      "--card-foreground": "oklch(0.985 0 0)",
      "--popover": "oklch(0.205 0 0)",
      "--popover-foreground": "oklch(0.985 0 0)",
      "--primary": "oklch(0.68 0.13 350)",
      "--primary-foreground": "oklch(0.15 0.01 350)",
      "--secondary": "oklch(0.269 0 0)",
      "--secondary-foreground": "oklch(0.985 0 0)",
      "--muted": "oklch(0.269 0 0)",
      "--muted-foreground": "oklch(0.708 0 0)",
      "--accent": "oklch(0.269 0 0)",
      "--accent-foreground": "oklch(0.985 0 0)",
      "--destructive": "oklch(59.825% 0.18032 23.285)",
      "--border": "oklch(1 0 0 / 12%)",
      "--input": "oklch(1 0 0 / 18%)",
      "--ring": "oklch(0.48 0 0)",
    },
  },
  racehub: {
    radius: "0.5rem",
    light: {
      "--background": "hsl(0 0% 100%)",
      "--foreground": "hsl(222 47% 11%)",
      "--card": "hsl(0 0% 100%)",
      "--card-foreground": "hsl(222 47% 11%)",
      "--popover": "hsl(0 0% 100%)",
      "--popover-foreground": "hsl(222 47% 11%)",
      "--primary": "hsl(221 83% 53%)",
      "--primary-foreground": "hsl(210 40% 98%)",
      "--secondary": "hsl(210 40% 96%)",
      "--secondary-foreground": "hsl(222 47% 11%)",
      "--muted": "hsl(210 40% 96%)",
      "--muted-foreground": "hsl(215 16% 47%)",
      "--accent": "hsl(210 40% 96%)",
      "--accent-foreground": "hsl(222 47% 11%)",
      "--destructive": "hsl(0 72% 51%)",
      "--border": "hsl(214 32% 91%)",
      "--input": "hsl(214 32% 91%)",
      "--ring": "hsl(221 83% 53%)",
    },
    dark: {
      "--background": "hsl(222 47% 11%)",
      "--foreground": "hsl(210 40% 98%)",
      "--card": "hsl(222 47% 14%)",
      "--card-foreground": "hsl(210 40% 98%)",
      "--popover": "hsl(222 47% 14%)",
      "--popover-foreground": "hsl(210 40% 98%)",
      "--primary": "hsl(217 91% 60%)",
      "--primary-foreground": "hsl(222 47% 11%)",
      "--secondary": "hsl(217 33% 20%)",
      "--secondary-foreground": "hsl(210 40% 98%)",
      "--muted": "hsl(217 33% 20%)",
      "--muted-foreground": "hsl(215 20% 65%)",
      "--accent": "hsl(217 33% 20%)",
      "--accent-foreground": "hsl(210 40% 98%)",
      "--destructive": "hsl(0 63% 40%)",
      "--border": "hsl(217 33% 24%)",
      "--input": "hsl(217 33% 24%)",
      "--ring": "hsl(217 91% 60%)",
    },
  },
  // Lagerist runs a single DaisyUI "dracula" theme (no light mode), so the
  // same values are used regardless of the scheme toggle.
  lagerist: {
    radius: "1rem",
    light: {
      "--background": "oklch(28.822% 0.022 277.508)",
      "--foreground": "oklch(97.747% 0.007 106.545)",
      "--card": "oklch(26.805% 0.02 277.508)",
      "--card-foreground": "oklch(97.747% 0.007 106.545)",
      "--popover": "oklch(24.787% 0.019 277.508)",
      "--popover-foreground": "oklch(97.747% 0.007 106.545)",
      "--primary": "oklch(75.461% 0.183 346.812)",
      "--primary-foreground": "oklch(15.092% 0.036 346.812)",
      "--secondary": "oklch(74.202% 0.148 301.883)",
      "--secondary-foreground": "oklch(14.84% 0.029 301.883)",
      "--muted": "oklch(24.787% 0.019 277.508)",
      "--muted-foreground": "oklch(87.889% 0.006 275.524)",
      "--accent": "oklch(83.392% 0.124 66.558)",
      "--accent-foreground": "oklch(16.678% 0.024 66.558)",
      "--destructive": "oklch(68.22% 0.206 24.43)",
      "--border": "oklch(39.445% 0.032 275.524)",
      "--input": "oklch(39.445% 0.032 275.524)",
      "--ring": "oklch(75.461% 0.183 346.812)",
    },
    get dark() {
      return this.light
    },
  },
}

const accentSwatches: Record<string, { primary: string; primaryForeground: string }> = {
  rose: { primary: "oklch(0.65 0.2 10)", primaryForeground: "oklch(0.99 0 0)" },
  blue: { primary: "oklch(0.6 0.18 250)", primaryForeground: "oklch(0.99 0 0)" },
  green: { primary: "oklch(0.65 0.15 150)", primaryForeground: "oklch(0.99 0 0)" },
  amber: { primary: "oklch(0.8 0.15 85)", primaryForeground: "oklch(0.2 0.02 85)" },
  violet: { primary: "oklch(0.6 0.2 300)", primaryForeground: "oklch(0.99 0 0)" },
}

const radiusSteps: Record<string, string> = {
  none: "0rem",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
}

const withTheme: Decorator = (Story, context) => {
  const {
    themePreset = "default",
    scheme = "light",
    accent = "rose",
    radius = "md",
  } = context.globals as {
    themePreset?: string
    scheme?: Scheme
    accent?: string
    radius?: string
  }

  let vars: TokenVars = {}
  if (themePreset === "custom") {
    const swatch = accentSwatches[accent] ?? accentSwatches.rose
    vars = {
      "--primary": swatch.primary,
      "--primary-foreground": swatch.primaryForeground,
      "--radius": radiusSteps[radius] ?? radiusSteps.md,
    }
  } else if (themePreset !== "default") {
    const preset = consumerPresets[themePreset]
    if (preset) {
      vars = { ...preset[scheme], "--radius": preset.radius }
    }
  }

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
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    themePreset: {
      description: "Simulated consumer theme override",
      toolbar: {
        title: "Theme preset",
        icon: "paintbrush",
        dynamicTitle: true,
        items: [
          { value: "default", title: "KrabeUI default" },
          { value: "brettchen", title: "Brettchen" },
          { value: "racehub", title: "Racehub" },
          { value: "lagerist", title: "Lagerist" },
          { value: "custom", title: "Custom override" },
        ],
      },
    },
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
    accent: {
      description: "Accent color (only used when preset is 'Custom override')",
      toolbar: {
        title: "Accent (custom)",
        icon: "circle",
        dynamicTitle: true,
        items: [
          { value: "rose", title: "Rose" },
          { value: "blue", title: "Blue" },
          { value: "green", title: "Green" },
          { value: "amber", title: "Amber" },
          { value: "violet", title: "Violet" },
        ],
      },
    },
    radius: {
      description: "Corner radius (only used when preset is 'Custom override')",
      toolbar: {
        title: "Radius (custom)",
        icon: "component",
        dynamicTitle: true,
        items: [
          { value: "none", title: "None (0rem)" },
          { value: "sm", title: "Small (0.25rem)" },
          { value: "md", title: "Medium (0.5rem)" },
          { value: "lg", title: "Large (0.75rem)" },
          { value: "xl", title: "X-Large (1rem)" },
        ],
      },
    },
  },
  initialGlobals: {
    themePreset: "default",
    scheme: "light",
    accent: "rose",
    radius: "md",
  },
  decorators: [withTheme],
}

export default preview
