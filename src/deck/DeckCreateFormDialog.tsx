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
import { ChangeEvent, useRef, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getCategories } from "@/src/category/api"
import { getFoldersAllKey, getMyDirectories } from "@/src/folder/api"
import { createNewDeck, queryKey } from "@/src/deck/api"
import { getQueryClient } from "@/src/shared/get-query-client"
import { Upload, X } from "lucide-react"
import { ToastAction } from "@/src/shadcn/components/ui/toast"
import { toast } from "@/src/shadcn/hooks/use-toast"
import Link from "next/link"

export function DeckCreateFormDialog({
  open,
  onOpenChangeFn,
}: DeckCreateFormDialogProps) {
  const { data: categories = [] } = useQuery(getCategories())
  const { data: directories = [] } = useQuery(getMyDirectories())

  const [deckTitle, setDeckTitle] = useState("")
  const [deckDescription, setDeckDescription] = useState("")
  const [selectCategoryId, setSelectCategory] = useState(
    categories.length > 0 ? categories[0].id : 0,
  )
  const [selectDirectoryId, setSelectDirectory] = useState(
    directories.length > 0 ? directories[0].id : 0,
  )
  const [file, setFile] = useState<File | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const createDeckMutation = useMutation({
    mutationKey: queryKey,
    mutationFn: createNewDeck,
    onSuccess: (variables) => {
      console.log(`New deck create Success, var = ${JSON.stringify(variables)}`)
      getQueryClient().invalidateQueries({ queryKey: getFoldersAllKey })
      removeFile()
      onOpenChangeFn(false)
      toast({
        title: `${deckTitle} Deck created!`,
        action: (
          <ToastAction altText="Try again" asChild>
            <Link href={`/deck/${variables.id}/edit`}>Add card</Link>
          </ToastAction>
        ),
      })
    },
    onError: (error) => {
      console.log(`Failed create deck, cause = ${error}`)
      window.alert(error.message)
    },
  })

  const handleOpenDialog = (isOpen: boolean) => {
    clearState()
    onOpenChangeFn(isOpen)
  }

  const handleChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0])
    }
  }

  const removeFile = () => {
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const clearState = () => {
    removeFile()
    setDeckTitle("")
    setDeckDescription("")
    setSelectDirectory(0)
    setSelectCategory(0)
  }

  const submitCreateDeck = () => {
    createDeckMutation.mutate({
      request: {
        folderId: selectDirectoryId,
        categoryId: selectCategoryId,
        name: deckTitle,
        description: deckDescription,
        isShared: false,
      },
      file: file,
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenDialog}>
      <DialogContent className="sm:max-w-[500px] w-[95%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            덱 생성하기
          </DialogTitle>
        </DialogHeader>
        <form className="grid gap-4 py-2 sm:gap-6 sm:py-4">
          <div className="grid gap-2">
            <Label htmlFor="folder">폴더</Label>
            <Select
              onValueChange={(value) =>
                setSelectDirectory(Number.parseInt(value))
              }
            >
              <SelectTrigger id="folder" className="min-h-[44px]">
                <SelectValue placeholder="선택" />
              </SelectTrigger>
              <SelectContent>
                {directories.map((directory) => (
                  <SelectItem
                    key={directory.id}
                    value={directory.id.toString()}
                  >
                    {directory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">카테고리 (Category)</Label>
            <Select
              onValueChange={(value) =>
                setSelectCategory(Number.parseInt(value))
              }
            >
              <SelectTrigger id="category" className="min-h-[44px]">
                <SelectValue placeholder="선택" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
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
          <div className="grid gap-2">
            <Label htmlFor="file-upload">배경 이미지</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleChangeFile}
                className="hidden"
                ref={fileInputRef}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                파일 선택
              </Button>
              {file && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={removeFile}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            {file && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">{file.name}</p>
                {file.type.startsWith("image/") && (
                  <img
                    src={URL.createObjectURL(file) || "/placeholder.svg"}
                    alt="Preview"
                    className="mt-2 max-w-full h-auto max-h-[200px] rounded-md"
                  />
                )}
              </div>
            )}
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
              onClick={() => {
                clearState()
                onOpenChangeFn(false)
              }}
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
