import React from "react"
import type { Preview } from "@storybook/react"
import "../app/globals.css"
import { initialize, mswLoader } from "msw-storybook-addon"
import MSWProvider from "../src/shared/MswProvider"
import QueryProvider from "../src/shared/QueryProvider"
import handlers from "../mocks/handlers"

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
    msw: { handlers },
  },
  loaders: [mswLoader],
  decorators: [
    (Story) => (
      <MSWProvider>
        <QueryProvider>
          <Story />
        </QueryProvider>
      </MSWProvider>
    ),
  ],
}

export default preview
