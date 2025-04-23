import config from "@/config/config";
import { Bounce, toast } from "react-toastify";

export async function getMyProfile() {
  try {
    const url = `${config.NEXT_APP_BACKEND_URL}/driver/getMyProfile`;

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
    const url = `${config.NEXT_APP_BACKEND_URL}/driver/getMyRides?pageOffset=${
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

export async function setDriverAvailability(isAvailable: Boolean) {
  try {
    const url = `${config.NEXT_APP_BACKEND_URL}/driver/setDriverAvailibility`;
    const driverAvailability = { isAvailable };

    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(driverAvailability),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok || result.apiError) {
      const errorMessage = result.apiError?.message || response.statusText;
      throw new Error(errorMessage);
    }

    toast.success("Set driver availability successful!", {
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
  } catch (error: any) {
    console.error("Failed to set driver availability:", error);

    toast.error(`Failed to set driver availability: ${error.message}`, {
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

export async function acceptRide(rideRequestId) {
  try {
    const url = `${config.NEXT_APP_BACKEND_URL}/driver/acceptRide/${rideRequestId}`;

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

    toast.success("Ride accepted successfully!", {
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
  } catch (error: any) {
    console.error("Failed to accept ride:", error);

    toast.error(`Failed to accept ride: ${error.message}`, {
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
    const url = `${config.NEXT_APP_BACKEND_URL}/driver/cancelRide/${rideId}`;

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

export async function startRide(rideId, rideStartDTO) {
  try {
    const url = `${config.NEXT_APP_BACKEND_URL}/driver/startRide/${rideId}`;

    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rideStartDTO), // Send the ride start details in request body
    });

    const result = await response.json();

    if (!response.ok || result.apiError) {
      const errorMessage = result.apiError?.message || response.statusText;
      throw new Error(errorMessage);
    }

    toast.success("Ride started successfully!", {
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
    console.error("Failed to start ride:", error);

    toast.error(`Failed to start ride: ${error.message}`, {
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

export async function endRide(rideId) {
  try {
    const url = `${config.NEXT_APP_BACKEND_URL}/driver/endRide/${rideId}`;

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

    toast.success("Ride ended successfully!", {
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
    console.error("Failed to end ride:", error);

    toast.error(`Failed to end ride: ${error.message}`, {
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
