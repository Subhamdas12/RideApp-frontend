"use client";

import { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import {
  cancelRideAsync,
  requestRideAsync,
  selectCurrentRide,
  setCurrentRide,
} from "@/redux/features/rider/riderSlice";
import { selectUser } from "@/redux/features/auth/authSlice";
import connectSocket from "@/utils/socket";

export function RiderDashboard() {
  const dispatch = useDispatch();
  const currentRide = useSelector(selectCurrentRide);
  const user = useSelector(selectUser);
  const [activeRide, setActiveRide] = useState<null | {
    id: string;
    status: string;
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
    paymentMethod: "CASH" | "WALLET";
    otp: string;
  }>(null);

  useEffect(() => {
    if (!user?.id) return;

    const subscriptions = [
      {
        topic: `/topic/rider/rideAccepted/${user.id}`,
        callback: (msg: string) => {
          console.log(msg);
          dispatch(setCurrentRide(msg));
        },
      },
      {
        topic: `/topic/rider/rideStart/${user.id}`,
        callback: (msg: string) => {
          dispatch(setCurrentRide(msg));
        },
      },
      {
        topic: `/topic/rider/rideEnd/${user.id}`,
        callback: (msg: string) => {
          dispatch(setCurrentRide(msg));
        },
      },
      {
        topic: `/topic/rider/rideCancel/${user.id}`,
        callback: (msg: string) => {
          dispatch(setCurrentRide(msg));
        },
      },
    ];

    const client = connectSocket({ subscriptions });

    return () => {
      client.deactivate();
    };
  }, [user?.id, dispatch]);

  const handleRequestRide = (
    pickup: string,
    destination: string,
    pickupLocation: [number, number],
    destinationLocation: [number, number],
    paymentMethod: "CASH" | "WALLET"
  ) => {
    const rideRequest = {
      pickupLocation: {
        coordinates: pickupLocation,
      },
      dropoffLocation: {
        coordinates: destinationLocation,
      },
      paymentMethod,
    };
    dispatch(requestRideAsync(rideRequest));

    // Simulate ride request with coordinates
    // setActiveRide({
    //   id: Math.random().toString(36).substring(7),
    //   status: "searching",
    //   pickup,
    //   destination,
    //   estimatedTime: "10-15 min",
    //   estimatedPrice: "$12-15",
    //   pickupLocation,
    //   destinationLocation,
    //   paymentMethod,
    // });

    // // Simulate driver accepting after 3 seconds
    // setTimeout(() => {
    //   setActiveRide((prev) => {
    //     if (!prev) return null;
    //     return {
    //       ...prev,
    //       status: "accepted",
    //       driver: {
    //         name: "Michael Chen",
    //         rating: 4.8,
    //         car: "Toyota Camry (White)",
    //         licensePlate: "ABC 123",
    //       },
    //       driverLocation: [88.4194, 27.7749], // Driver's initial location
    //     };
    //   });
    // }, 3000);
  };

  useEffect(() => {
    // {
    //   id: 20,
    //   pickupLocation: {
    //     coordinates: [
    //       88.4390171,
    //       26.6881096
    //     ],
    //     type: "Point"
    //   },
    //   dropoffLocation: {
    //     coordinates: [
    //       87.4900588,
    //       25.7841477
    //     ],
    //     type: "Point"
    //   },
    //   createdTime: "2025-04-16T21:09:04.284928",
    //   rider: {
    //     id: 3,
    //     user: {
    //       id: 3,
    //       name: "John Doe",
    //       email: "email@gmail.com",
    //       roles: [
    //         "RIDER"
    //       ]
    //     },
    //     rating: 0
    //   },
    //   driver: {
    //     id: 1,
    //     user: {
    //       id: 2,
    //       name: "Subham Das",
    //       email: "hey@email.com",
    //       roles: [
    //         "DRIVER",
    //         "RIDER"
    //       ]
    //     },
    //     isAvailable: false,
    //     rating: 0,
    //     vehicleId: "122VB897345"
    //   },
    //   paymentMethod: "CASH",
    //   rideStatus: "CONFIRMED",
    //   otp: "3758",
    //   fare: 1714.352,
    //   startedAt: null,
    //   endedAt: null
    // }

    if (currentRide) {
      setActiveRide({
        id: currentRide?.id,
        status: mapRideStatus(currentRide?.rideStatus),
        pickup: "123 Main St siliguri",
        destination: "456 Market St siliguri",
        estimatedTime: "10-15 min",
        estimatedPrice: currentRide?.fare,
        pickupLocation: currentRide?.pickupLocation?.coordinates,
        destinationLocation: currentRide?.dropoffLocation?.coordinates,
        paymentMethod: currentRide?.paymentMethod,
        driver: currentRide?.driver,
        driverLocation: [88.4194, 27.7749],
        otp: currentRide?.otp,
      });
    }
  }, [currentRide]);

  const handleCancelRide = () => {
    dispatch(cancelRideAsync(currentRide?.id));
    setActiveRide(null);
  };

  const mapRideStatus = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "accepted";
      case "ONGOING":
        return "in_progress";
      case "ENDED":
        return "completed";
      case "CANCELLED":
        return "cancelled";
      default:
        return "searching";
    }
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
