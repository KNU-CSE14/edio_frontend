import { Deck } from "@/src/deck/api"
import { CREATE_FOLDER, Folder, GET_FOLDERS_ALL } from "@/src/folder/api"
import { http, HttpResponse } from "msw"

export type Method = "GET" | "POST" | "PUT" | "DELETE" | "HEAD" | "PATCH"
const GET_ACCOUNT = "/api/account"
const LOGIN = "/oauth2/authorization/google"
const GET_CATEGORIES = "/api/category"
const GET_MY_DIRECTORIES = "/api/folder/my-folders"
const DECK = "/api/deck"
const CARDS = "/api/cards"
export const completedApi: {
  [key: string]: Method[]
} = {
  [LOGIN]: ["GET"],
  [GET_ACCOUNT]: ["GET"],
  [GET_CATEGORIES]: ["GET"],
  [GET_MY_DIRECTORIES]: ["GET"],
  [DECK]: ["POST", "GET", "DELETE"],
  [GET_FOLDERS_ALL]: ["GET"],
  [CARDS]: ["POST", "DELETE"],
  [CREATE_FOLDER]: ["POST", "DELETE"],
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

  http.get(`${process.env.NEXT_PUBLIC_MSW_URL}${GET_CATEGORIES}`, () => {
    return HttpResponse.json([
      {
        id: 1,
        name: "Category 1",
        createdAt: "2024-12-22T00:00:00",
        updatedAt: "2024-12-22T00:00:00",
        deleted: false,
      },
      {
        id: 2,
        name: "Category 2",
        createdAt: "2024-12-22T00:00:00",
        updatedAt: "2024-12-22T00:00:00",
        deleted: false,
      },
    ])
  }),
  http.get(`${process.env.NEXT_PUBLIC_MSW_URL}${GET_MY_DIRECTORIES}`, () => {
    // FIXME 관련 API 명세 협의 후 fix 예정
    return HttpResponse.json([
      {
        id: 1,
        name: "Directory 1",
      },
      {
        id: 2,
        name: "Directory 2",
      },
    ])
  }),
  http.post(`${process.env.NEXT_PUBLIC_MSW_URL}${DECK}`, () => {
    return HttpResponse.json({
      id: 1,
      folderId: 1,
      categoryId: 1,
      name: `deck name`,
      description: "sample",
      isShared: false,
      isFavorite: false,
    })
  }),

  http.get(`${process.env.NEXT_PUBLIC_MSW_URL}${GET_FOLDERS_ALL}`, () => {
    let id = 0
    const createFolder = (depth = 0): Folder | null => {
      depth++
      if (depth > 5) return null
      const sub = new Array(5)
        .fill(0)
        .map(() => createFolder(depth + 1))
        .filter((v) => v != null)
      return {
        id: id++,
        name: `folder name ${id}`,
        subFolders: sub,
        decks: new Array(5).fill(0).map(createDeck),
      }
    }
    const createDeck = (): Deck => {
      return {
        id: id++,
        folderId: id,
        categoryId: 1,
        name: `deck name ${id}`,
        description: "sample",
      }
    }
    return HttpResponse.json(createFolder())
  }),
  http.get(`${process.env.NEXT_PUBLIC_MSW_URL}${DECK}`, ({ request }) => {
    const id = new URL(request.url).searchParams.get("deck")
    if (id) return new HttpResponse(null, { status: 404 })
    let generateCard = (id = 0) => ({
      id: id,
      name: "front" + id,
      description: "back" + id,
      deckId: 1,
      attachments: [],
    })
    return HttpResponse.json({
      id: 1,
      folderId: 1,
      categoryId: 1,
      name: "deck name",
      description: "sample",
      isShared: false,
      isFavorite: false,
      cards: new Array(10).fill(0).map((_, i) => generateCard(i)),
    })
  }),
  http.post(`${process.env.NEXT_PUBLIC_MSW_URL}${CARDS}`, async ({}) => {
    return new HttpResponse(null, { status: 200 })
  }),
  http.patch(`${process.env.NEXT_PUBLIC_MSW_URL}${DECK}`, () => {
    return new HttpResponse(null, { status: 200 })
  }),

  http.post(
    `${process.env.NEXT_PUBLIC_MSW_URL}${CREATE_FOLDER}`,
    async ({ request }) => {
      const data = (await request.json()) as {
        name: string
        parentId: number | null
      }
      return HttpResponse.json({
        id: Math.floor(Math.random() * 1000) + 100,
        name: data.name,
      })
    },
  ),
]

export default handlers
