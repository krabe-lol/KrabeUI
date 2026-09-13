import { copyFileSync, readdirSync, readFileSync, writeFileSync } from "node:fs"

// Tailwind v4's @theme/@custom-variant directives need to go through the
// consumer's own Tailwind build, so this is copied verbatim (not bundled
// by tsup/esbuild, which don't understand Tailwind's at-rules).
copyFileSync("src/index.css", "dist/styles.css")

// esbuild silently drops "use client" directives when bundling (it can't
// place them correctly once imports are hoisted above them), so it's
// re-added here as a plain text prepend after the JS build is done.
const USE_CLIENT = '"use client";\n'
for (const file of readdirSync("dist")) {
  if (!file.endsWith(".js")) continue
  const contents = readFileSync(`dist/${file}`, "utf8")
  if (!contents.startsWith(USE_CLIENT)) {
    writeFileSync(`dist/${file}`, USE_CLIENT + contents)
  }
}
