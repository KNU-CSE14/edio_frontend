import { completedApi, Method } from "@/mocks/handlers"

export class NetworkError extends Error {
  code?: number
  constructor({ message, code }: { message?: string; code?: number }) {
    super(message)
    this.name = new.target.name
    this.code = code
  }
}

export function getBaseUrl(path: string, method: Method = "GET"): string {
  const mswUrl = process.env.NEXT_PUBLIC_MSW_URL as string
  const apiUrl = process.env.NEXT_PUBLIC_API_URL as string
  if (process.env.NODE_ENV === "test") return mswUrl
  if (process.env.NODE_ENV === "production") return apiUrl
  if (completedApi[path].includes(method)) return apiUrl
  return mswUrl
}
