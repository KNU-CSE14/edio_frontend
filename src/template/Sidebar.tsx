import { getAccount } from "@/src/account/api"
import LoginButton from "@/src/account/auth/LoginButton"
import { getQueryClient } from "@/src/shared/get-query-client"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { cookies } from "next/headers"

/// TODO: 스타일 적용
export default async function Sidebar() {
  const queryClient = getQueryClient()
  const login = (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LoginButton></LoginButton>
    </HydrationBoundary>
  )
  if (cookies().get("accessToken")) {
    try {
      await queryClient.fetchQuery(getAccount())
      return (
        <HydrationBoundary state={dehydrate(queryClient)}>
          <div>TODO: user profile component</div>
        </HydrationBoundary>
      )
    } catch (err) {
      return login
    }
  }
  return login
}
