import { SidebarTrigger } from "@/src/shadcn/components/ui/sidebar"
import AppSidebar from "@/src/template/sidebar/AppSidebar"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Providers from "@/src/shared/Providers"
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
        <Providers>
          <AppSidebar />
          <div className="flex flex-col h-svh w-full overflow-x-hidden">
            <div className="flex-grow-0 border-b">
              <SidebarTrigger />
            </div>
            {children}
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
