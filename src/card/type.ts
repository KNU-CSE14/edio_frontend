type Card = {
  id: number
  deckId: number
  name: string
  description: string
  attachments: Attachment[]
}

type Attachment = {
  id: number
  fileName: string
  fileType: string
  filePath: string
  filekey: string
  fileSize: number
  fileTarget: string
}
type CardForForm = Partial<
  Card & {
    cardId: string
    image: File | string
    audio: File | string
    key: string
    status: Status
  }
>

type Status = "NEW" | "DELETE" | "DEFAULT"

type CardForEditRequest = Omit<
  Partial<{
    [K in keyof CardForForm]: NonNullable<
      Exclude<CardForForm[K], number>
    > extends string
      ? string
      : File
  }>,
  "id" | "key" | "status" | "attachments"
>
