import { Meta, StoryObj } from "@storybook/react"
import { DeckCreateFormDialog } from "@/src/deck/DeckCreateFormDialog"
import { action } from "@storybook/addon-actions"
import QueryProvider from "@/src/shared/QueryProvider"
import MSWProvider from "@/src/shared/MswProvider"
import handlers from "@/mocks/handlers"

const meta = {
  title: "deck/DeckCreateFormDialog",
  component: DeckCreateFormDialog,
  decorators: [
    (Story) => (
      <MSWProvider>
        <QueryProvider>
          <Story />
        </QueryProvider>
      </MSWProvider>
    ),
  ],
} satisfies Meta

export default meta

type Story = StoryObj<typeof DeckCreateFormDialog>

export const Default: Story = {
  args: {
    open: true,
    onOpenChangeFn: (open) => {
      action("onOpenChangeFn")("Open Or Close!")
    },
  },
  parameters: {
    msw: {
      handlers: handlers,
    },
  },
}
