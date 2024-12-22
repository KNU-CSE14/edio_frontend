import { queryOptions } from "@tanstack/react-query"
import { getFetch } from "@/src/shared/util/data/fetcher"

export const GET_CATEGORIES = "/api/category"
export type Category = {
  id: string
  createdAt: string
  updatedAt: string
  name: string
  deleted: boolean
}

export const queryKey = [GET_CATEGORIES]

export function getCategories() {
  return queryOptions({
    queryKey,
    queryFn: (): Promise<Category[]> => getFetch(GET_CATEGORIES),
  })
}
