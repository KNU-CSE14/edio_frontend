import EditCards from "@/src/card/edit/EditCards"
import { getDeckDetail } from "@/src/deck/api"
import { getQueryClient } from "@/src/shared/get-query-client"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

export default async function page({ params }: { params: { id: number } }) {
  const queryClient = getQueryClient()
  try {
    await queryClient.fetchQuery({
      ...getDeckDetail(params.id),
      staleTime: 1000,
    })
  } catch (err) {
    /// TODO: handle error
  }
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditCards />
    </HydrationBoundary>
  )
}
