"use client"

import { Button } from "@/src/shadcn/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/src/shadcn/components/ui/form"
import { Input } from "@/src/shadcn/components/ui/input"
import { useFieldArray, useForm } from "react-hook-form"
import { getDeckDetail } from "@/src/deck/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { Card } from "@/src/shadcn/components/ui/card"
import { ImageUp, Mic, X } from "lucide-react"
import { Textarea } from "@/src/shadcn/components/ui/textarea"
import { POST_CARDS, updateCards } from "@/src/card/api"
import { useRef } from "react"

const createDummyFile = (attachment?: Attachment) => {
  const file = new File([], attachment?.fileName ?? "", {
    type: attachment?.fileType,
  })
  return file
}

const toCardForRequestValue = (value: CardForForm[keyof CardForForm]) => {
  if (typeof value === "number") return value.toString()
  if (typeof value === "string") return value
  if (value instanceof File) return value
  return value
}
const getFileNameFromField = (file: File | string | undefined) => {
  if (file instanceof File) return file.name
  return file
}
const getUpdatedFields = (
  card: CardForForm,
  dirtyFields: {
    [key in keyof CardForEditRequest]?: boolean
  },
) => {
  const keys = Object.keys(card) as Array<keyof CardForEditRequest>
  return keys.reduce((acc, key) => {
    const isRequiredKey = key === "cardId" || key === "deckId"
    if (dirtyFields[key] || isRequiredKey)
      return { ...acc, [key]: toCardForRequestValue(card[key]) }
    return acc
  }, {})
}

