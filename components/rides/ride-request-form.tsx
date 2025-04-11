"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation } from "lucide-react";
import { GooglePlacesAutocomplete } from "@/components/location/google-places-autocomplete";
import { OpenLayersMap } from "@/components/map/open-layers-map";
import { fetchRoute } from "@/lib/routing";

interface RideRequestFormProps {
  onSubmit: (
    pickup: string,
    destination: string,
    pickupLocation: [number, number],
    destinationLocation: [number, number]
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
      onSubmit(pickup, destination, pickupLocation, destinationLocation);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pickup">Pickup Location</Label>
        <GooglePlacesAutocomplete
          placeholder="Enter pickup address"
          value={pickup}
          onChange={setPickup}
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

      {pickupLocation && destinationLocation && (
        <div className="mt-4 mb-4">
          <OpenLayersMap
            riderLocation={pickupLocation}
            destinationLocation={destinationLocation}
            height="200px"
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
