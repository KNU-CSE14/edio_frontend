"use client"
import { Button } from "@/src/shadcn/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/shadcn/components/ui/tooltip"
import SvgAddChat from "@/src/shared/icons/SvgAddChat"
import SvgAddDeck from "@/src/shared/icons/SvgAddDeck"
import SvgAddFolder from "@/src/shared/icons/SvgAddFolder"
import SvgCommunity from "@/src/shared/icons/SvgCommunity"
import SvgHome from "@/src/shared/icons/SvgHome"
import SvgSearch from "@/src/shared/icons/SvgSearch"
import SvgWorkspace from "@/src/shared/icons/SvgWorkspace"
import { DeckEditFormDialog } from "@/src/deck/DeckEditFormDialog"
import { useRouter } from "next/navigation"
import DeckSearchDialog from "@/src/deck/DeckSearchDialog"

export default function AppSidebarHeader() {
  const router = useRouter()
  const goWorkspace = (): void => {
    router.push("/workspace")
  }

  return (
    <div>
      <div className="text-2xl px-4 py-3">EDIO</div>
      <section className="flex items-center justify-between p-2 px-5 border-b-2 border-t-2 [&_svg]:size-5">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <DeckSearchDialog>
              <TooltipTrigger asChild>
                <Button variant={"ghost"} size={"icon"}>
                  <SvgSearch />
                </Button>
              </TooltipTrigger>
            </DeckSearchDialog>
            <TooltipContent side="bottom">Search</TooltipContent>
          </Tooltip>
          <Tooltip>
            <DeckEditFormDialog>
              <TooltipTrigger asChild>
                <Button variant={"ghost"} size={"icon"}>
                  <SvgAddDeck />
                </Button>
              </TooltipTrigger>
            </DeckEditFormDialog>
            <TooltipContent side="bottom">Add Deck</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={"ghost"} size={"icon"}>
                <SvgAddFolder />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Add Folder</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={"ghost"} size={"icon"}>
                <SvgAddChat />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Add Chat</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </section>
      <section className="flex flex-col p-2 border-b-2 [&_svg]:size-5 [&_button]:justify-start">
        <Button variant={"ghost"}>
          <SvgHome /> Home
        </Button>
        <Button variant={"ghost"} onClick={() => goWorkspace()}>
          <SvgWorkspace /> Workspace
        </Button>
        <Button variant={"ghost"}>
          <SvgCommunity /> Community
        </Button>
      </section>
    </div>
  )
}
