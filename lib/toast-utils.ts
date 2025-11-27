"use client"

import { toast } from "@/hooks/use-toast"

// Export the toastUtils object directly instead of a function
export const toastUtils = {
  /**
   * Show a success toast notification
   * @param title The title of the toast
   * @param description Optional description for the toast
   */
  success: (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "default",
      className: "bg-green-600 border-green-600 text-destructive-foreground dark:bg-green-600 dark:border-green-700 dark:text-destructive-foreground",
    })
  },

  /**
   * Show an error toast notification
   * @param title The title of the toast
   * @param description Optional description for the toast
   */
  error: (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "destructive",
    })
  },

  /**
   * Show a warning toast notification
   * @param title The title of the toast
   * @param description Optional description for the toast
   */
  warning: (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "default",
      className: "bg-yellow-600 border-yellow-600 text-destructive-foreground dark:bg-yellow-600 dark:border-yellow-700",
    })
  },

  /**
   * Show an info toast notification
   * @param title The title of the toast
   * @param description Optional description for the toast
   */
  info: (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "default",
    })
  },
}

// Keep the getToastUtils function for backward compatibility
export const getToastUtils = () => toastUtils
