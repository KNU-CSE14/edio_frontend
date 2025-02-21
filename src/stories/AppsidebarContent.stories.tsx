import { SidebarProvider } from "@/src/shadcn/components/ui/sidebar"
import AppSidebarContent from "@/src/template/sidebar/AppSidebarContent"
import { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "sidebar",
  component: AppSidebarContent,
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Story />
      </SidebarProvider>
    ),
  ],
} satisfies Meta

export default meta

type Story = StoryObj<typeof AppSidebarContent>
export const Default: Story = {}
