import { Meta, StoryObj } from "@storybook/react"
import DeckInfoCard from "@/src/deck/DeckInfoCard"

const meta = {
  title: "deck/DeckInfoCard",
  component: DeckInfoCard,
} satisfies Meta<typeof DeckInfoCard>

export default meta

type Story = StoryObj<typeof meta>

export const HasImage: Story = {
  args: {
    deck: {
      id: 1,
      folderId: 1,
      categoryId: 1,
      name: "deck name",
      description: "sample",
      imagePath:
        "https://edio-file-bucket.s3.ap-northeast-2.amazonaws.com/image/f3617d4e-1d01-4210-bd22-8d2e6d5724b4_67220033.JPG",
    },
  },
}

export const NoImage: Story = {
  args: {
    deck: {
      id: 1,
      folderId: 1,
      categoryId: 1,
      name: "deck name",
      description: "sample",
    },
  },
}
