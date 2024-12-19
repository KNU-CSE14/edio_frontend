"use client"
import { Button } from "@/src/shadcn/components/ui/button"
import { getBaseUrl } from "@/src/shared/util/data/common"

export default function LoginButton() {
  const googleLogin = () => {
    window.location.href = `${getBaseUrl("/oauth2/authorization/google")}/oauth2/authorization/google?state=${window.location.href}`
  }
  return (
    <Button className="w-full" variant={"outline"} onClick={googleLogin}>
      Login
    </Button>
  )
}
