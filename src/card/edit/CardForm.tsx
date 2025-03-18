import { getFileNameFromField, createDummyFile } from "@/src/card/edit/util"
import { Button } from "@/src/shadcn/components/ui/button"
import { Card } from "@/src/shadcn/components/ui/card"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/src/shadcn/components/ui/form"
import { Input } from "@/src/shadcn/components/ui/input"
import { Textarea } from "@/src/shadcn/components/ui/textarea"
import { ImageUp, X, Mic } from "lucide-react"
import { UseFormReturn } from "react-hook-form"

type CardItemProps = {
  index: number
  card: CardForForm
  form: UseFormReturn<{ cards: CardForForm[] }, any, undefined>
  getFileInputNode: () => Map<string, HTMLElement>
  setFileInputNode: (key: string) => (node: HTMLInputElement | null) => void
  handleRemove: () => void
  handleUndo: () => void
}

export default function CardForm({
  index,
  card,
  form,
  getFileInputNode,
  setFileInputNode,
  handleRemove,
  handleUndo,
}: CardItemProps) {
  const isDeleted = card.status === "DELETE"
  return (
    <Card
      className="flex flex-col p-2 m-2 gap-2 max-w-md w-full flex-shrink-0"
      data-index={index}
    >
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
                  maxLength={255}
                  placeholder="name"
                  {...form.register(field.name, { required: !isDeleted })}
                  value={field.value ?? card.name}
                />
              </FormControl>
            </FormItem>
          )}
        />
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
                  maxLength={255}
                  placeholder="description"
                  {...form.register(field.name, { required: !isDeleted })}
                  value={field.value ?? card.description}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-1 min-w-0">
          <FormField
            name={`cards.${index}.image`}
            render={({ field: { value, onChange, name } }) => (
              <FormItem>
                <div className="text-ellipsis flex items-center gap-1">
                  <Button
                    aria-label="upload-image"
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
                    aria-label="remove-image"
                    className={
                      getFileNameFromField(value ?? card.image)?.length
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
          />
          <FormField
            name={`cards.${index}.audio`}
            render={({ field: { onChange, value, name } }) => (
              <FormItem>
                <div className="text-ellipsis flex items-center gap-1">
                  <Button
                    aria-label="upload-audio"
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
                    aria-label="remove-audio"
                    className={
                      getFileNameFromField(value ?? card.audio)?.length
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
                        e.target.files && onChange(e.target.files[0])
                      }
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        </div>
        {isDeleted ? (
          <Button
            type="button"
            onClick={handleUndo}
            variant={"secondary"}
            size={"sm"}
          >
            undo
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleRemove}
            variant={"destructive"}
            size={"sm"}
          >
            remove
          </Button>
        )}
      </div>
    </Card>
  )
}
