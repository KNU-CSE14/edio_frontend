import { http, HttpResponse } from "msw"

export type Method = "GET" | "POST" | "PUT" | "DELETE" | "HEAD" | "PATCH"
const GET_ACCOUNT = "/api/account"
const LOGIN = "/oauth2/authorization/google"
export const completedApi: {
  [key: string]: Method[]
} = {
  [LOGIN]: ["GET"],
  [GET_ACCOUNT]: ["GET"],
}
const handlers = [
  http.get(`${process.env.NEXT_PUBLIC_MSW_URL}${LOGIN}`, () => {
    return new HttpResponse(null, {
      headers: {
        "Set-Cookie": "accessToken=token",
      },
      status: 200,
    })
  }),
  http.get(
    `${process.env.NEXT_PUBLIC_MSW_URL}${GET_ACCOUNT}`,
    ({ cookies }) => {
      if (!cookies.accessToken) return new HttpResponse(null, { status: 401 })
      return HttpResponse.json({
        id: 130,
        loginId: "test@gmail.com",
        rootFolderId: 9,
        roles: "ROLE_USER",
        memberResponse: {
          id: 56,
          email: "test@gmail.com",
          name: "testTest",
          givenName: "Test",
          familyName: "test",
          profileUrl:
            "https://lh3.googleusercontent.com/a/ACg8ocJpnmqja_MemvreWihoSC9XfgIwPu55uwwUJeppdYJAMYq9cRPt=s96-c",
          createdAt: "2024-12-09T06:41:58",
          updateAt: "2024-12-09T06:41:58",
        },
      })
    },
  ),
]

export default handlers
