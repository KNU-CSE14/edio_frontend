"use client"

import SidebarDeckMenu from "@/src/template/sidebar/SidebarDeckMenu"
import { Folder, getAllFolders } from "@/src/folder/api"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/src/shadcn/components/ui/collapsible"
import { ScrollArea } from "@/src/shadcn/components/ui/scroll-area"
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/src/shadcn/components/ui/sidebar"
import SvgFolder from "@/src/shared/icons/SvgFolder"
import { useQuery } from "@tanstack/react-query"
import { ChevronRight } from "lucide-react"
import { useState } from "react"

export default function AppSidebarContent() {
  const { data } = useQuery(getAllFolders())
  const decks = data?.decks
  const folders = data?.subFolders
  const [expandedFolders, setExpandedFolders] = useState<{
    [key: string]: boolean
  }>(JSON.parse(window.localStorage.getItem("expandedFolders") ?? "{}"))

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
            {folder.decks.map((deck) => (
              <SidebarDeckMenu
                key={`deck-${deck.id}`}
                deck={deck}
              ></SidebarDeckMenu>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <SidebarContent>
      <ScrollArea type="auto">
        <SidebarMenu>
          <SidebarMenuItem className="max-w-full px-1">
            {folders?.map(generateFolderMenu)}
            <SidebarMenu>
              {decks?.map((deck) => (
                <SidebarDeckMenu key={deck.id} deck={deck}></SidebarDeckMenu>
              ))}
            </SidebarMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </ScrollArea>
    </SidebarContent>
  )
}
