import { queryOptions } from "@tanstack/react-query"
import { getFetch } from "@/src/shared/util/data/fetcher"

export const GET_MY_DIRECTORIES = "/api/my-folders/"
export type Directory = {
  id: string
  name: string
}

export const queryKey = [GET_MY_DIRECTORIES]

export function getMyDirectories() {
  return queryOptions({
    queryKey,
    queryFn: (): Promise<Directory[]> => getFetch(GET_MY_DIRECTORIES),
  })
}
