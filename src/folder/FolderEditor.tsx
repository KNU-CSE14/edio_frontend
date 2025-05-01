import { Folder } from "@/src/folder/api"
import { Button } from "@/src/shadcn/components/ui/button"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Form,
} from "@/src/shadcn/components/ui/form"
import { Input } from "@/src/shadcn/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shadcn/components/ui/select"
import { UseFormReturn } from "react-hook-form"
type FolderFormValues = {
  name: string
  parentId: number
}

type FolderEditorProps = {
  form: UseFormReturn<FolderFormValues>
  onOpenChange: (open: boolean) => void
  handleSubmit: () => void
  folders: Folder[]
  isPending: boolean
  mode: "수정" | "생성"
}
export default function FolderEditor({
  form,
  handleSubmit,
  folders,
  isPending,
  onOpenChange,
  mode,
}: FolderEditorProps) {
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>폴더 이름</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="min-h-[44px]"
                      placeholder="폴더 이름을 입력하세요"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>상위 폴더</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value?.toString()}
                      defaultValue={field.value?.toString()}
                    >
                      <SelectTrigger id="parent" className="min-h-[44px]">
                        <SelectValue placeholder="상위 폴더 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {folders?.map((folder) => (
                          <SelectItem
                            key={folder.id}
                            value={folder.id.toString()}
                          >
                            {folder.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Button type="submit" className="w-full sm:w-24" disabled={isPending}>
            {isPending ? `${mode} 중...` : mode}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-24"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            취소
          </Button>
        </div>
      </form>
    </Form>
  )
}
