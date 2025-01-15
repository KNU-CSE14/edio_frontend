"use server"
import { cookies } from "next/headers"

export async function serverHeaders(header?: HeadersInit) {
  return {
    Cookie: cookies().toString(),
    ...header,
  }
}
