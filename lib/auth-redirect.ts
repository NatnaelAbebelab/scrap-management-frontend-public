"use client"

/**
 * Handles redirection after authentication
 * @param router Next.js router
 * @param defaultPath Default path to redirect to if no redirect parameter is found
 */
export function handleAuthRedirect(router: any, defaultPath = "/"): void {
  // Check if we have a redirect parameter in the URL
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search)
    const redirectPath = urlParams.get("redirect")

    if (redirectPath) {
      // Validate the redirect path to prevent open redirect vulnerabilities
      // Only allow relative paths that start with / and don't contain protocol or domain
      if (redirectPath.startsWith("/") && !redirectPath.includes("://")) {
        router.push(redirectPath)
        return
      }
    }
  }

  // Default redirect if no valid redirect parameter
  router.push(defaultPath)
}
