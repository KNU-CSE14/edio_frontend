export const createDummyFile = (attachment?: Attachment) => {
  const file = new File([], attachment?.fileName ?? "", {
    type: attachment?.fileType,
  })
  return file
}

export const getFileNameFromField = (file: File | string | undefined) => {
  if (file instanceof File) return file.name
  return file
}

export const toCardForRequestValue = (
  value: CardForForm[keyof CardForForm],
) => {
  if (typeof value === "number") return value.toString()
  if (typeof value === "string") return value
  if (value instanceof File) return value
  return value
}

export const getUpdatedFields = (
  card: CardForForm,
  dirtyFields: { [key in keyof CardForEditRequest]?: boolean },
) => {
  const keys = Object.keys(card) as Array<keyof CardForEditRequest>
  return keys.reduce((acc, key) => {
    const isRequiredKey = key === "cardId" || key === "deckId"
    if (dirtyFields[key] || isRequiredKey)
      return { ...acc, [key]: toCardForRequestValue(card[key]) }
    return acc
  }, {})
}

export const getFileSrc = (
  type: "audio" | "image",
  attachments: Attachment[],
  file?: File | string,
) => {
  if (file instanceof File && file.size) return URL.createObjectURL(file)
  if (typeof file === "string" || file === undefined) {
    return attachments.find((v) => v.fileType.startsWith(type))?.filePath ?? ""
  }
  return ""
}

export const preventEnterKeySubmission = (
  e: React.KeyboardEvent<HTMLFormElement>,
) => {
  if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
    e.preventDefault()
  }
}
