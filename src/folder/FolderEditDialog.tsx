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
  Folder,
  getFlatFolders,
  getFoldersAllKey,
  mutateFolder,
} from "@/src/folder/api"
import { DialogProps } from "@radix-ui/react-dialog"
import { useForm } from "react-hook-form"
import FolderEditor from "@/src/folder/FolderEditor"
import { toast } from "@/src/shadcn/hooks/use-toast"
type FolderEditDialogProps = {
  children?: React.ReactNode
  folder: Folder
  open: boolean
  onOpenChange: (open: boolean) => void
} & DialogProps

export default function FolderEditDialog({
  children,
  folder,
  open,
  onOpenChange,
}: FolderEditDialogProps) {
  const mode = "수정"
  const { data: folders } = useQuery({
    ...getFlatFolders(),
  })

  const form = useForm<{
    name: string
    parentId: number
  }>({
    defaultValues: {
      name: folder.name,
      parentId: folder.parentId,
    },
    mode: "all",
  })
  const queryClient = useQueryClient()
  const editFolderMutation = useMutation({
    mutationFn: mutateFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getFoldersAllKey })
      toast({
        title: `${form.getValues().name} 폴더가 수정되었습니다.`,
      })
      onOpenChange(false)
    },
  })
  const handleSubmit = form.handleSubmit((data) => {
    if (!data.name.trim()) {
      toast({
        title: "폴더 이름을 입력해주세요.",
        variant: "destructive",
      })
      return
    }
    if (
      form.formState.dirtyFields.name ||
      form.formState.dirtyFields.parentId
    ) {
      return editFolderMutation.mutate({
        id: folder.id,
        name: form.formState.dirtyFields.name ? data.name : undefined,
        moveTo: form.formState.dirtyFields.parentId ? data.parentId : undefined,
      })
    }
    toast({
      title: "변경된 내용이 없습니다.",
      variant: "destructive",
    })
  })
  if (folders === undefined) return <></>

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{`폴더 ${mode}하기`}</DialogTitle>
        </DialogHeader>
        <FolderEditor
          form={form}
          onOpenChange={onOpenChange}
          handleSubmit={handleSubmit}
          folders={folders}
          isPending={false}
          mode={mode}
        />
      </DialogContent>
    </Dialog>
  )
}
