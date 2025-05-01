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
  parentId?: number
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
    select: selectWithParentId,
    staleTime: Infinity,
  })
}
const selectWithParentId = (folder: Folder): Folder => ({
  ...folder,
  subFolders: folder.subFolders.map((subFolder) => ({
    parentId: folder.id,
    ...selectWithParentId(subFolder),
  })),
})

const flatFolders = (folders: Folder[]): Folder[] =>
  folders.flatMap(({ subFolders, ...folder }) => [
    { ...folder, subFolders: [] },
    ...flatFolders(subFolders),
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
export function renameFolder({
  id,
  parameter,
}: {
  id: number
  parameter: { name: string }
}): Promise<CreateFolderResponse> {
  return formFetch(CREATE_FOLDER, {
    pathVariable: `/${id}`,
    parameter: JSON.stringify(parameter),
    option: {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    },
  })
}
export function moveFolder({
  id,
  parameter,
}: {
  id: number
  parameter: { parentId: number }
}): Promise<CreateFolderResponse> {
  return formFetch(CREATE_FOLDER, {
    pathVariable: `/${id}/position`,
    parameter: JSON.stringify(parameter),
    option: {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    },
  })
}
export async function mutateFolder({
  id,
  name,
  moveTo,
}: {
  id: number
  name?: string
  moveTo?: number
}): Promise<void> {
  await Promise.all([
    name !== undefined
      ? renameFolder({ id, parameter: { name } })
      : Promise.resolve(),
    moveTo !== undefined
      ? moveFolder({ id, parameter: { parentId: moveTo } })
      : Promise.resolve(),
  ])
}

export function deleteFolder(id: number): Promise<void> {
  return formFetch(CREATE_FOLDER, {
    pathVariable: `/${id}`,
    option: {
      method: "DELETE",
    },
  })
}
