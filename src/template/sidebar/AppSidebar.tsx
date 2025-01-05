import { getAccount } from "@/src/account/api"
import LoginButton from "@/src/account/auth/LoginButton"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/src/shadcn/components/ui/sidebar"
import { getQueryClient } from "@/src/shared/get-query-client"
import AppSidebarHeader from "@/src/template/sidebar/AppSidebarHeader"
import { HydrationBoundary, dehydrate } from "@tanstack/react-query"
import { cookies } from "next/headers"

export default async function AppSidebar() {
  const queryClient = getQueryClient()
  let footerContent = <LoginButton />

  if (cookies().get("accessToken")) {
    try {
      await queryClient.fetchQuery(getAccount())
      footerContent = <div>TODO: user profile component</div>
    } catch (err) {
      footerContent = <LoginButton />
    }
  }
  console.log('tset')
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Sidebar>
        <SidebarHeader className="p-0">
          <AppSidebarHeader />
        </SidebarHeader>
        <SidebarContent />
        <SidebarFooter>{footerContent}</SidebarFooter>
      </Sidebar>
    </HydrationBoundary>
  )
}
