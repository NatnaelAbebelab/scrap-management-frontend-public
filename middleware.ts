import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  try {
    // Get the pathname of the request
    const path = request.nextUrl.pathname

    // Define public paths that don't require authentication
    // Note: Root path (/) is no longer considered public
    const isPublicPath = path.startsWith("/auth")

    // Check if user is authenticated
    // In a real implementation, you would verify the token
    // For now, we'll just check if the token exists
    const token = request.cookies.get("access_token")?.value

    // If the user is at the root path (/) and not authenticated,
    // redirect to login page
    if (path === "/" && !token) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    // If the path requires authentication and user is not authenticated,
    // redirect to login page
    if (!isPublicPath && !token) {
      // Create a URL for the login page
      const loginUrl = new URL("/auth/login", request.url)

      // You can add a redirect parameter to return to the original page after login
      loginUrl.searchParams.set("redirect", path)

      // Redirect to login page
      return NextResponse.redirect(loginUrl)
    }

    // If user is authenticated and trying to access login page,
    // redirect to home page
    if (path.startsWith("/auth") && token) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // Continue with the request
    return NextResponse.next()

  } catch (error) {
    console.error("Middleware error:", error)
    // In case of any error, continue with the request
    // Let the client-side auth handle any issues
    return NextResponse.next()
  }
}

// Configure the middleware to run on specific paths
export const config = {
  // Apply this middleware to all routes except for static files, api routes, etc.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
}
