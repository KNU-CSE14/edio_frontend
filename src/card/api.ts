import { formFetch } from "@/src/shared/util/data/fetcher"

export const CARDS = "/api/cards"

export async function updateCards(
  data: CardForEditRequest[],
): Promise<Response> {
  const formData = new FormData()
  for (const [index, card] of data.entries()) {
    for (let [key, value] of Object.entries(card)) {
      formData.append(`requests[${index}].${key}`, value)
    }
  }
  return formFetch(CARDS, formData, {
    method: "POST",
  })
}

export async function deleteCards(parameter: {
  deckId: number
  cardIds: string[]
}): Promise<Response> {
  return formFetch(CARDS, JSON.stringify(parameter), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })
}

export async function mutateCards({
  edited,
  deleted,
}: {
  edited: CardForEditRequest[]
  deleted: Parameters<typeof deleteCards>[0]
}): Promise<void> {
  await Promise.all([
    edited.length ? updateCards(edited) : Promise.resolve(),
    deleted.cardIds ? deleteCards(deleted) : Promise.resolve(),
  ])
}
