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

export async function getMyRides(pagination: any) {
  try {
    const url = `${config.NEXT_APP_BACKEND_URL}/rider/getMyRides?pageOffset=${
      pagination.pageOffset - 1
    }&pageSize=${pagination.pageSize}`;

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
    console.error("Failed to fetch user rides:", error);

    toast.error(`Failed to fetch rides: ${error.message}`, {
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

export interface RideRequestDTO {
  pickupLocation: {
    coordinates: [number, number]; // [longitude, latitude]
  };
  dropoffLocation: {
    coordinates: [number, number];
  };
  paymentMethod: "CASH" | "WALLET";
}

export async function requestRide(rideRequest: RideRequestDTO) {
  try {
    const url = `${config.NEXT_APP_BACKEND_URL}/rider/requestRide`;
    console.log(rideRequest);
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(rideRequest),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok || result.apiError) {
      const errorMessage = result.apiError?.message || response.statusText;
      throw new Error(errorMessage);
    }

    return { data: result };
  } catch (error: any) {
    console.error("Failed to request ride:", error);

    toast.error(`Failed to request ride: ${error.message}`, {
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

export async function cancelRide(rideId) {
  try {
    const url = `${config.NEXT_APP_BACKEND_URL}/rider/cancelRide/${rideId}`;

    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok || result.apiError) {
      const errorMessage = result.apiError?.message || response.statusText;
      throw new Error(errorMessage);
    }

    toast.success("Ride cancelled successfully!", {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      transition: Bounce,
    });

    return { data: result };
  } catch (error) {
    console.error("Failed to cancel ride:", error);

    toast.error(`Failed to cancel ride: ${error.message}`, {
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
