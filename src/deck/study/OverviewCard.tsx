"use client"

import { getFileSrc } from "@/src/card/edit/util"
import { Card } from "@/src/shadcn/components/ui/card"
import Image from "next/image"
export default function OverViewCard({ card }: { card: Card }) {
  const image = getFileSrc("image", card.attachments)
  const audio = getFileSrc("audio", card.attachments)
  const hasAudio = !!audio.length
  const hasImage = !!image.length
  return (
    <Card className="flex-1 flex w-full h-full m-2 p-4 text-start">
      <div className="flex-1 flex flex-col items-center gap-2 justify-center text-xl">
        <div>{card.name}</div>
        <div>{card.description}</div>
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
            <audio className="mt-2 shrink-0" controls src={audio}></audio>
          )}
        </div>
      )}
    </Card>
  )
}
