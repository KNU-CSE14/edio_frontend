import {
  SidebarProvider,
  SidebarTrigger,
} from "@/src/shadcn/components/ui/sidebar"
import MSWProvider from "@/src/shared/MswProvider"
import QueryProvider from "@/src/shared/QueryProvider"
import AppSidebar from "@/src/template/sidebar/AppSidebar"
import { Provider } from "jotai"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/src/shadcn/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MSWProvider>
          <QueryProvider>
            <Provider>
              <SidebarProvider>
                <AppSidebar />
                <div className="flex flex-col h-svh w-full">
                  <div className="flex-grow-0 border-b">
                    <SidebarTrigger />
                  </div>
                  {children}
                </div>
              </SidebarProvider>
              <Toaster />
            </Provider>
          </QueryProvider>
        </MSWProvider>
      </body>
    </html>
  )
}
