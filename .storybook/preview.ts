import type { Preview } from "@storybook/react"
import "../app/globals.css"
import { initialize, mswLoader } from "msw-storybook-addon"

initialize()

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
  loaders: [mswLoader],
}

export default preview
