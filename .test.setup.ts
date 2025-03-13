import { afterAll, afterEach, beforeAll } from "vitest"
import { server } from "./mocks/server"
import "@testing-library/jest-dom"

beforeAll(() => {
  server.listen()
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
