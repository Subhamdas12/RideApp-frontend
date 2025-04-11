"use client";

import { useState } from "react";
import { RideRequestForm } from "@/components/rides/ride-request-form";
import { ActiveRide } from "@/components/rides/active-ride";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, MapPin } from "lucide-react";
import { RideHistory } from "@/components/rides/ride-history";

export function RiderDashboard() {
  const [activeRide, setActiveRide] = useState<null | {
    id: string;
    status: "searching" | "accepted" | "in_progress" | "completed";
    driver?: {
      name: string;
      rating: number;
      car: string;
      licensePlate: string;
    };
    pickup: string;
    destination: string;
    estimatedTime: string;
    estimatedPrice: string;
    pickupLocation: [number, number];
    destinationLocation: [number, number];
    driverLocation?: [number, number];
    routeCoordinates?: Array<[number, number]>;
  }>(null);

  const handleRequestRide = (
    pickup: string,
    destination: string,
    pickupLocation: [number, number],
    destinationLocation: [number, number]
  ) => {
    // Simulate ride request with coordinates
    setActiveRide({
      id: Math.random().toString(36).substring(7),
      status: "searching",
      pickup,
      destination,
      estimatedTime: "10-15 min",
      estimatedPrice: "$12-15",
      pickupLocation,
      destinationLocation,
    });

    // Simulate driver accepting after 3 seconds
    setTimeout(() => {
      setActiveRide((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: "accepted",
          driver: {
            name: "Michael Chen",
            rating: 4.8,
            car: "Toyota Camry (White)",
            licensePlate: "ABC 123",
          },
          driverLocation: [-122.4194, 37.7749], // Driver's initial location
        };
      });
    }, 3000);
  };

  const handleCancelRide = () => {
    setActiveRide(null);
  };

  return (
    <div className="space-y-6">
      {activeRide ? (
        <ActiveRide ride={activeRide} onCancel={handleCancelRide} />
      ) : (
        <>
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Request a Ride</CardTitle>
              <CardDescription>
                Enter your pickup location and destination
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RideRequestForm onSubmit={handleRequestRide} />
            </CardContent>
          </Card>

          <RideHistory userType="rider" />
        </>
      )}
    </div>
  );
}

const recentRides = [
  {
    id: "1",
    date: "Today, 2:30 PM",
    destination: "Downtown Mall",
    price: "$12.50",
  },
  {
    id: "2",
    date: "Yesterday, 9:15 AM",
    destination: "Airport Terminal B",
    price: "$34.20",
  },
  {
    id: "3",
    date: "Apr 12, 6:45 PM",
    destination: "Central Park",
    price: "$8.75",
  },
];
