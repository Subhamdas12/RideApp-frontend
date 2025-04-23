import config from "@/config/config";
import React, { useEffect, useState } from "react";

const RideFare = ({ pickupLocation, destinationLocation }) => {
  console.log("hjeeh");
  const [fare, setFare] = useState(null);
  const getRideFare = async () => {
    const rideRequest = {
      pickupLocation: {
        coordinates: pickupLocation,
      },
      dropoffLocation: {
        coordinates: destinationLocation,
      },
    };
    try {
      const response = await fetch(
        `${config.NEXT_APP_BACKEND_URL}/rider/getPricing`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rideRequest),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch pricing");
      }

      const data = await response.json();
      console.log(data.data);
      setFare(data.data);
    } catch (error) {
      console.error("Failed to fetch ride fare:", error);
    }
  };

  useEffect(() => {
    console.log(pickupLocation, "pickupLocation ");
    console.log(destinationLocation, "dropOffLocation ");
    if (pickupLocation && destinationLocation) {
      getRideFare();
    }
  }, [pickupLocation, destinationLocation]);
  return (
    <div className="flex flex-col items-center text-green-500 uppercase">
      {fare && "TOTAL AMOUNT:"}
      {fare
        ? `₹${Number(fare).toFixed(3)}`
        : pickupLocation && destinationLocation
        ? "Calculating..."
        : ""}
    </div>
  );
};

export default RideFare;
