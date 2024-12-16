"use server"
import { getBaseUrl, NetworkError } from "@/src/shared/util/data/common"
import { isServer } from "@tanstack/react-query"
import { headers } from "next/headers"
import { stringify } from "qs"

const defaultHeaders: HeadersInit = {
  "Content-Type": "application/json",
}

/**
 * @param path start with /
 * @param parameter
 * @param option
 * @returns
 */
export async function getFetch(
  path: string,
  parameter?: object,
  option?: RequestInit,
) {
  const queryString = parameter ? `?${stringify(parameter)}` : ""
  return fetch(`${getBaseUrl(path)}${path}${queryString}`, {
    credentials: "include",
    ...option,
    headers: {
      ...(isServer ? Object.fromEntries(headers()) : {}),
      ...(option?.headers ?? defaultHeaders),
    },
  }).then((res) => {
    if (!res.ok) throw new NetworkError({ code: res.status })
    return res.json()
  })
}
