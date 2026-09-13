import { defineConfig } from "tsup"

export default defineConfig({
  entry: {
    index: "src/index.ts",
    button: "src/components/ui/button.tsx",
    input: "src/components/ui/input.tsx",
    label: "src/components/ui/label.tsx",
    card: "src/components/ui/card.tsx",
    dialog: "src/components/ui/dialog.tsx",
    "dropdown-menu": "src/components/ui/dropdown-menu.tsx",
    select: "src/components/ui/select.tsx",
    checkbox: "src/components/ui/checkbox.tsx",
    badge: "src/components/ui/badge.tsx",
    table: "src/components/ui/table.tsx",
    utils: "src/lib/utils.ts",
  },
  format: ["esm"],
  dts: { resolve: true },
  tsconfig: "tsconfig.build.json",
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  external: ["react", "react-dom"],
})
