"use client"
import { Button } from "@/src/shadcn/components/ui/button"
import { useState } from "react"
import { DeckEditFormDialog } from "@/src/deck/DeckEditFormDialog"
import { Deck } from "@/src/deck/api"

export default function DeckUpdateButton({ deck }: DeckUpdateButtonProps) {
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <>
      <Button onClick={() => setOpenDialog(true)}>덱 수정</Button>
      <DeckEditFormDialog
        deck={deck}
        open={openDialog}
        onOpenChangeFn={setOpenDialog}
      />
    </>
  )
}

interface DeckUpdateButtonProps {
  deck: Deck
}
