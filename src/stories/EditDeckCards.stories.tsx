import DeckEdit from "@/app/deck/[id]/edit/page"
import { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "deck/DeckEditPage",
  component: DeckEdit,
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: [["id", "1"]],
      },
    },
  },
} satisfies Meta<typeof DeckEdit>

export default meta

type Story = StoryObj<typeof DeckEdit>
export const Default: Story = {}
