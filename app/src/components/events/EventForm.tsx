"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AdminEventDialog } from "@/components/admin/AdminEventDialog"
import { useToast } from "@/components/ui/use-toast"

export default function EventForm() {
  const [open, setOpen] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const handleSave = async (formData: FormData) => {
    try {
      // Set default values for user-created events
      formData.set('status', 'UPCOMING') // All user-created events start as upcoming
      formData.set('isPromoted', 'false') // Only admins can promote events

      const response = await fetch("/api/admin/events", {
        method: "POST",
        body: formData, // Send FormData directly
      })

      if (!response.ok) {
        throw new Error("Failed to create event")
      }

      const result = await response.json()
      toast({
        title: "Success!",
        description: "Event created successfully.",
      })
      router.push(`/events/${result.id}`)
    } catch (error) {
      console.error("Error creating event:", error)
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      })
      throw error // Re-throw to let AdminEventDialog handle the error state
    }
  }

  return (
    <AdminEventDialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (!isOpen) {
          router.push("/events")
        }
      }}
      event={null}
      onSave={handleSave}
    />
  )
}