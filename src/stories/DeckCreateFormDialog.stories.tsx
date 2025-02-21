import { Meta, StoryObj } from "@storybook/react"
import { DeckCreateFormDialog } from "@/src/deck/DeckCreateFormDialog"
import { action } from "@storybook/addon-actions"

const meta = {
  title: "deck/DeckCreateFormDialog",
  component: DeckCreateFormDialog,
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
}
