"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"

type JoinEventButtonProps = {
  eventId: string
}

export default function JoinEventButton({ eventId }: JoinEventButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()

  const handleJoin = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=/events/${eventId}`)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/events/${eventId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to join event")
      }

      toast({
        title: "Success!",
        description: "You have successfully joined the event.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join the event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleJoin} 
      disabled={isLoading}
      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
    >
      {isLoading ? "Joining..." : "Join Event"}
    </Button>
  )
}