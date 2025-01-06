import DeckCreateButton from "@/src/deck/DeckCreateButton"
import { Metadata } from "next"

export const metadata = {
  title: "카드 목록 페이지",
} satisfies Metadata

export default function CardPage() {
  // TODO 추후 카드 목록 등 컴포넌트들 추가 예정
  return <DeckCreateButton />
}
