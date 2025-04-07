import { Meta, StoryObj } from "@storybook/react"
import FolderDetailCarousel from "@/src/folder/FolderDetailCarousel"

const meta = {
  title: "folder/FolderDetailCarousel",
  component: FolderDetailCarousel,
} satisfies Meta<typeof FolderDetailCarousel>

export default meta

type Story = StoryObj<typeof FolderDetailCarousel>

export const OnlyOneDeck: Story = {
  args: {
    folderDetail: {
      id: 1,
      name: "Default",
      subFolders: [],
      decks: [
        {
          id: 1,
          folderId: 1,
          categoryId: 1,
          name: "Deck 1",
          description: "ttt",
        },
      ],
    },
  },
}

export const HasThreeDeck: Story = {
  args: {
    folderDetail: {
      id: 2,
      name: "Dir 1",
      subFolders: [],
      decks: [
        {
          id: 2,
          folderId: 1,
          categoryId: 1,
          name: "Deck 2",
          description: "ttt",
        },
        {
          id: 3,
          folderId: 1,
          categoryId: 1,
          name: "Deck 3",
          description: "ttt",
        },
        {
          id: 4,
          folderId: 1,
          categoryId: 1,
          name: "Deck 4",
          description: "ttt",
        },
      ],
    },
  },
}

export const HasMultiDeck: Story = {
  args: {
    folderDetail: {
      id: 3,
      name: "Dir 2",
      subFolders: [],
      decks: [
        {
          id: 5,
          folderId: 1,
          categoryId: 1,
          name: "Deck 5",
          description: "ttt",
        },
        {
          id: 6,
          folderId: 1,
          categoryId: 1,
          name: "Deck 6",
          description: "ttt",
        },
        {
          id: 7,
          folderId: 1,
          categoryId: 1,
          name: "Deck 7",
          description: "ttt",
        },
        {
          id: 8,
          folderId: 1,
          categoryId: 1,
          name: "Deck 8",
          description: "ttt",
        },
        {
          id: 9,
          folderId: 1,
          categoryId: 1,
          name: "Deck 9",
          description: "ttt",
        },
        {
          id: 10,
          folderId: 1,
          categoryId: 1,
          name: "Deck 10",
          description: "ttt",
        },
      ],
    },
  },
}
