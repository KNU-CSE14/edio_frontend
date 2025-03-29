import { Meta, StoryObj } from "@storybook/react"
import DeckSearchDialog from "@/src/deck/DeckSearchDialog"

const meta = {
  title: "deck/DeckSearchDialog",
  component: DeckSearchDialog,
} satisfies Meta<typeof DeckSearchDialog>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: <div>덱 검색</div>,
  },
}
