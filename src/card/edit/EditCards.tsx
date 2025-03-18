"use client"

import { Form } from "@/src/shadcn/components/ui/form"
import { Button } from "@/src/shadcn/components/ui/button"
import { ScrollArea } from "@/src/shadcn/components/ui/scroll-area"
import CardForm from "@/src/card/edit/CardForm"
import CardPreview from "@/src/card/edit/CardPreview"
import { mutateCards } from "@/src/card/api"
import { getUpdatedFields, createDummyFile } from "@/src/card/edit/util"
import { getDeckDetail } from "@/src/deck/api"
import { toast } from "@/src/shadcn/hooks/use-toast"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { useState, useRef, FormEvent } from "react"
import { useForm, useFieldArray } from "react-hook-form"

export default function CardEdit() {
  const { id } = useParams<{ id: string }>() as unknown as { id: number }
  const { data } = useQuery(getDeckDetail(id))
  const queryClient = useQueryClient()
  const cards: CardForForm[] =
    data?.cards.map(({ attachments, id, ...card }) => ({
      ...card,
      cardId: id.toString(),
      image:
        attachments.find((v) => v.fileType.startsWith("image"))?.fileName ?? "",
      audio:
        attachments.find((v) => v.fileType.startsWith("audio"))?.fileName ?? "",
      status: "DEFAULT",
      attachments,
    })) ?? []

  const form = useForm({ values: { cards } })
  const { fields, update, append } = useFieldArray({
    control: form.control,
    name: "cards",
    keyName: "key",
  })

  const [lastTouchedCard, setLastTouchedCard] = useState(cards[0])
  const fileInputs = useRef<Map<string, HTMLElement> | null>(null)
  const getFileInputNode = () => {
    if (!fileInputs.current) {
      fileInputs.current = new Map()
    }
    return fileInputs.current
  }
  const setFileInputNode = (key: string) => (node: HTMLInputElement | null) => {
    const map = getFileInputNode()
    if (node) map.set(key, node)
  }

  const cardMutation = useMutation({
    mutationFn: mutateCards,
    onSuccess: () => {
      queryClient.invalidateQueries(getDeckDetail(id))
    },
    onError: () => {
      toast({
        title: "Failed update cards",
        variant: "destructive",
      })
    },
  })

  const handleSubmit = form.handleSubmit((data) => {
    const dirtyCards = form.formState.dirtyFields.cards
    if (!dirtyCards?.length) return
    const result = data.cards.reduce(
      (acc, card, i) => {
        if (!dirtyCards[i]) return acc
        const { key, ...dirtyFields } = dirtyCards[i]
        const isDeleted = card.status === "DELETE" && card.cardId !== undefined
        const isEdited =
          Object.values(dirtyFields).some((v) => v) && card.status !== "DELETE"
        if (isDeleted) acc.deleted.cardIds.push(card.cardId!)
        if (isEdited) acc.edited.push(getUpdatedFields(card, dirtyFields))
        return acc
      },
      {
        deleted: { deckId: id, cardIds: [] as string[] },
        edited: [] as CardForEditRequest[],
      },
    )
    if (result.edited.length || result.deleted.cardIds.length) {
      cardMutation.mutate(result)
    }
  })

  const handleAddCard = () => {
    append({
      name: "",
      description: "",
      deckId: id,
      status: "NEW",
      image: createDummyFile(),
      audio: createDummyFile(),
      attachments: [],
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

  const handleTouch = (event: FormEvent) => {
    if (event.target instanceof HTMLElement) {
      const element = event.target.closest("div[data-index]")
      if (element instanceof HTMLElement) {
        const index = Number(element.dataset.index)
        setLastTouchedCard(form.getValues().cards[index])
        form.trigger()
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onChange={handleTouch}
        onFocus={handleTouch}
        onClick={handleTouch}
        onSubmit={handleSubmit}
        className="w-full flex flex-col flex-grow overflow-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 flex-1 overflow-auto">
          <ScrollArea className="w-full border-r border-gray-200" type="auto">
            <ul className="p-3">
              {fields.map((card, index) => (
                <li key={card.key}>
                  <CardForm
                    card={card}
                    index={index}
                    form={form}
                    handleRemove={handleRemove(index)}
                    handleUndo={handleUndo(index)}
                    getFileInputNode={getFileInputNode}
                    setFileInputNode={setFileInputNode}
                  />
                </li>
              ))}
            </ul>
          </ScrollArea>
          <div className="hidden md:flex w-full items-center justify-center px-2">
            <CardPreview props={lastTouchedCard ?? fields[0]} />
          </div>
        </div>
        <div className="flex justify-around p-3 border-t">
          <Button type="button" onClick={handleAddCard} variant="outline">
            Add card
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  )
}
