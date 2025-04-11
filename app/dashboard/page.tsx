"use client";

import { useState } from "react";
import { RoleSwitcher } from "@/components/dashboard/role-switcher";
import { RiderDashboard } from "@/components/dashboard/rider-dashboard";
import { DriverDashboard } from "@/components/dashboard/driver-dashboard";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { selectUser } from "@/redux/features/auth/authSlice";
import { useSelector } from "react-redux";

export default function DashboardPage() {
  const [role, setRole] = useState<"rider" | "driver">("rider");
  const user = useSelector(selectUser);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader role={role} />
      <div className="flex-1 container mx-auto p-4 max-w-6xl">
        {user?.roles?.includes("DRIVER") && (
          <RoleSwitcher role={role} setRole={setRole} />
        )}

        <div className="mt-6">
          {role === "rider" ? <RiderDashboard /> : <DriverDashboard />}
        </div>
      </div>
    </div>
  );
}
