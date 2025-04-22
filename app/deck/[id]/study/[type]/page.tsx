import { getDeckDetail, StudyType } from "@/src/deck/api"
import StudyPage from "@/src/deck/study/StudyPage"
import { getQueryClient } from "@/src/shared/get-query-client"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
type StudyPageProps = { id: number; type: StudyType }

export default async function page(params: StudyPageProps) {
  const queryClient = getQueryClient()
  try {
    await queryClient.fetchQuery(getDeckDetail(params.id))
  } catch (err) {
    /// TODO: handle error
  }
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StudyPage />
    </HydrationBoundary>
  )
}
