"use client"

import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"

export default function TestPage() {
  const { isLoaded, isSignedIn, user } = useUser()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Clerk Authentication Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Authentication Status</h2>
          <p>Loaded: {isLoaded ? "Yes" : "No"}</p>
          <p>Signed In: {isSignedIn ? "Yes" : "No"}</p>
          {user && (
            <p>Email: {user.primaryEmailAddress?.emailAddress}</p>
          )}
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Authentication Buttons</h2>
          <div className="flex gap-4">
            {!isSignedIn && (
              <>
                <SignInButton mode="modal">
                  <Button>Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button variant="outline">Sign Up</Button>
                </SignUpButton>
              </>
            )}
            {isSignedIn && (
              <div className="flex items-center gap-4">
                <UserButton afterSignOutUrl="/" />
                <p>You are signed in!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 