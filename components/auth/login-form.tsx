"use client";

import type React from "react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AtSign, Lock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { loginAsync, selectUser } from "@/redux/features/auth/authSlice";
type LoginFormInputs = {
  email: string;
  password: string;
};
export function LoginForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const onSubmit = (data: LoginFormInputs) => {
    setIsLoading(true);
    console.log(data);
    dispatch(loginAsync(data));
    setTimeout(() => {
      setIsLoading(false);
      // router.push("/dashboard");
    }, 1500);
  };
  return (
    <>
      {user && router.push("/dashboard")}
      <Card className="shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-sm mt-1 text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {/* <Link
                href="/forgot-password"
                className="text-sm text-green-600 hover:underline"
              >
                Forgot password?
              </Link> */}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  className="pl-10"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" },
                  })}
                />
                {errors.password && (
                  <p className="text-sm mt-1 text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-green-600 hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </>
  );
}
