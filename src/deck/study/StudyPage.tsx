"use client"

import { DeckDetail, getDeckDetail, StudyType } from "@/src/deck/api"
import FlipCard from "@/src/deck/study/FlipCard"
import OverViewCard from "@/src/deck/study/OverviewCard"
import { Button } from "@/src/shadcn/components/ui/button"
import { Card, CardTitle } from "@/src/shadcn/components/ui/card"
import { ScrollArea, ScrollBar } from "@/src/shadcn/components/ui/scroll-area"
import { useSuspenseQuery } from "@tanstack/react-query"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { useState, MouseEvent } from "react"
const shuffleCards = (deck: DeckDetail): DeckDetail => {
  const cards = [...deck.cards]
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[cards[i], cards[j]] = [cards[j], cards[i]]
  }
  return { ...deck, cards }
}
export default function StudyPage() {
  const { type: studyType, ...params } = useParams<{
    id: string
    type: StudyType
  }>()
  const id = Number(params.id)
  const searchParams = useSearchParams().get("random")
  const isRandom = searchParams === "true"
  const { data } = useSuspenseQuery({
    ...getDeckDetail(id),
    select: isRandom ? shuffleCards : undefined,
  })
  const [cardIndex, setCardIndex] = useState<number>(0)
  const cards = data?.cards
  if (!cards?.length)
    return (
      <div className="flex-1 flex justify-center items-center w-full h-full">
        <Card className="sm:w-[425px] flex m-2 p-6 min-h-0 min-w-0 overflow-hidden text-start">
          <div className="flex-1 flex items-center gap-4 justify-center text-xl">
            <CardTitle>Deck is empty</CardTitle>
            <Button asChild>
              <Link href={`/cards/${id}/edit`}>Go to edit deck</Link>
            </Button>
          </div>
        </Card>
      </div>
    )
  const handleMoveButton = (event: MouseEvent<HTMLButtonElement>) => {
    const direction = event.currentTarget.value
    if (direction === "left") {
      setCardIndex((prev) => (prev - 1 + cards.length) % cards.length)
    } else if (direction === "right") {
      setCardIndex((prev) => (prev + 1) % cards.length)
    }
  }
  return (
    <div className="flex-1 flex w-full min-h-0 items-center justify-center overflow-hidden">
      <div className="flex min-h-0 flex-col overflow-x-auto text-center text-lg font-semibold w-full h-full border-b items-center">
        <ScrollArea
          className="w-full whitespace-nowrap flex-shrink-0 p-2 border-b"
          type="auto"
        >
          <div className="flex gap-2 p-2">
            {cards.map((card, i) => (
              <Button
                size={"icon"}
                variant={"outline"}
                key={card.id}
                onClick={() => setCardIndex(i)}
                className={`${i === cardIndex ? "bg-blue-500 text-white" : ""}`}
              >
                {i + 1}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <div className="flex-1 min-h-0  w-full flex items-center justify-center overflow-hidden">
          <div className="flex flex-1 items-center justify-center w-full h-full p-6 gap-6">
            {studyType === "overview" && (
              <OverViewCard card={cards[cardIndex]}>
                <ActionButton handleMoveButton={handleMoveButton} />
              </OverViewCard>
            )}
            {(studyType === "flip" || studyType === "flip-reverse") && (
              <FlipCard
                key={cards[cardIndex].id}
                card={cards[cardIndex]}
                isReverse={studyType === "flip-reverse"}
              >
                {({ children }) => (
                  <ActionButton handleMoveButton={handleMoveButton}>
                    {children}
                  </ActionButton>
                )}
              </FlipCard>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
function ActionButton({
  handleMoveButton,
  children,
}: {
  handleMoveButton: (event: MouseEvent<HTMLButtonElement>) => void
  children?: React.ReactNode
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-1  justify-center">
        <Button
          className="rounded-full size-10"
          variant={"outline"}
          value={"left"}
          onClick={handleMoveButton}
        >
          <ChevronLeft />
        </Button>
      </div>
      {children}
      <div className="flex flex-1 justify-center">
        <Button
          className="rounded-full size-10"
          variant={"outline"}
          value={"right"}
          onClick={handleMoveButton}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}
