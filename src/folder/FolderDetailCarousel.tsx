"use client"

import { Folder } from "@/src/folder/api"
import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, FolderIcon } from "lucide-react"
import DeckInfoCard from "@/src/deck/DeckInfoCard"

export default function FolderDetailCarousel({
  folderDetail,
}: FolderDetailSectionProps) {
  const visibleCardSize = 5

  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  const sectionRef = useRef<HTMLDivElement>(null)

  const checkArrow = () => {
    if (!sectionRef.current) {
      return
    }

    const { scrollLeft, scrollWidth } = sectionRef.current
    const parentWidth = sectionRef.current.parentElement?.clientWidth || 0

    setShowLeftArrow(scrollLeft > 0)
    setShowRightArrow(scrollLeft < scrollWidth - parentWidth - 5) // 상위 컴포넌트의 너비 사용
  }

  useEffect(() => {
    const section = sectionRef.current
    if (!section) {
      return
    }
    checkArrow()
    section.addEventListener("scroll", checkArrow)
    window.addEventListener("resize", checkArrow)

    return () => {
      section.removeEventListener("scroll", checkArrow)
      window.removeEventListener("resize", checkArrow)
    }
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (!sectionRef.current) return

    const section = sectionRef.current
    const cardWidth = section.querySelector(".card-item")?.clientWidth || 0

    if (direction === "left") {
      section.scrollBy({ left: -cardWidth, behavior: "smooth" })
    } else {
      section.scrollBy({ left: cardWidth, behavior: "smooth" })
    }
  }

  return (
    <div className="mb-8">
      <div className="flex items-center mb-3">
        <span className="mr-2">
          <FolderIcon className="h-5 w-5 text-blue-500" />
        </span>
        <h2 className="text-lg font-semibold">{folderDetail?.name}</h2>
      </div>

      <div className="relative">
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full shadow-md p-1"
            aria-label="이전 카드 보기"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        <div
          ref={sectionRef}
          className="flex overflow-x-auto scrollbar-hide gap-4 pb-2 pt-1 px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {folderDetail?.decks.map((deck) => (
            <div key={deck.id} className="card-item flex-shrink-0 w-[220px]">
              <DeckInfoCard deck={deck} />
            </div>
          ))}
        </div>

        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full shadow-md p-1"
            aria-label="다음 카드 보기"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  )
}

interface FolderDetailSectionProps {
  folderDetail?: Folder
}
