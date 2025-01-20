import handlers from "@/mocks/handlers"
import { SidebarProvider } from "@/src/shadcn/components/ui/sidebar"
import MSWProvider from "@/src/shared/MswProvider"
import QueryProvider from "@/src/shared/QueryProvider"
import AppSidebarContent from "@/src/template/sidebar/AppSidebarContent"
import { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "sidebar",
  component: AppSidebarContent,
  decorators: [
    (Story) => (
      <MSWProvider>
        <QueryProvider>
          <SidebarProvider>
            <Story />
          </SidebarProvider>
        </QueryProvider>
      </MSWProvider>
    ),
  ],
} satisfies Meta

export default meta

type Story = StoryObj<typeof AppSidebarContent>
export const Default: Story = {
  parameters: {
    msw: { handlers: handlers },
  },
}
