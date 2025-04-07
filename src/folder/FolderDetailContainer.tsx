"use client"

import { Folder, getAllFolders } from "@/src/folder/api"
import FolderDetailCarousel from "@/src/folder/FolderDetailCarousel"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"

export default function FolderDetailContainer() {
  const { data } = useQuery(getAllFolders())
  const [displayFolders, setDisplayFolders] = useState<Folder[]>([])

  // 하위 폴더 내 데이터들을 flat 하게 펼치기 위한 구성
  useEffect(() => {
    const flatFolders = (folders: Folder[], flattedFolders: Folder[]): void => {
      folders.forEach((folder) => {
        flattedFolders.push(folder)
        if (folder.subFolders.length > 0) {
          let subFolders: Folder[] = folder.subFolders.map((sub) => {
            return {
              id: sub.id,
              name: `${folder.name} / ${sub.name}`,
              decks: sub.decks,
              subFolders: [],
            }
          })
          flatFolders(subFolders, flattedFolders)
        }
      })
    }

    let flattedFolders: Folder[] = []
    if (data !== undefined) {
      flattedFolders.push(data)
      flatFolders(data.subFolders, flattedFolders)
      setDisplayFolders(flattedFolders)
    }
  }, [data])

  return (
    <div className="relative overflow-x-hidden">
      {displayFolders.map((folderDetail) => (
        <FolderDetailCarousel
          key={folderDetail.id}
          folderDetail={folderDetail}
        />
      ))}
    </div>
  )
}
