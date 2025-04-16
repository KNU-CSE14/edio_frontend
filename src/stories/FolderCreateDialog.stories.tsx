import { Meta, StoryObj } from "@storybook/react"
import FolderCreateDialog from "@/src/folder/FolderCreateDialog"
const meta = {
  title: "folder/FolderCreateDialog",
  component: FolderCreateDialog,
} satisfies Meta<typeof FolderCreateDialog>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: <div>폴더 생성</div>,
  },
}
