import { getQueryClient } from "@/src/shared/get-query-client"
import { DeckDetail, getDeckDetail } from "@/src/deck/api"
import StudyPage from "@/src/deck/study/StudyPage"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

export default async function page({ params }: { params: { id: number } }) {
  const queryClient = getQueryClient()
  let deckDetail: DeckDetail | undefined = undefined
  try {
    deckDetail = await queryClient.fetchQuery(getDeckDetail(params.id))
  } catch (err) {
    /// TODO: handle error
  }
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StudyPage />
    </HydrationBoundary>
  )
}
