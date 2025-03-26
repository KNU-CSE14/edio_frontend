import { Deck } from "@/src/deck/api"
import DeckDeleteDialog from "@/src/deck/DeckDeleteDialog"
import { DeckEditFormDialog } from "@/src/deck/DeckEditFormDialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/shadcn/components/ui/dropdown-menu"
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/src/shadcn/components/ui/sidebar"
import SvgDeck from "@/src/shared/icons/SvgDeck"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { useRef } from "react"
type DialogType = "edit" | "delete"
export default function SidebarDeckMenu({ deck }: { deck: Deck }) {
  const dialogTriggerRef = useRef<Map<DialogType, HTMLElement | null>>(
    new Map(),
  )
  const getRef = (id: DialogType) => dialogTriggerRef.current?.get(id)
  const setRef = (id: DialogType) => (node: HTMLElement | null) => {
    dialogTriggerRef.current.set(id, node)
  }
  return (
    <SidebarMenuItem key={`deck-${deck.id}`}>
      <SidebarMenuButton asChild className="truncate w-full ">
        <Link href={`/deck/${deck.id}/study`}>
          <SvgDeck />
          <span>{deck.name}</span>
        </Link>
      </SidebarMenuButton>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction>
            <MoreHorizontal />
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          <DropdownMenuItem
            onSelect={() => {
              getRef("edit")?.click()
            }}
            asChild
          >
            <span>Edit Deck</span>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={`/cards/${deck.id}/edit`}>
              <span>Edit Cards</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              getRef("delete")?.click()
            }}
            asChild
          >
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeckEditFormDialog deck={deck}>
        <div className="hidden" ref={setRef("edit")}></div>
      </DeckEditFormDialog>
      <DeckDeleteDialog deckId={deck.id}>
        <div className="hiddem" ref={setRef("delete")}></div>
      </DeckDeleteDialog>
    </SidebarMenuItem>
  )
}
