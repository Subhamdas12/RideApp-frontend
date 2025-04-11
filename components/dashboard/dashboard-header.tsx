"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutAsync, selectUser } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function DashboardHeader({ role }) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleLogout = () => {
    setIsMenuOpen(false);
    dispatch(logoutAsync());
    router.push("/");
  };

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="text-xl font-bold text-green-600"
            >
              RideShare
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              className="p-0 rounded-full overflow-hidden"
            >
              <Image
                src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                alt="User avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
            </Button>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full p-0 overflow-hidden"
                >
                  <Avatar className="h-8 w-8 w-full h-full">
                    <AvatarImage
                      src="https://ui-avatars.com/api/?name=Subham&background=random"
                      alt="User avatar"
                      className="object-cover"
                    />
                    <AvatarFallback>SD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  {role == "rider" ? (
                    <Link href="/profile/rider" className="w-full">
                      Profile
                    </Link>
                  ) : (
                    <Link href="/profile/driver" className="w-full">
                      Profile
                    </Link>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings" className="w-full">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div
                    className="w-full text-red-700 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-3 space-y-2">
            <Link
              href="/profile"
              className="block px-3 py-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
            <Link
              href="/settings"
              className="block px-3 py-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Settings
            </Link>
            <div
              className="block px-3 py-2 rounded-md hover:bg-gray-100"
              onClick={handleLogout}
            >
              Logout
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
