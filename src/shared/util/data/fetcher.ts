import { Method } from "@/mocks/handlers"
import { getBaseUrl, NetworkError } from "@/src/shared/util/data/common"
import { serverHeaders } from "@/src/shared/util/data/server-option"
import { isServer } from "@tanstack/react-query"
import { stringify } from "qs"

const defaultHeaders: HeadersInit = {
  "Content-Type": "application/json",
  Accept: "application/json",
}
type PathVariable = `/${string}`
/**
 * @param path start with /
 * @param parameter
 * @param option
 * @returns
 */
export async function getFetch(
  path: string,
  {
    pathVariable,
    queryString,
    option,
  }: {
    pathVariable?: PathVariable
    queryString?: object
    option?: RequestInit
  } = {},
) {
  const qs = queryString ? `?${stringify(queryString)}` : ""
  return fetch(`${getBaseUrl(path)}${path}${pathVariable ?? qs}`, {
    credentials: "include",
    ...option,
    headers: isServer
      ? await serverHeaders(option?.headers ?? defaultHeaders)
      : (option?.headers ?? defaultHeaders),
  }).then((res) => {
    if (!res.ok) throw new NetworkError({ code: res.status })
    return res.headers.get("Content-Type") === "application/json"
      ? res.json()
      : res
  })
}

/**
 * POST API 요청 메소드
 * @param path API URL
 * @param content request body (form-data)
 * @param option
 */
export async function formFetch(
  path: string,
  {
    parameter,
    option,
    pathVariable,
  }: {
    parameter?: BodyInit
    option?: RequestInit
    pathVariable?: PathVariable
  } = {},
) {
  return fetch(
    `${getBaseUrl(path, (option?.method ?? "POST") as Method)}${path}${pathVariable ?? ""}`,
    {
      method: "POST",
      credentials: "include",
      ...option,
      headers: isServer
        ? await serverHeaders(option?.headers)
        : (option?.headers ?? {}),
      body: parameter,
    },
  ).then((res) => {
    if (!res.ok) throw new NetworkError({ code: res.status })
    return res.headers.get("Content-Type") === "application/json"
      ? res.json()
      : res
  })
}
