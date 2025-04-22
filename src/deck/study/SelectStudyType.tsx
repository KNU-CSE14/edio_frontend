"use client"

import { Button } from "@/src/shadcn/components/ui/button"
import { Card } from "@/src/shadcn/components/ui/card"
import { Checkbox } from "@/src/shadcn/components/ui/checkbox"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

export default function SelectStudyType() {
  const id = Number(useParams().id)
  const router = useRouter()
  const [isRandom, setIsRandom] = useState(true)

  const handleStudyType = (event: React.MouseEvent<HTMLButtonElement>) => {
    const studyType = event.currentTarget.value
    if (isRandom) {
      router.push(`/deck/${id}/study/${studyType}?random=true`)
    } else {
      router.push(`/deck/${id}/study/${studyType}`)
    }
  }
  return (
    <div className="flex w-full h-full items-center justify-center">
      <Card className="grid gap-4 py-4 px-4 sm:w-[425px] sm:py-6 sm:px-6 ">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold p-2 text-center">Study Type</h2>
          <Button
            onClick={handleStudyType}
            value={"overview"}
            variant={"outline"}
          >
            Overview
          </Button>
          <Button onClick={handleStudyType} value={"flip"} variant={"outline"}>
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
}
