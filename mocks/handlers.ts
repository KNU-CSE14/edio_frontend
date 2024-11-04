import { http, HttpResponse } from "msw"

const handlers = [
  http.get(`${process.env.NEXT_PUBLIC_API_URL}/getExample`, () => {
    return HttpResponse.json({ sample: "hi" })
  }),
  http.get(`${process.env.NEXT_PUBLIC_API_URL}/tokenExample`, ({ cookies }) => {
    if (!cookies.authToken) {
      return new HttpResponse(null, { status: 403 })
    }
    return HttpResponse.json({})
  }),
  http.get(`${process.env.NEXT_PUBLIC_API_URL}/cookieExample`, () => {
    return new HttpResponse(null, {
      headers: {
        "Set-Cookie": "authToken=abc-123",
      },
      status: 200,
    })
  }),
]

export default handlers
