import { queryOptions } from "@tanstack/react-query"
import { Deck } from "@/src/deck/api"
import { formFetch, getFetch } from "@/src/shared/util/data/fetcher"

export const GET_MY_DIRECTORIES = "/api/folder/my-folders"
export const GET_FOLDERS_ALL = "/api/folder/all"
export const CREATE_FOLDER = "/api/folder"

export type FolderMeta = {
  id: number
  name: string
}

export type Folder = FolderMeta & {
  subFolders: Folder[]
  decks: Deck[]
}

export type CreateFolderRequest = {
  name: string
  parentId: number
}

export type CreateFolderResponse = {
  id: number
  name: string
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
const flatFolders = (folders: Folder[]): Folder[] =>
  folders.flatMap((folder) => [
    { ...folder },
    ...flatFolders(folder.subFolders),
  ])

export function getFlatFolders() {
  return queryOptions({
    ...getAllFolders(),
    select: (data) => [data, ...flatFolders(data.subFolders)],
  })
}

export function createFolder(
  request: CreateFolderRequest,
): Promise<CreateFolderResponse> {
  return formFetch(CREATE_FOLDER, {
    parameter: JSON.stringify(request),
    option: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
  })
}
