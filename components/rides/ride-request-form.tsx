"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation } from "lucide-react";
import { GooglePlacesAutocomplete } from "@/components/location/google-places-autocomplete";
import { OpenLayersMap } from "@/components/map/open-layers-map";
import { fetchRoute } from "@/lib/routing";
import RideFare from "./ride-fare";

interface RideRequestFormProps {
  onSubmit: (
    pickup: string,
    destination: string,
    pickupLocation: [number, number],
    destinationLocation: [number, number],
    paymentMethod: "CASH" | "WALLET"
  ) => void;
}

export function RideRequestForm({ onSubmit }: RideRequestFormProps) {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupLocation, setPickupLocation] = useState<[number, number] | null>(
    null
  );
  const [destinationLocation, setDestinationLocation] = useState<
    [number, number] | null
  >(null);
  const [routeCoordinates, setRouteCoordinates] = useState<Array<
    [number, number]
  > | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "WALLET">("CASH");
  const togglePaymentMethod = () => {
    setPaymentMethod((prev) => (prev === "CASH" ? "WALLET" : "CASH"));
  };

  const handlePickupSelect = (place: {
    address: string;
    location: [number, number];
  }) => {
    setPickup(place.address);
    setPickupLocation(place.location);
    updateRoute(place.location, destinationLocation);
  };

  const handleDestinationSelect = (place: {
    address: string;
    location: [number, number];
  }) => {
    setDestination(place.address);
    setDestinationLocation(place.location);
    updateRoute(pickupLocation, place.location);
  };

  const updateRoute = async (
    start: [number, number] | null,
    end: [number, number] | null
  ) => {
    if (!start || !end) return;

    try {
      const route = await fetchRoute(start, end);
      setRouteCoordinates(route);
    } catch (error) {
      console.error("Failed to fetch route:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup || !destination || !pickupLocation || !destinationLocation)
      return;

    setIsLoading(true);

    // Ensure we have the route
    if (!routeCoordinates) {
      try {
        const route = await fetchRoute(pickupLocation, destinationLocation);
        setRouteCoordinates(route);
      } catch (error) {
        console.error("Failed to fetch route:", error);
      }
    }

    // Simulate loading
    setTimeout(() => {
      onSubmit(
        pickup,
        destination,
        pickupLocation,
        destinationLocation,
        paymentMethod
      );
      setIsLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pickup">Pickup Location</Label>
        <GooglePlacesAutocomplete
          value={pickup}
          onChange={setPickup}
          placeholder="Enter pickup address"
          onPlaceSelect={handlePickupSelect}
          required
          icon={<MapPin />}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="destination">Destination</Label>
        <GooglePlacesAutocomplete
          placeholder="Enter destination address"
          value={destination}
          onChange={setDestination}
          onPlaceSelect={handleDestinationSelect}
          required
          icon={<MapPin />}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="destination">Payment Method</Label>
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <span
              className={`font-semibold ${
                paymentMethod === "CASH" ? "text-green-500" : "text-gray-400"
              }`}
            >
              CASH
            </span>

            <button
              id="payment-switch"
              onClick={togglePaymentMethod}
              type="button"
              className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                paymentMethod === "WALLET" ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                  paymentMethod === "WALLET" ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>

            <span
              className={`font-semibold ${
                paymentMethod === "WALLET" ? "text-green-500" : "text-gray-400"
              }`}
            >
              WALLET
            </span>
          </div>
        </div>
        <RideFare
          pickupLocation={pickupLocation}
          destinationLocation={destinationLocation}
        ></RideFare>
      </div>

      {pickupLocation && destinationLocation && (
        <div className="mt-4 mb-4">
          <OpenLayersMap
            riderLocation={pickupLocation}
            destinationLocation={destinationLocation}
            height="200px"
            showDriver={false}
            routeCoordinates={routeCoordinates || undefined}
          />
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700"
        disabled={
          isLoading ||
          !pickup ||
          !destination ||
          !pickupLocation ||
          !destinationLocation
        }
      >
        {isLoading ? "Finding drivers..." : "Request Ride"}
      </Button>
    </form>
  );
}
