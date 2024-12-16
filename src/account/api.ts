import { getFetch } from "@/src/shared/util/data/fetcher"
import { queryOptions } from "@tanstack/react-query"

export const GET_ACCOUNT = "/api/account"
export type User = {
  id: string
  rootFolderId: string
  roles: string
  memberResponse: {
    id: string
    email: string
    name: string
    profileUrl: string
  }
}
export const queryKey = [GET_ACCOUNT]
export function getAccount() {
  return queryOptions({
    queryKey,
    queryFn: (): Promise<User> => getFetch(GET_ACCOUNT),
  })
}
