"use client";

import { useEffect, useRef } from "react";
import { sendDriverLocation, default as connectSocket } from "@/utils/socket";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/auth/authSlice";

const TestingPage = () => {
  const user = useSelector(selectUser);
  const locationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    // Connect WebSocket on mount
    const client = connectSocket(user.id, (msg) => {
      console.log("Message received by driver:", msg);
    });

    // Start sending location periodically
    if ("geolocation" in navigator) {
      locationIntervalRef.current = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log("Sending driver's location", latitude, longitude);

            // Send location to backend
            sendDriverLocation(user.id, latitude, longitude);
          },
          (error) => {
            console.error("Geolocation error:", error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      }, 5000); // every 5 seconds
    } else {
      console.error("Geolocation not supported");
    }

    // Cleanup on unmount
    return () => {
      if (locationIntervalRef.current)
        clearInterval(locationIntervalRef.current);
      client.deactivate();
    };
  }, [user?.id]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">Ride Location Tracking</h2>
      <p className="text-sm text-gray-600">
        Sending driver location every 5 seconds...
      </p>
    </div>
  );
};

export default TestingPage;
