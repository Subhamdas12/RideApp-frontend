import React, { useState, useEffect } from "react";

// Function to get address from coordinates
const getAddressFromCoordinates = async (lat, lon) => {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
  );
  const data = await res.json();

  return data.results[0]?.formatted_address || "Unknown location";
};

// RidePlace component to display address based on coordinates
const RidePlace = ({ coordinates }) => {
  const [address, setAddress] = useState(""); // State to store the address

  useEffect(() => {
    const fetchAddress = async () => {
      if (coordinates && coordinates.length === 2) {
        const [lon, lat] = coordinates; // Destructure the coordinates

        const fetchedAddress = await getAddressFromCoordinates(lat, lon);

        setAddress(fetchedAddress); // Set the fetched address
      }
    };

    fetchAddress(); // Call the async function to fetch the address
  }, [coordinates]); // Effect depends on coordinates

  return <div>{address?.slice(0, 33) + "..." || "Loading..."}</div>; // Show address or "Loading..." while waiting
};

export default RidePlace;
