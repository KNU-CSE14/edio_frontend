"use client"
import { getBaseUrl } from "@/src/shared/util/data/common"

/// TODO: 공통 버튼 생성 후 스타일 적용
export default function LoginButton() {
  const googleLogin = () => {
    window.location.href = `${getBaseUrl("/oauth2/authorization/google")}/oauth2/authorization/google?state=${window.location.href}`
  }
  return <button onClick={googleLogin}>Login</button>
}
