"use client";
import {
  getMyProfileAsync,
  selectRider,
} from "@/redux/features/rider/riderSlice";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function RiderProfilePage() {
  const dispatch = useDispatch();
  const riderProfile = useSelector(selectRider);
  useEffect(() => {
    dispatch(getMyProfileAsync());
  }, [dispatch]);

  console.log(riderProfile);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                className="text-xl font-bold text-green-600"
                href="/dashboard"
              >
                RideShare
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto p-4 max-w-6xl">
        <div className="mt-6">
          <div className="space-y-6">
            <div className="rounded-lg border bg-white shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-semibold">Rider Profile</h2>
                <p className="text-sm text-muted-foreground">
                  Your rider account information
                </p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    value={riderProfile?.user?.name}
                    className="mt-1 block w-full border rounded-md px-3 py-2 text-sm"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={riderProfile?.user?.email}
                    className="mt-1 block w-full border rounded-md px-3 py-2 text-sm"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Rating</label>
                  <input
                    type="email"
                    value={riderProfile?.rating}
                    className="mt-1 block w-full border rounded-md px-3 py-2 text-sm"
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