export default function DeckEdit() {
  const { id } = useParams<{ id: string }>() as unknown as { id: number }
  const queryClient = useQueryClient()
  const { data } = useQuery(getDeckDetail(id))
  const fileInputs = useRef<Map<string, HTMLElement> | null>(null)
  const cards: CardForForm[] =
    data?.cards.map(({ attachments, id, ...card }) => ({
      ...card,
      cardId: id.toString(),
      image:
        attachments.find((v) => v.fileType.startsWith("image"))?.fileName ?? "",
      audio:
        attachments.find((v) => v.fileType.startsWith("audio"))?.fileName ?? "",
      status: "DEFAULT",
    })) ?? []
  const form = useForm({ values: { cards } })
  const { fields, update, append } = useFieldArray({
    control: form.control,
    name: "cards",
    keyName: "key",
  })
  const postDeckMutation = useMutation({
    mutationKey: [POST_CARDS],
    mutationFn: updateCards,
    onSuccess: () => {
      queryClient.invalidateQueries(getDeckDetail(id))
    },
  })
  const onSubmit = (data: { cards: CardForForm[] }) => {
    const dirtyCards = form.formState.dirtyFields.cards
    if (!dirtyCards?.length) return
    const { deleted, edited } = data.cards.reduce(
      (acc, card, i) => {
        if (!dirtyCards[i]) return acc
        const { key, ...dirtyFields } = dirtyCards[i]
        const isDeleted =
          card.status === "DELETE" && Number.isInteger(card.cardId)
        const isEdited =
          Object.values(dirtyFields).some((v) => v) && card.status !== "DELETE"
        if (isDeleted) acc.deleted.push(card.cardId!)
        if (isEdited) acc.edited.push(getUpdatedFields(card, dirtyFields))
        return acc
      },
      { deleted: [] as string[], edited: [] as CardForEditRequest[] },
    )
    if (deleted.length) {
      /// TODO: 삭제 api
    }
    if (edited.length) {
      postDeckMutation.mutate(edited)
    }
  }
  if (!data) return <div>loading...</div>
  const handleAddCard = () => {
    append({
      name: "",
      description: "",
      deckId: id,
      status: "NEW",
      image: createDummyFile(),
      audio: createDummyFile(),
    })
  }
  const handleRemove = (index: number) => () => {
    update(index, {
      ...fields[index],
      status: "DELETE",
    })
    form.trigger()
  }
  const handleUndo = (index: number) => () => {
    if (!fields[index].cardId) {
      update(index, { ...fields[index], status: "NEW" })
      form.trigger()
      return
    }
    update(index, { ...fields[index], status: "DEFAULT" })
  }
  const setFileInputNode = (key: string) => (node: HTMLInputElement | null) => {
    const map = getFileInputNode()
    map.set(key, node!)
  }

  const getFileInputNode = () => {
    if (!fileInputs.current) {
      fileInputs.current = new Map()
    }
    return fileInputs.current
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col h-svh"
      >
        <div className="flex flex-1 overflow-auto">
          <ul className="flex flex-col w-full overflow-auto border-r min-h-0 border-gray-200 justify-items-center p-2">
            {fields.map((card, index) => {
              const isDeleted = card.status === "DELETE"
              return (
                <li key={card.key} className="flex justify-center ">
                  <Card className="flex flex-col p-2 m-2 gap-2 max-w-md w-full">
                    <div className="flex flex-col gap-2">
                      <FormField
                        name={`cards.${index}.name`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>name</FormLabel>
                            <FormControl>
                              <Input
                                disabled={isDeleted}
                                type="text"
                                placeholder="name"
                                {...form.register(field.name, {
                                  required: !isDeleted,
                                })}
                                value={field.value ?? card.name}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      ></FormField>
                      <FormField
                        name={`cards.${index}.description`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>description</FormLabel>
                            <FormControl>
                              <Textarea
                                disabled={isDeleted}
                                rows={5}
                                placeholder="description"
                                {...form.register(field.name, {
                                  required: !isDeleted,
                                })}
                                value={field.value ?? card.description}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      ></FormField>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex flex-col gap-1 min-w-0">
                        <FormField
                          name={`cards.${index}.image`}
                          render={({ field: { value, onChange, name } }) => (
                            <FormItem>
                              <div className="text-ellipsis flex items-center gap-1">
                                <Button
                                  disabled={isDeleted}
                                  type="button"
                                  variant={"outline"}
                                  size={"icon"}
                                  onClick={() => {
                                    getFileInputNode().get(name)?.click()
                                  }}
                                >
                                  <ImageUp />
                                </Button>
                                <FormLabel className="truncate cursor-pointer flex-1 leading-normal">
                                  {getFileNameFromField(value ?? card.image)}
                                </FormLabel>
                                <Button
                                  className={
                                    getFileNameFromField(value ?? card.image)
                                      ?.length
                                      ? undefined
                                      : "hidden"
                                  }
                                  disabled={isDeleted}
                                  type="reset"
                                  variant={"ghost"}
                                  size={"icon"}
                                  onClick={() => {
                                    onChange(createDummyFile())
                                  }}
                                >
                                  <X />
                                </Button>
                              </div>
                              <FormControl>
                                <Input
                                  disabled={isDeleted}
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  {...form.register(name)}
                                  ref={setFileInputNode(name)}
                                  onChange={(e) => {
                                    onChange(e.target.files?.[0])
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        ></FormField>
                        <FormField
                          name={`cards.${index}.audio`}
                          render={({ field: { onChange, value, name } }) => (
                            <FormItem>
                              <div className="text-ellipsis flex items-center gap-1">
                                <Button
                                  disabled={isDeleted}
                                  type="button"
                                  variant={"outline"}
                                  size={"icon"}
                                  onClick={() => {
                                    getFileInputNode().get(name)?.click()
                                  }}
                                >
                                  <Mic />
                                </Button>
                                <FormLabel className="truncate flex-1 cursor-pointer leading-normal">
                                  {getFileNameFromField(value ?? card.audio)}
                                </FormLabel>
                                <Button
                                  className={
                                    getFileNameFromField(value ?? card.audio)
                                      ?.length
                                      ? undefined
                                      : "hidden"
                                  }
                                  disabled={isDeleted}
                                  type="reset"
                                  variant={"ghost"}
                                  size={"icon"}
                                  onClick={() => {
                                    onChange(createDummyFile())
                                  }}
                                >
                                  <X />
                                </Button>
                                <FormControl>
                                  <Input
                                    disabled={isDeleted}
                                    type="file"
                                    className="hidden"
                                    accept="audio/*"
                                    {...form.register(name)}
                                    ref={setFileInputNode(name)}
                                    onChange={(e) =>
                                      e.target.files &&
                                      onChange(e.target.files[0])
                                    }
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        ></FormField>
                      </div>
                      {isDeleted ? (
                        <Button
                          type="button"
                          onClick={handleUndo(index)}
                          variant={"secondary"}
                          size={"sm"}
                        >
                          undo
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={handleRemove(index)}
                          variant={"destructive"}
                          size={"sm"}
                        >
                          remove
                        </Button>
                      )}
                    </div>
                  </Card>
                </li>
              )
            })}
          </ul>
          <div className="flex w-full max-h-fit">preview TODO</div>
        </div>
        <div className="flex justify-around p-3">
          <Button onClick={handleAddCard} variant={"secondary"}>
            Add card
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  )
}
