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
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/src/shadcn/components/ui/sidebar"
import SvgFolder from "@/src/shared/icons/SvgFolder"
import { useQuery } from "@tanstack/react-query"
import useLocalStorage from "@/src/shared/hooks/useLocalStorage"
import { ChevronRight, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/shadcn/components/ui/dropdown-menu"
import FolderDeleteDialog from "@/src/folder/FolderDeleteDialog"
import { overlay } from "overlay-kit"
import FolderEditDialog from "@/src/folder/FolderEditDialog"

export default function AppSidebarContent() {
  const { data } = useQuery(getAllFolders())
  const decks = data?.decks
  const folders = data?.subFolders
  const [expandedFolders, setExpandedFolders] = useLocalStorage<{
    [key: string]: boolean
  }>("expandedFolders", {})
  const generateFolderMenu = (folder: Folder) => {
    const isExpanded = !!expandedFolders[folder.id]
    const hasSubFolder = !!folder?.subFolders.length
    const hasDecks = !!folder?.decks.length
    return (
      <Collapsible open={isExpanded} key={`folder-${folder.id}`}>
        <CollapsibleTrigger
          className="flex items-center justify-start"
          asChild
          onClick={() => {
            setExpandedFolders((prev) => ({
              ...prev,
              [folder.id]: !isExpanded,
            }))
          }}
        >
          <SidebarMenuItem className="truncate w-full max-w">
            <SidebarMenuButton>
              <ChevronRight
                className={`transition-transform ${isExpanded ? "rotate-90" : ""}`}
              />
              <SvgFolder />
              <span>{folder?.name}</span>
            </SidebarMenuButton>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <SidebarMenuAction>
                  <MoreHorizontal />
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start">
                <DropdownMenuItem
                  onClick={(e) => e.stopPropagation()}
                  onSelect={() => {
                    overlay.open(({ close, isOpen }) => (
                      <FolderDeleteDialog
                        open={isOpen}
                        onOpenChange={close}
                        folderId={folder.id}
                      />
                    ))
                  }}
                  asChild
                >
                  <span>Delete Deck</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => e.stopPropagation()}
                  onSelect={() => {
                    overlay.open(({ close, isOpen }) => {
                      return (
                        <FolderEditDialog
                          key={`folder-${folder.id}-modal`}
                          open={isOpen}
                          folder={folder}
                          onOpenChange={close}
                        ></FolderEditDialog>
                      )
                    })
                  }}
                  asChild
                >
                  <span>Edit Folder</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {hasSubFolder && (
            <>
              <div className="w-[1px]" />
              <SidebarMenuSub className="mr-0 mb-0 pb-0 pr-0 translate-x-0">
                {folder?.subFolders.map(generateFolderMenu)}
              </SidebarMenuSub>
            </>
          )}
          {hasDecks && (
            <SidebarMenuSub className="mr-0 mb-0 pb-0 pr-0 translate-x-0">
              {folder.decks.map((deck) => (
                <SidebarDeckMenu
                  key={`deck-${deck.id}`}
                  deck={deck}
                ></SidebarDeckMenu>
              ))}
            </SidebarMenuSub>
          )}
        </CollapsibleContent>
      </Collapsible>
    )
  }
  return (
    <SidebarContent>
      <ScrollArea
        className="max-w-full w-full min-w-0 [&>[data-radix-scroll-area-viewport]>div]:!block"
        type="auto"
      >
        <SidebarMenu className="max-w-full pr-2">
          {folders?.map(generateFolderMenu)}
          <SidebarMenu>
            {decks?.map((deck) => (
              <SidebarDeckMenu key={deck.id} deck={deck}></SidebarDeckMenu>
            ))}
          </SidebarMenu>
        </SidebarMenu>
      </ScrollArea>
    </SidebarContent>
  )
}
