import { queryOptions } from "@tanstack/react-query"
import { Deck } from "@/src/deck/api"
import { getFetch } from "@/src/shared/util/data/fetcher"

export const GET_MY_DIRECTORIES = "/api/folder/my-folders"
export const GET_FOLDERS_ALL = "/api/folder/all"

export type FolderMeta = {
  id: number
  name: string
}

export type Folder = FolderMeta & {
  subFolders: Folder[]
  decks: Deck[]
}

export const queryKey = [GET_MY_DIRECTORIES]

export function getMyDirectories() {
  return queryOptions({
    queryKey,
    queryFn: (): Promise<FolderMeta[]> => getFetch(GET_MY_DIRECTORIES),
  })
}

export const getFoldersAllKey = [GET_FOLDERS_ALL]
export function getAllFolders() {
  return queryOptions({
    queryKey: getFoldersAllKey,
    queryFn: (): Promise<Folder> => getFetch(GET_FOLDERS_ALL),
    staleTime: Infinity,
  })
}
