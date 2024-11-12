import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import DemoButton from "./DemoButton"

// FIXME : 데모용이므로 추후 삭제 요망
describe("demo", () => {
  it("demo button test", () => {
    render(
      <DemoButton
        clickFn={function (): void {
          throw new Error("Function not implemented.")
        }}
        buttonName={"demo"}
      ></DemoButton>,
    )
    expect(screen.getByRole("button", { name: "demo" })).toBeDefined()
  })
  it("api test", async () => {
    const result = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/getExample",
    ).then((res) => res.json())
    expect(result).toEqual({ sample: "hi" })
  })
})
