import { getFileSrc } from "@/src/card/edit/util"
import { Card, CardHeader, CardTitle } from "@/src/shadcn/components/ui/card"
import { ScrollArea } from "@/src/shadcn/components/ui/scroll-area"
import Image from "next/image"

export default function CardPreview({ props }: { props?: CardForForm }) {
  if (!props) return <div></div>
  const imageSrc = getFileSrc("image", props.attachments, props.image)
  const audioSrc = getFileSrc("audio", props.attachments, props.audio)
  const hasImage = !!props.image && !!imageSrc.length
  const hasAudio = !!props.audio && !!audioSrc.length
  return (
    <Card className="w-full break-words whitespace-normal overflow-hidden max-w-md flex flex-col h-[30rem]">
      <div className="basis-1/2 object-contain w-full">
        {hasImage ? (
          <Image
            src={imageSrc}
            alt="card image"
            width={0}
            height={0}
            className="h-[15rem] object-contain w-full"
          />
        ) : (
          <div className="w-full h-full text-center content-center bg-slate-100 text-gray-700">
            No Image
          </div>
        )}
      </div>
      <CardHeader className="basis-1/2 m-0 overflow-auto border-t h-full">
        <CardTitle className="text-lg">{props.name}</CardTitle>
        <ScrollArea type="auto" className="h-full">
          <div className="overflow-auto whitespace-break-spaces break-all">
            {props.description}
          </div>
        </ScrollArea>
        {hasAudio && (
          <audio className="self-center" controls src={audioSrc}></audio>
        )}
      </CardHeader>
    </Card>
  )
}
