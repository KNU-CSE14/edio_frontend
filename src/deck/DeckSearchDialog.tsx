"use client"

import {ReactNode, useEffect, useRef, useState} from "react"
import {Deck} from "@/src/deck/api"
import {useRouter} from "next/navigation"
import {Folder} from "@/src/folder/api"
import {Dialog, DialogContent, DialogTrigger} from "@radix-ui/react-dialog"
import {Search, X} from "lucide-react"
import {Input} from "@/src/shadcn/components/ui/input"
import {Button} from "@/src/shadcn/components/ui/button"

/**
 * 덱 검색 모달
 */
export default function DeckSearchDialog({
  rootFolder,
  children,
}: DeckSearchDialogProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [targetDecks, setTargetDecks] = useState<Deck[]>([])
  const [searchResults, setSearchResults] = useState<Deck[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // 덱 검색을 위해 하위 덱들만 꺼내서 세팅
  useEffect(() => {
    const unpackDecks = (folder: Folder): Deck[] => {
      let decks: Deck[] = folder.decks

      if (folder.subFolders.length > 0) {
        folder.subFolders.forEach((subFolder) => {
          decks.concat(unpackDecks(subFolder))
        })
      }

      return decks
    }
    setTargetDecks(unpackDecks(rootFolder))
  }, [rootFolder])

  // 모달 창 활성화 시 검색 바에 포커싱
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [open])

  // 검색 쿼리 변경 시마다 결과 값 업데이트
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const query = searchQuery.toLowerCase()
    console.log(`Search Query : ${query}`)
    const results: Deck[] = targetDecks.filter((target) =>
      target.name.includes(query),
    )
    setSearchResults(results)
  }, [searchQuery, targetDecks])

  const handleClickResultData = (deckId: number): void => {
    router.push(`/deck/${deckId}/study`)
  }

  const handleOpenChangeEvent = (isOpen: boolean): void => {
    setOpen(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChangeEvent}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0">
        <div className="p-4 border-b">
          <div className="flex items-center">
            <Search className="h-5 w-5 text-gray-400 mr-2" />
            <Input
              ref={inputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="덱 이름 검색..."
              className="border-none shadow-none focus-visible:ring-0 flex-1"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery("")}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        {searchResults.length > 0 && (
          <div className="max-h-[400px] overflow-y-auto p-2">
            <div className="text-sm text-gray-500 p-2">
              검색 결과 : {searchResults.length}개
            </div>
            <div className="space-y-2">
              {searchResults.map((result, index) => (
                <div
                  key={`${result.id}-${index}`}
                  className="p-3 hover:bg-gray-100 rounded-md cursor-pointer"
                  onClick={() => handleClickResultData(result.id)}
                >
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-sky-100 mr-3 flex items-center justify-center flex-shrink-0">
                      <span className="text-sky-500 font-medium">
                        {result.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 truncate">
                          {result.name}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {result.description.length > 100
                          ? `${result.description.substring(0, 100)}...`
                          : `${result.description}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

type DeckSearchDialogProps = {
  rootFolder: Folder
  children: ReactNode
}
