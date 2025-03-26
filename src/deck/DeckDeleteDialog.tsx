"use client"

import { deleteDeck } from "@/src/deck/api"
import { getFoldersAllKey } from "@/src/folder/api"
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

export default function DeckDeleteDialog({
  children,
  deckId,
}: { deckId: number; children: React.ReactNode } & DialogProps) {
  const queryClient = useQueryClient()
  const route = useRouter()
  const deleteDeckMutation = useMutation({
    mutationFn: deleteDeck,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getFoldersAllKey })
      toast({
        title: "Deck deleted!",
      })
      route.push("/")
    },
    onError: () => {
      toast({
        title: "Failed delete deck",
        variant: "destructive",
      })
    },
  })
  const handleClick = () => {
    deleteDeckMutation.mutate(deckId)
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this deck? This action cannot be
            undone.
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
