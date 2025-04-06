"use client"
import { getFileSrc } from "@/src/card/edit/util"
import { Button } from "@/src/shadcn/components/ui/button"
import { Card } from "@/src/shadcn/components/ui/card"
import Image from "next/image"
import { useState } from "react"

export default function FlipCard({
  card,
  isReverse,
}: {
  card: Card
  isReverse: boolean
}) {
  const image = getFileSrc("image", card.attachments)
  const audio = getFileSrc("audio", card.attachments)
  const [flipped, setFlipped] = useState(isReverse)
  const hasAudio = !!audio.length
  const hasImage = !!image.length
  return (
    <div className="flex-1 flex flex-col w-full h-full gap-4">
      <Card className="flex-1 flex m-2 p-4 min-h-0 min-w-0 overflow-hidden text-start">
        <div className="flex-1 flex items-center gap-2 justify-center text-2xl">
          <div>{flipped ? card.description : card.name}</div>
        </div>
        {(hasImage || hasAudio) && flipped && (
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
              <audio className="mt-2 shrink-0" controls src={audio}></audio>
            )}
          </div>
        )}
      </Card>
      <div>
        <Button
          onClick={() => {
            setFlipped((prev) => !prev)
          }}
        >
          Flip
        </Button>
      </div>
    </div>
  )
}
