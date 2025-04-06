"use client"

import { getDeckDetail } from "@/src/deck/api"
import FlipCard from "@/src/deck/study/FlipCard"
import OverViewCard from "@/src/deck/study/OverviewCard"
import { Button } from "@/src/shadcn/components/ui/button"
import { Card, CardTitle } from "@/src/shadcn/components/ui/card"
import { Checkbox } from "@/src/shadcn/components/ui/checkbox"
import { ScrollArea, ScrollBar } from "@/src/shadcn/components/ui/scroll-area"
import { useQuery } from "@tanstack/react-query"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState, MouseEvent } from "react"
type StudyType = "overview" | "flip" | "flip-reverse"
export default function StudyPage() {
  const { id } = useParams<{ id: string }>() as unknown as { id: number }
  const { data } = useQuery(getDeckDetail(id))
  const [cardIndex, setCardIndex] = useState<number>(0)
  const [studyType, setStudyType] = useState<StudyType>()
  const [isRandom, setIsRandom] = useState(true)
  const cards = data?.cards

  const handleStudyType = (event: MouseEvent<HTMLButtonElement>) => {
    setStudyType(event.currentTarget.value as StudyType)
  }
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
  if (!studyType)
    return (
      <div className="flex w-full h-full items-center justify-center">
        <Card className="grid gap-4 py-4 px-4 sm:w-[425px] sm:py-6 sm:px-6 ">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold p-2 text-center">
              Study Type
            </h2>
            <Button
              onClick={handleStudyType}
              value={"overview"}
              variant={"outline"}
            >
              Overview
            </Button>
            <Button
              onClick={handleStudyType}
              value={"flip"}
              variant={"outline"}
            >
              Flip mode
            </Button>
            <Button
              onClick={handleStudyType}
              value={"flip-reverse"}
              variant={"outline"}
            >
              Flip mode(Reverse)
            </Button>
          </div>
          <div className="flex space-x-2 items-center">
            <Checkbox
              id="random"
              checked={isRandom}
              onCheckedChange={() => setIsRandom((prev) => !prev)}
            />
            <label className="text-sm font-medium " htmlFor="random">
              Random
            </label>
          </div>
        </Card>
      </div>
    )

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
        <div className="flex-1 min-h-0  w-full flex items-center justify-center">
          <div className="flex flex-1 items-center justify-center w-full h-full p-6 gap-6">
            <Button
              className="rounded-full"
              variant={"outline"}
              size={"icon"}
              onClick={() =>
                setCardIndex((prev) =>
                  prev - 1 < 0 ? cards.length - 1 : prev - 1,
                )
              }
            >
              <ChevronLeft />
            </Button>
            {studyType === "overview" && (
              <OverViewCard card={cards[cardIndex]} />
            )}
            {(studyType === "flip" || studyType === "flip-reverse") && (
              <FlipCard
                key={cards[cardIndex].id}
                card={cards[cardIndex]}
                isReverse={studyType === "flip-reverse"}
              />
            )}
            <Button
              className="rounded-full"
              variant={"outline"}
              size={"icon"}
              onClick={() => setCardIndex((prev) => (prev + 1) % cards.length)}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
