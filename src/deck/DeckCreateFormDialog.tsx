"use client"

import { Button } from "@/src/shadcn/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/shadcn/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shadcn/components/ui/select"
import { Input } from "@/src/shadcn/components/ui/input"
import { Textarea } from "@/src/shadcn/components/ui/textarea"
import { Label } from "@/src/shadcn/components/ui/label"

export function DeckCreateFormDialog({
  open,
  onOpenChangeFn,
}: DeckCreateFormDialogProps) {
  const submitCreateDeck = () => {
    // TODO API 연동하기
    console.log("Created Deck!")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeFn}>
      <DialogContent className="sm:max-w-[500px] w-[95%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            덱 생성하기
          </DialogTitle>
        </DialogHeader>
        <form className="grid gap-4 py-2 sm:gap-6 sm:py-4">
          <div className="grid gap-2">
            <Label htmlFor="folder">폴더</Label>
            <Select>
              <SelectTrigger id="folder" className="min-h-[44px]">
                <SelectValue placeholder="기본" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">기본</SelectItem>
                <SelectItem value="custom">사용자 정의</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">카테고리 (Category)</Label>
            <Select defaultValue="english">
              <SelectTrigger id="category" className="min-h-[44px]">
                <SelectValue placeholder="영어 (English)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">영어 (English)</SelectItem>
                <SelectItem value="korean">한국어 (Korean)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="title">제목 (Title)</Label>
            <Input
              id="title"
              placeholder="EX) 기초 영어 단어"
              className="min-h-[44px]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">설명 (Description)</Label>
            <Textarea
              id="description"
              placeholder="EX) 기초 영어 단어 500개 공부"
              rows={4}
              className="min-h-[44px]"
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Button
              type="button"
              className="w-full sm:w-24"
              onClick={submitCreateDeck}
            >
              생성
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="w-full sm:w-24"
              onClick={() => onOpenChangeFn(false)}
            >
              취소
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface DeckCreateFormDialogProps {
  open: boolean
  onOpenChangeFn: (open: boolean) => void
}
