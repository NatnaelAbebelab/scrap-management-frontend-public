"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toastUtils } from "@/lib/toast-utils"

export function ToastDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Toast Notifications</CardTitle>
        <CardDescription>Click the buttons below to see different types of toast notifications</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        <Button
          onClick={() => toastUtils.success("Success", "Operation completed successfully")}
          className="bg-green-600 hover:bg-green-700"
        >
          Success Toast
        </Button>
        <Button
          onClick={() => toastUtils.error("Error", "Something went wrong")}
          className="bg-red-600 hover:bg-red-700"
        >
          Error Toast
        </Button>
        <Button
          onClick={() => toastUtils.warning("Warning", "Please be careful")}
          className="bg-yellow-600 hover:bg-yellow-700"
        >
          Warning Toast
        </Button>
        <Button onClick={() => toastUtils.info("Information", "Here's some information")}>Info Toast</Button>
      </CardContent>
    </Card>
  )
}
