"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Package } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toastUtils } from "@/lib/toast-utils"
import APIFactory  from "@/lib/api-factory"
import { useAuth } from "@/lib/auth-context"
import { ApiError } from "@/utils/errors"
import { capitalizeFirst } from "@/utils/stringFormatter"
import { handleAuthRedirect } from "@/lib/auth-redirect"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate inputs
      if (!email.trim()) {
        toastUtils.warning("Email required", "Please enter your email address")
        setIsLoading(false)
        return
      }

      if (!password) {
        toastUtils.warning("Password required", "Please enter your password")
        setIsLoading(false)
        return
      }

      // Call centralized API factory : { data?: { tokens: { access: string; refresh: string }; logged_user: string; role: string }; error?: string; status?: number }
      const result = await APIFactory.auth.login(email, password)

      if (result.error || !result.data) {
        throw new ApiError(result.error || "Login failed. Please check your credentials.", result.status ?? 400)
      }

      // Use the auth context login function to handle token storage and user setting
      const success = await login(email, password)

      if (success) {
        toastUtils.success("Login successful", "Welcome to the Scrap Management System")
        handleAuthRedirect(router, "/")
      }
      else {
        throw new ApiError(result.error || "Login failed. Please check your credentials.", result.status ?? 400)
      }

    } catch (error) {
      if (error instanceof ApiError) {
        toastUtils.error(`LOGIN FAILED (${error.status})`, error instanceof Error ? capitalizeFirst(error.message) : "Please check your credentials and try again")
      } else {
        toastUtils.error("Unexpected error", "Something went wrong")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Package className="h-10 w-10 text-brand" />
          </div>
          <CardTitle className="text-2xl font-bold">Scrap Management System</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/auth/forgot-password" className="text-xs text-brand hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
