"use client"
import { Button } from "@/src/shadcn/components/ui/button"
import { useState } from "react"
import { DeckEditFormDialog } from "@/src/deck/DeckEditFormDialog"

export default function DeckCreateButton() {
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <>
      <Button onClick={() => setOpenDialog(true)}>덱 생성</Button>
      <DeckEditFormDialog open={openDialog} onOpenChangeFn={setOpenDialog} />
    </>
  )
}
