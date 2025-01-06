"use client"
import { Button } from "@/src/shadcn/components/ui/button"
import { useState } from "react"
import { DeckCreateFormDialog } from "@/src/deck/DeckCreateFormDialog"

export default function DeckCreateButton() {
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <>
      <Button onClick={() => setOpenDialog(true)}>덱 생성</Button>
      <DeckCreateFormDialog open={openDialog} onOpenChangeFn={setOpenDialog} />
    </>
  )
}
