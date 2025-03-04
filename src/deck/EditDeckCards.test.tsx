import { beforeEach, describe, expect, it, vi } from "vitest"
import Page from "@/app/deck/[id]/edit/page"
import {
  act,
  findByRole,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { useParams } from "next/navigation"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { DefaultBodyType, http, HttpResponse } from "msw"
import { CARDS } from "@/src/card/api"
import { server } from "@/mocks/server"
vi.mock("next/navigation", () => ({
  useParams: vi.fn(),
}))
const queryClientProvider = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
      },
    },
  })

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  return Wrapper
}
beforeEach(async () => {
  vi.mocked(useParams).mockReturnValue({
    id: "1",
  })
  const props = { params: { id: 1 } }
  const Result = await Page(props)
  render(Result, { wrapper: queryClientProvider() })
  act(() => {
    waitFor(() => {
      expect(screen.queryByText("loading...")).not.toBeInTheDocument()
    })
  })
})

describe("덱 카드 편집 화면", () => {
  it("화면 진입 시 기존 카드 목록 rendering", async () => {
    const cardLength = 10
    const displayedCards = await screen.findAllByRole("listitem")
    expect(displayedCards).toHaveLength(cardLength)
  })
  it("필수 필드를 입력하지 않으면 error", async () => {
    fireEvent.click(await screen.findByText("Add card"))
    const resultCards = await screen.findAllByRole("listitem")
    const addedCard = resultCards.pop()!
    waitFor(() => {
      expect(addedCard).toHaveAttribute("aria-invalid", "true")
    })
    fireEvent.change(addedCard, { target: { value: "front" } })
    expect(addedCard).not.toHaveAttribute("aria-invalid", "true")
  })
  it("카드 수정 시 수정된 필드와 필수 값만 전달된다.", async () => {
    let result: object | undefined = undefined
    server.use(
      http.post(`${process.env.MSW_URL}${CARDS}`, async ({ request }) => {
        const body = await request.formData()
        result = [...body.entries()].reduce(
          (acc: { [key: string]: any }, [key, value]) => {
            const [, keyName] = key.split(".")
            acc[keyName] = value
            return acc
          },
          {},
        )
        return new HttpResponse(null, { status: 200 })
      }),
    )
    const cards = await screen.findAllByRole("textbox", { name: "name" })
    const targetElement = cards[0]
    const changedName = "edit name"
    fireEvent.change(targetElement, { target: { value: changedName } })
    fireEvent.click(screen.getByRole("button", { name: "Submit" }))
    await waitFor(() => {
      expect(result).toEqual({
        name: changedName,
        deckId: "1",
        cardId: "0",
      })
    })
  })
  it("삭제된 카드는 id만 전달한다.", async () => {
    let result: DefaultBodyType | undefined = undefined

    const resultCards = await screen.findAllByRole("listitem")
    const willBeRemoved = resultCards.pop()
    const removeButton = await findByRole(willBeRemoved!, "button", {
      name: "remove",
    })
    server.use(
      http.delete(`${process.env.MSW_URL}${CARDS}`, async ({ request }) => {
        const body = await request.json()
        result = body
        return new HttpResponse(null, { status: 200 })
      }),
    )

    fireEvent.click(removeButton)
    fireEvent.click(screen.getByRole("button", { name: "Submit" }))
    await waitFor(() => {
      expect(result).toEqual({ deckId: "1", cardIds: ["9"] })
    })
  })
})
