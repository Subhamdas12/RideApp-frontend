import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Car, User } from "lucide-react"

interface RoleSwitcherProps {
  role: "rider" | "driver"
  setRole: (role: "rider" | "driver") => void
}

export function RoleSwitcher({ role, setRole }: RoleSwitcherProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <User className={`h-5 w-5 ${role === "rider" ? "text-green-600" : "text-gray-400"}`} />
          <Label htmlFor="role-switch" className="font-medium">
            Rider
          </Label>
        </div>
        <Switch
          id="role-switch"
          checked={role === "driver"}
          onCheckedChange={(checked) => setRole(checked ? "driver" : "rider")}
          className="data-[state=checked]:bg-green-600"
        />
        <div className="flex items-center space-x-2">
          <Label htmlFor="role-switch" className="font-medium">
            Driver
          </Label>
          <Car className={`h-5 w-5 ${role === "driver" ? "text-green-600" : "text-gray-400"}`} />
        </div>
      </div>
    </div>
  )
}
