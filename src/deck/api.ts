import { postFetch } from "@/src/shared/util/data/fetcher"

export const REQ_DECK = "/api/deck"
export type DeckCreateReq = {
  folderId: number
  categoryId: number
  name: string
  description?: string
  isShared: boolean
}
export type Deck = {
  id: number
  name: string
  description: string
  isShared: boolean
  isFavorite: boolean
}

export const queryKey = [REQ_DECK]

export function createNewDeck(createRequest: DeckCreateReq): Promise<void> {
  const formData = new FormData()
  formData.append("deck", JSON.stringify(createRequest))
  return postFetch(REQ_DECK, formData)
}
