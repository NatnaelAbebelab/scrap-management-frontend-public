import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export const useAuthRedirect = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) {
        router.push("/auth/login")
    } else {
      setLoading(false)
    }
  }, [])

  return loading
}