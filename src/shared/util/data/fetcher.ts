import { getBaseUrl, NetworkError } from "@/src/shared/util/data/common"
import { serverHeaders } from "@/src/shared/util/data/server-option"
import { isServer } from "@tanstack/react-query"
import { stringify } from "qs"

const defaultHeaders: HeadersInit = {
  "Content-Type": "application/json",
  Accept: "application/json",
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
export async function postFetch(
  path: string,
  content?: BodyInit,
  option?: RequestInit,
) {
  return fetch(`${getBaseUrl(path, "POST")}${path}`, {
    method: "POST",
    credentials: "include",
    ...option,
    headers: isServer
      ? await serverHeaders(option?.headers)
      : (option?.headers ?? {}),
    body: content,
  }).then((res) => {
    if (!res.ok) throw new NetworkError({ code: res.status })
    return res.headers.get("Content-Type") === "application/json"
      ? res.json()
      : res
  })
}
