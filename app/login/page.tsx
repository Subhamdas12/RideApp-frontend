import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-green-600">
            RideShare
          </Link>
          <p className="text-muted-foreground mt-1">Welcome back</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
