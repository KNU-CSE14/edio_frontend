import { Meta, StoryObj } from "@storybook/react"
import FolderCreateDialog from "@/src/folder/FolderCreateDialog"
import { Button } from "@/src/shadcn/components/ui/button"
import { overlay } from "overlay-kit"
import Providers from "@/src/shared/Providers"
const meta: Meta<typeof FolderCreateDialog> = {
  title: "folder/FolderCreateDialog",
  component: FolderCreateDialog,
  render: () => (
    <Button
      onClick={() =>
        overlay.open(({ isOpen, close }) => (
          <FolderCreateDialog onOpenChange={close} open={isOpen} />
        ))
      }
    >
      폴더 생성
    </Button>
  ),
  decorators: [
    (Story) => (
      <Providers>
        <Story />
      </Providers>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
