import Link from "next/link"
import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-green-600">
            RideShare
          </Link>
          <p className="text-muted-foreground mt-1">Create your account</p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
