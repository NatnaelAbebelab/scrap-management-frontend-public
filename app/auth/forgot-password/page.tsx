"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Package } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toastUtils } from "@/lib/toast-utils"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!email.trim()) {
      toastUtils.warning("Email required", "Please enter your email address")
      return
    }

    setIsLoading(true)

    try {
      // This is where you would implement actual password reset request
      // For now, we'll just simulate a successful request

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, let's show an error for a specific email
      if (email === "unknown@example.com") {
        toastUtils.info("Reset link sent", "If your email exists in our system, you will receive a password reset link")
        setIsLoading(false)
        return
      }

      setIsSubmitted(true)

      toastUtils.success(
        "Reset link sent",
        "If your email exists in our system, you will receive a password reset link",
      )
    } catch (error) {
      toastUtils.error(
        "Request failed",
        error instanceof Error ? error.message : "There was an error processing your request. Please try again.",
      )
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
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription>
            {isSubmitted ? "Check your email for a reset link" : "Enter your email and we'll send you a reset link"}
          </CardDescription>
        </CardHeader>
        {!isSubmitted ? (
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
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
              <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Remember your password?{" "}
                <Link href="/auth/login" className="text-brand hover:underline">
                  Back to login
                </Link>
              </p>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="space-y-4">
            <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
              <p className="text-sm text-green-800 dark:text-green-300">
                If your email exists in our system, you will receive a password reset link shortly.
              </p>
            </div>
            <Button asChild className="w-full mt-4">
              <Link href="/auth/login">Back to Login</Link>
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
