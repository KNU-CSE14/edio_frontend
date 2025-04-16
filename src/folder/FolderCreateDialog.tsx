"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/shadcn/components/ui/dialog"
import { Button } from "@/src/shadcn/components/ui/button"
import { Input } from "@/src/shadcn/components/ui/input"
import { Label } from "@/src/shadcn/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shadcn/components/ui/select"
import { useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import {
  createFolder,
  getFlatFolders,
  getFoldersAllKey,
} from "@/src/folder/api"
import { getQueryClient } from "@/src/shared/get-query-client"
import { toast } from "@/src/shadcn/hooks/use-toast"

export default function FolderCreateDialog({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [folderName, setFolderName] = useState("")
  const [parentFolderId, setParentFolderId] = useState<number | null>(null)
  const { data } = useQuery({
    ...getFlatFolders(),
  })
  const [rootFolder, ...folders] = data ?? []
  const createFolderMutation = useMutation({
    mutationFn: createFolder,
    onSuccess: () => {
      getQueryClient().invalidateQueries({ queryKey: getFoldersAllKey })
      setOpen(false)
      toast({
        title: `${folderName} 폴더가 생성되었습니다.`,
      })
      setFolderName("")
      setParentFolderId(null)
    },
    onError: (error) => {
      console.error(`폴더 생성 실패: ${error}`)
      toast({
        title: "폴더 생성에 실패했습니다.",
        variant: "destructive",
      })
    },
  })

  const handleSubmit = () => {
    if (!folderName.trim()) {
      toast({
        title: "폴더 이름을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    createFolderMutation.mutate({
      name: folderName,
      parentId: parentFolderId ?? rootFolder.id,
    })
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setFolderName("")
      setParentFolderId(null)
    }
    setOpen(isOpen)
  }
  if (rootFolder === undefined) return <></>
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>폴더 생성하기</DialogTitle>
          {/* <DialogDescription>폴더 생성</DialogDescription> */}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">폴더 이름</Label>
            <Input
              id="name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="새 폴더 이름을 입력하세요"
              className="min-h-[44px]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="parent">상위 폴더</Label>
            <Select
              defaultValue={`${rootFolder.id}`}
              onValueChange={(value) => setParentFolderId(Number(value))}
              value={parentFolderId?.toString()}
            >
              <SelectTrigger id="parent" className="min-h-[44px]">
                <SelectValue placeholder="상위 폴더 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={`${rootFolder.id}`}>루트 폴더</SelectItem>
                {folders?.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id.toString()}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Button
            type="button"
            className="w-full sm:w-24"
            onClick={handleSubmit}
            disabled={createFolderMutation.isPending}
          >
            {createFolderMutation.isPending ? "생성 중..." : "생성"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-24"
            onClick={() => handleOpenChange(false)}
            disabled={createFolderMutation.isPending}
          >
            취소
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
