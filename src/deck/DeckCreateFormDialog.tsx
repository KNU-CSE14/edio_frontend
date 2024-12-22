"use client"

import { Button } from "@/src/shadcn/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/shadcn/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shadcn/components/ui/select"
import { Input } from "@/src/shadcn/components/ui/input"
import { Textarea } from "@/src/shadcn/components/ui/textarea"
import { Label } from "@/src/shadcn/components/ui/label"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getCategories } from "@/src/category/api"
import { getMyDirectories } from "@/src/folder/api"

export function DeckCreateFormDialog({
  open,
  onOpenChangeFn,
}: DeckCreateFormDialogProps) {
  const categories = useQuery(getCategories()).data ?? []
  const directories = useQuery(getMyDirectories()).data ?? []

  const [deckTitle, setDeckTitle] = useState("")
  const [deckDescription, setDeckDescription] = useState("")
  const [selectCategoryId, setSelectCategory] = useState(
    categories.length > 0 ? categories[0].id : "",
  )
  const [selectDirectoryId, setSelectDirectory] = useState(
    directories.length > 0 ? directories[0].id : "",
  )

  const submitCreateDeck = () => {
    // TODO API 연동하기
    console.log(
      `Created Deck! title = ${deckTitle}, desc = ${deckDescription}, directoryId = ${selectDirectoryId}, categoryId = ${selectCategoryId}`,
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeFn}>
      <DialogContent className="sm:max-w-[500px] w-[95%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            덱 생성하기
          </DialogTitle>
        </DialogHeader>
        <form className="grid gap-4 py-2 sm:gap-6 sm:py-4">
          <div className="grid gap-2">
            <Label htmlFor="folder">폴더</Label>
            <Select onValueChange={setSelectDirectory}>
              <SelectTrigger id="folder" className="min-h-[44px]">
                <SelectValue placeholder={directories[0]?.name} />
              </SelectTrigger>
              <SelectContent>
                {directories.map((directory) => (
                  <SelectItem key={directory.id} value={directory.id}>
                    {directory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">카테고리 (Category)</Label>
            <Select onValueChange={setSelectCategory}>
              <SelectTrigger id="category" className="min-h-[44px]">
                <SelectValue placeholder={categories[0]?.name} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="title">제목 (Title)</Label>
            <Input
              id="title"
              placeholder="EX) 기초 영어 단어"
              className="min-h-[44px]"
              value={deckTitle}
              onChange={(event) => setDeckTitle(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">설명 (Description)</Label>
            <Textarea
              id="description"
              placeholder="EX) 기초 영어 단어 500개 공부"
              rows={4}
              className="min-h-[44px]"
              content={deckDescription}
              onChange={(e) => setDeckDescription(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Button
              type="button"
              className="w-full sm:w-24"
              onClick={submitCreateDeck}
            >
              생성
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="w-full sm:w-24"
              onClick={() => onOpenChangeFn(false)}
            >
              취소
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface DeckCreateFormDialogProps {
  open: boolean
  onOpenChangeFn: (open: boolean) => void
}
