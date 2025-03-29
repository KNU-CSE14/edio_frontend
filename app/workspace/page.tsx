import { Metadata } from "next"
import FolderDetailContainer from "@/src/folder/FolderDetailContainer"
import { Button } from "@/src/shadcn/components/ui/button"
import { Search } from "lucide-react"
import DeckSearchDialog from "@/src/deck/DeckSearchDialog"

export const metadata: Metadata = {
  title: "워크스페이스",
  description: "워크스페이스",
}
export default function WorkspacePage() {
  return (
    <main className="container mx-auto px-14 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-700">내 워크스페이스</h2>
        <DeckSearchDialog>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            <span>검색</span>
          </Button>
        </DeckSearchDialog>
      </div>
      <FolderDetailContainer />
    </main>
  )
}
