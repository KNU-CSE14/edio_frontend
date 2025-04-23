import { getDeckDetail, StudyType } from "@/src/deck/api"
import StudyPage from "@/src/deck/study/StudyPage"
import { getQueryClient } from "@/src/shared/get-query-client"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
export default async function page({
  params,
}: {
  params: { id: number; type: StudyType }
}) {
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
      <StudyPage />
    </HydrationBoundary>
  )
}
