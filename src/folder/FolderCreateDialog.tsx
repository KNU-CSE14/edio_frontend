"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/shadcn/components/ui/dialog"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createFolder,
  getFlatFolders,
  getFoldersAllKey,
} from "@/src/folder/api"
import { toast } from "@/src/shadcn/hooks/use-toast"
import { useForm } from "react-hook-form"
import { DialogProps } from "@radix-ui/react-dialog"
import FolderEditor from "@/src/folder/FolderEditor"

type FolderCreateDialogProps = {
  children?: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
} & DialogProps
export default function FolderCreateDialog({
  children,
  open,
  onOpenChange,
}: FolderCreateDialogProps) {
  const mode = "생성"
  const { data: folders } = useQuery({
    ...getFlatFolders(),
  })
  const form = useForm<{
    name: string
    parentId: number
  }>({
    defaultValues: {
      name: "",
      parentId: folders?.[0].id,
    },
    mode: "all",
  })
  const queryClient = useQueryClient()

  const createFolderMutation = useMutation({
    mutationFn: createFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getFoldersAllKey })
      toast({
        title: `${form.getValues().name} 폴더가 생성되었습니다.`,
      })
      onOpenChange(false)
    },
    onError: (error) => {
      console.error(`폴더 생성 실패: ${error}`)
      toast({
        title: "폴더 생성에 실패했습니다.",
        variant: "destructive",
      })
    },
  })

  const handleSubmit = form.handleSubmit(() => {
    if (!form.getValues().name.trim()) {
      toast({
        title: "폴더 이름을 입력해주세요.",
        variant: "destructive",
      })
      return
    }
    createFolderMutation.mutate({
      name: form.getValues().name,
      parentId: form.getValues().parentId,
    })
  })
  if (folders === undefined) return <></>
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>폴더 생성하기</DialogTitle>
        </DialogHeader>
        <FolderEditor
          form={form}
          onOpenChange={onOpenChange}
          handleSubmit={handleSubmit}
          folders={folders}
          isPending={createFolderMutation.isPending}
          mode={mode}
        />
      </DialogContent>
    </Dialog>
  )
}
