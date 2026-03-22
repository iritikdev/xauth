"use client"

import { useState } from "react"
import UserProfileForm from "@/components/user-profile"
import UserProfileSummary from "@/components/profile-summary"
import { useUser } from "@/hooks/use-user"
import { useSession } from "next-auth/react"

export default function ProfilePage() {
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  
  const username = (session?.user as any)?.username
  const { data: userData, isLoading } = useUser(username)

  if (isLoading) return <div>Loading Profile...</div>

  return (
    <div className="container">
      {isEditing ? (
        // Show the Form when editing
        <UserProfileForm 
          
        />
      ) : (
        // Show the Summary by default
        <UserProfileSummary 
          userData={userData} 
          onEdit={() => setIsEditing(true)} 
        />
      )}
    </div>
  )
}