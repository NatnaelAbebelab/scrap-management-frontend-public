import { useAuth } from "./auth-context"
import { toastUtils } from "./toast-utils"
import APIFactory  from "./api-factory"
import { ApiError } from "@/utils/errors"

export async function authRequest<T>(
  apiCall: (accessToken: string) => Promise<T>
): Promise<T | null> {
  const { refreshAccessToken, logout } = useAuth()
  const token_ = localStorage.getItem("access_token")
  const refreshToken = localStorage.getItem("refresh_token")

  if (!token_ || !refreshToken) {
    logout()
    return null
  }

  try {
    return await apiCall(token_)
  } catch (error: any) {
    if (error.response?.status === 401) {
      // Access token might be expired — try refresh
      const refreshed = await refreshAccessToken(refreshToken)
      if (refreshed) {
        const newToken = localStorage.getItem("access_token")
        if (!newToken) {
          logout()
          return null
        }

        try {
          return await apiCall(newToken)
        } catch (err2) {
          // Still failing — logout
          logout()
          return null
        }
      } else {
        // Refresh failed — logout
        logout()
        return null
      }
    } else {
      throw error
    }
  }
}
