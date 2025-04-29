"use client"

import { SidebarProvider } from "@/src/shadcn/components/ui/sidebar"
import MSWProvider from "@/src/shared/MswProvider"
import QueryProvider from "@/src/shared/QueryProvider"
import { Provider } from "jotai"
import { OverlayProvider } from "overlay-kit"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MSWProvider>
      <QueryProvider>
        <Provider>
          <SidebarProvider>
            <OverlayProvider>{children}</OverlayProvider>
          </SidebarProvider>
        </Provider>
      </QueryProvider>
    </MSWProvider>
  )
}
