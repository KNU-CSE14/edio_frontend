"use client"

import { Deck } from "@/src/deck/api"
import { Folder, getAllFolders } from "@/src/folder/api"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/src/shadcn/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/shadcn/components/ui/dropdown-menu"
import { ScrollArea } from "@/src/shadcn/components/ui/scroll-area"
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/src/shadcn/components/ui/sidebar"
import SvgDeck from "@/src/shared/icons/SvgDeck"
import SvgFolder from "@/src/shared/icons/SvgFolder"
import { useQuery } from "@tanstack/react-query"
import { ChevronRight, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function AppSidebarContent() {
  const { data } = useQuery(getAllFolders())
  const decks = data?.decks
  const folders = data?.subFolders
  const [expandedFolders, setExpandedFolders] = useState<{
    [key: string]: boolean
  }>(JSON.parse(window.localStorage.getItem("expandedFolders") ?? "{}"))
  if (!data) return <div>loading...</div>

  const generateFolderMenu = (folder: Folder) => {
    const isExpanded = !!expandedFolders[folder.id]
    return (
      <Collapsible open={isExpanded} key={`folder-${folder.id}`}>
        <CollapsibleTrigger
          className="flex items-center justify-start"
          asChild
          onClick={() => {
            const nextExpanded = {
              ...expandedFolders,
              [folder.id]: !isExpanded,
            }
            setExpandedFolders(nextExpanded)
            window.localStorage.setItem(
              "expandedFolders",
              JSON.stringify(nextExpanded),
            )
          }}
        >
          <SidebarMenuButton>
            <ChevronRight
              className={`transition-transform ${isExpanded ? "rotate-90" : ""}`}
            />
            <SvgFolder />
            <span>{folder?.name}</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="mr-0 pr-0">
            {folder?.subFolders.map(generateFolderMenu)}
          </SidebarMenuSub>
          <SidebarMenuSub className="mr-0 pr-0">
            {folder.decks.map(generateDeckMenu)}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    )
  }

  const generateDeckMenu = (deck: Deck) => (
    <SidebarMenuItem key={`deck-${deck.id}`}>
      <SidebarMenuButton asChild className="truncate w-full ">
        <Link href={`/deck/${deck.id}/study`}>
          <SvgDeck />
          <span>{deck.name}</span>
        </Link>
      </SidebarMenuButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction>
            <MoreHorizontal />
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          <DropdownMenuItem>
            {/* TODO */}
            <span>Edit Deck</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/cards/${deck.id}/edit`}>
              <span>Edit Cards</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )

  return (
    <SidebarContent>
      <ScrollArea type="auto">
        <SidebarMenu>
          <SidebarMenuItem className="max-w-full px-1">
            {folders?.map(generateFolderMenu)}
            <SidebarMenu>{decks?.map(generateDeckMenu)}</SidebarMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </ScrollArea>
    </SidebarContent>
  )
}
