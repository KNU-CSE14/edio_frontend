import { getQueryClient } from "@/src/shared/get-query-client"
import { DeckDetail, getDeckDetail } from "@/src/deck/api"
import DeckUpdateButton from "@/src/deck/DeckUpdateButton"

export default async function page({ params }: { params: { id: number } }) {
  const queryClient = getQueryClient()
  let deckDetail: DeckDetail | undefined = undefined
  try {
    deckDetail = await queryClient.fetchQuery(getDeckDetail(params.id))
  } catch (err) {
    /// TODO: handle error
  }
  return (
    <>
      {deckDetail !== undefined && <DeckUpdateButton deck={deckDetail} />}
      <div>TODO: 덱 학습하기 화면 {params.id} </div>
    </>
  )
}
