"use client"

import { deleteFolder, getFoldersAllKey } from "@/src/folder/api"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/shadcn/components/ui/alert-dialog"
import { Button } from "@/src/shadcn/components/ui/button"
import { toast } from "@/src/shadcn/hooks/use-toast"
import { DialogProps } from "@radix-ui/react-dialog"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

export default function FolderDeleteDialog({
  children,
  folderId,
}: { folderId: number; children: React.ReactNode } & DialogProps) {
  const queryClient = useQueryClient()
  const route = useRouter()
  const deleteFolderMutation = useMutation({
    mutationFn: deleteFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getFoldersAllKey })
      toast({
        title: "Folder deleted!",
      })
      route.push("/")
    },
    onError: () => {
      toast({
        title: "Failed delete folder",
        variant: "destructive",
      })
    },
  })
  const handleClick = () => {
    deleteFolderMutation.mutate(folderId)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this folder? This action cannot be
            undone. This will permanently delete the folder and remove all of
            its decks.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={handleClick} variant={"destructive"}>
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
