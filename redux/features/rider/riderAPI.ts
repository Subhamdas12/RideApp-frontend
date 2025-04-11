import config from "@/config/config";
import { Bounce, toast } from "react-toastify";

export async function getMyProfile() {
  try {
    const url = `${config.NEXT_APP_BACKEND_URL}/rider/getMyProfile`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();

    if (!response.ok || result.apiError) {
      const errorMessage = result.apiError?.message || response.statusText;
      throw new Error(errorMessage);
    }

    return { data: result.data };
  } catch (error) {
    console.error("Failed to fetch user profile:", error);

    toast.error(`Failed to fetch profile: ${error.message}`, {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      transition: Bounce,
    });

    return { error: error.message };
  }
}
