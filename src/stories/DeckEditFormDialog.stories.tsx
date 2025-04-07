import { Meta, StoryObj } from "@storybook/react"
import { DeckEditFormDialog } from "@/src/deck/DeckEditFormDialog"

const meta = {
  title: "deck/DeckEditFormDialog",
  component: DeckEditFormDialog,
} satisfies Meta

export default meta

type Story = StoryObj<typeof DeckEditFormDialog>

export const CreateForm: Story = {
  args: {
    children: <div>생성 클릭</div>,
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
    },
    children: <div>수정 클릭</div>,
  },
}
