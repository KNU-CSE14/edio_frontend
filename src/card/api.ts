import { postFetch } from "@/src/shared/util/data/fetcher"

export const POST_CARDS = "/api/cards"

export async function updateCards(data: CardForEditRequest[]): Promise<void> {
  const formData = new FormData()
  for (const [index, card] of data.entries()) {
    for (let [key, value] of Object.entries(card)) {
      formData.append(`requests[${index}].${key}`, value)
    }
  }
  return postFetch(POST_CARDS, formData)
}
