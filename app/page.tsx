"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/auth/authSlice";

export default function Home() {
  const router = useRouter();
  const user = useSelector(selectUser);
  return (
    <>
      {user && router.push("/dashboard")}
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="w-full shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-green-600">
                RideShare
              </CardTitle>
              <CardDescription>
                Your on-demand ride sharing platform
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex justify-center mb-4">
                <div className="w-32 h-32 bg-green-200 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-600"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
              </div>
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/login">Login</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <Link href="/signup">Sign Up</Link>
              </Button>
            </CardContent>
            <CardFooter className="text-center text-sm text-muted-foreground">
              Join thousands of riders and drivers on our platform
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
