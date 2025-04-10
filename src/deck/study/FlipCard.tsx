"use client"
import { getFileSrc } from "@/src/card/edit/util"
import { Button } from "@/src/shadcn/components/ui/button"
import { Card } from "@/src/shadcn/components/ui/card"
import Image from "next/image"
import { useState } from "react"
type FlipCardProps = {
  card: Card
  isReverse: boolean
  children(props: { children: React.ReactNode }): React.ReactNode
}
export default function FlipCard({ card, isReverse, children }: FlipCardProps) {
  const image = getFileSrc("image", card.attachments)
  const audio = getFileSrc("audio", card.attachments)
  const [flipped, setFlipped] = useState(isReverse)
  const hasAudio = !!audio.length
  const hasImage = !!image.length
  return (
    <div className="flex flex-col w-full h-full gap-4 max-w-[1000px] justify-evenly">
      <div className="flex-1 flex [perspective:2200px] max-h-[500px]">
        <div
          className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? "[transform:rotateY(180deg)]" : ""}`}
        >
          <Card className="absolute flex-1 flex w-full h-full p-4 min-h-0 min-w-0 overflow-hidden text-start [backface-visibility:hidden]">
            <div className="flex-1 flex items-center gap-2 justify-center text-2xl">
              <div>{card.name}</div>
            </div>
          </Card>
          <Card className="absolute flex-1 flex w-full h-full p-4 min-h-0 min-w-0 overflow-hidden text-start [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="flex-1 flex items-center gap-2 justify-center text-2xl">
              {card.description}
            </div>
            {(hasImage || hasAudio) && (
              <div className="flex-1 flex flex-col h-full min-h-0 min-w-0 overflow-hidden items-center justify-center">
                {hasImage && (
                  <Image
                    src={image}
                    alt="Card Image"
                    width={500}
                    height={500}
                    className="flex-1 min-h-0 max-h-full max-w-full object-contain"
                  />
                )}
                {hasAudio && (
                  <audio
                    className="mt-2 w-full shrink-0"
                    controls
                    src={audio}
                  ></audio>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
      {children({
        children: (
          <Button
            size={"lg"}
            className="w-full md:w-1/2"
            onClick={() => {
              setFlipped((prev) => !prev)
            }}
          >
            Flip
          </Button>
        ),
      })}
    </div>
  )
}
