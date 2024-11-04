"use client"

import { useEffect, useState } from "react"
const isMockingMode = process.env.NODE_ENV === "development"

export default function MSWProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [mswReady, setMswReady] = useState(!isMockingMode)
  useEffect(() => {
    const init = async () => {
      if (isMockingMode && typeof window !== "undefined") {
        const worker = await import("@/mocks/browser").then((res) => res.worker)
        await worker.start({ onUnhandledRequest: "bypass" })
        setMswReady(true)
      }
    }
    if (!mswReady) {
      init()
    }
  }, [mswReady])
  if (!mswReady) return null
  return <>{children}</>
}
