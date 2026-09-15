import type { StorybookConfig } from "@storybook/react-vite"

const config: StorybookConfig = {
  stories: ["../src/components/ui/**/*.stories.@(ts|tsx)"],
  addons: ["msw-storybook-addon", "@storybook/addon-vitest", "@storybook/addon-docs"],
  staticDirs: ["../public"],
  framework: "@storybook/react-vite",
}

export default config
