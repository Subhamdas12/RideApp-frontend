import config from "@/config/config";
import { Bounce, toast } from "react-toastify";

export async function signup(userDetails) {
  try {
    const url = `${config.NEXT_APP_BACKEND_URL}/auth/signup`;

    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(userDetails),
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();

    if (!response.ok || result.apiError) {
      const errorMessage = result.apiError?.message || response.statusText;
      throw new Error(errorMessage);
    }

    toast.success("Signup successful!", {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      transition: Bounce,
    });

    return { data: result.data };
  } catch (error) {
    console.error("Failed to signup user:", error);

    toast.error(`Failed to signup: ${error.message}`, {
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

export async function login(credentials) {
  try {
    const url = `${config.NEXT_APP_BACKEND_URL}/auth/login`;

    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(credentials),
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();

    if (!response.ok || result.apiError) {
      const errorMessage = result.apiError?.message || response.statusText;
      throw new Error(errorMessage);
    }

    toast.success("Login successful!", {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      transition: Bounce,
    });

    return { data: result.data };
  } catch (error) {
    console.error("Failed to login user:", error);

    toast.error(`Failed to login: ${error.message}`, {
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

export async function refreshToken() {
  try {
    const url = `${config.NEXT_APP_BACKEND_URL}/auth/refresh`;

    const response = await fetch(url, {
      method: "POST",
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
    console.error("Failed to refresh token:", error);

    return { error: error.message };
  }
}

export async function logout() {
  try {
    const url = `${config.NEXT_APP_BACKEND_URL}/auth/logout`;

    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();

    if (!response.ok || result.apiError) {
      const errorMessage = result.apiError?.message || response.statusText;
      throw new Error(errorMessage);
    }

    toast.success("Logout successful!", {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      transition: Bounce,
    });

    return { data: result.data };
  } catch (error) {
    console.error("Failed to logout user:", error);

    toast.error(`Failed to logout: ${error.message}`, {
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
