import { Meta, StoryObj } from "@storybook/react"
import { DeckEditFormDialog } from "@/src/deck/DeckEditFormDialog"
import { action } from "@storybook/addon-actions"

const meta = {
  title: "deck/DeckEditFormDialog",
  component: DeckEditFormDialog,
} satisfies Meta

export default meta

type Story = StoryObj<typeof DeckEditFormDialog>

export const CreateForm: Story = {
  args: {
    open: true,
    onOpenChangeFn: (open: boolean) => {
      action("onOpenChangeFn")("Open Or Close!")
    },
  },
}

export const UpdateForm: Story = {
  args: {
    deck: {
      id: 1,
      folderId: 1,
      categoryId: 1,
      name: "deck name",
      description: "sample",
      isShared: false,
      isFavorite: false,
    },
    open: true,
    onOpenChangeFn: (open: boolean) => {
      action("onOpenChangeFn")("Open Or Close!")
    },
  },
}
