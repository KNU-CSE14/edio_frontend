// FIXME : 데모용이므로 추후 삭제 요망

export default function DemoButton({ clickFn, buttonName }: DemoButtonProps) {
  return <button onClick={clickFn}>{buttonName}</button>
}

interface DemoButtonProps {
  clickFn: () => void
  buttonName: string
}
