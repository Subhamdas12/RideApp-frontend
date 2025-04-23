"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  Navigation,
  Phone,
  Star,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { OpenLayersMap } from "@/components/map/open-layers-map";
import { RideHistory } from "@/components/rides/ride-history";
import { fetchRoute } from "@/lib/routing";
import { useDispatch, useSelector } from "react-redux";
import {
  acceptRideAsync,
  addRideRequest,
  cancelRideAsync,
  endRideAsync,
  selectDriverCurrentRide,
  selectRideRequests,
  setDriverAvailabilityAsync,
  startRideAsync,
} from "@/redux/features/driver/driverSlice";
import { selectUser } from "@/redux/features/auth/authSlice";
import connectSocket, { sendDriverLocation } from "@/utils/socket";
import RidePlace from "../rides/ride-place";
import DashboardLocationSender from "./dashboard-location-send";

export function DriverDashboard() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const rideRequestList = useSelector(selectRideRequests);
  const currentRideDriver = useSelector(selectDriverCurrentRide);
  const [isOnline, setIsOnline] = useState(false);
  const [activeRide, setActiveRide] = useState<null | {
    id: string;
    status: "requested" | "accepted" | "in_progress" | "completed";
    rider: {
      name: string;
      rating: number;
    };
    pickup: string;
    destination: string;
    estimatedTime: string;
    estimatedPrice: string;
    pickupLocation: [number, number];
    destinationLocation: [number, number];
    driverLocation: [number, number];
    routeCoordinates?: Array<[number, number]>;
  }>(null);
  const [rideRequests, setRideRequests] = useState<
    Array<{
      id: string;
      rider: {
        name: string;
        rating: number;
      };
      pickup: string;
      destination: string;
      estimatedTime: string;
      estimatedPrice: string;
      pickupLocation: [number, number];
      destinationLocation: [number, number];
      routeCoordinates?: Array<[number, number]>;
    }>
  >([]);

  // Driver's current location - in a real app, this would come from geolocation
  const [driverLocation, setDriverLocation] = useState<[number, number]>([
    88.4211712,
    26.7124736, // default to San Francisco
  ]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    const updateLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setDriverLocation([longitude, latitude]); // longitude, latitude format
        },
        (err) => {
          setError(`Error: ${err.message}`);
        }
      );
    };

    // Initial call
    updateLocation();

    // // Set up polling every 10 seconds
    // const interval = setInterval(updateLocation, 10000);

    // // Cleanup on unmount
    // return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const subscriptions = [
      {
        topic: `/topic/driver/requestRide/${user.id}`,
        callback: (msg: string) => {
          console.log("This is working");
          dispatch(addRideRequest(msg));
          // alert(msg);
        },
      },
    ];

    const client = connectSocket({ subscriptions });

    return () => {
      client.deactivate();
    };
  }, [user?.id, dispatch]);

  const handleGoOnline = () => {
    setIsOnline(true);
    dispatch(setDriverAvailabilityAsync(true));

    //   {
    //     "id": 16,
    //     "pickupLocation": {
    //         "coordinates": [
    //             88.4390171,
    //             26.6881096
    //         ],
    //         "type": "Point"
    //     },
    //     "dropoffLocation": {
    //         "coordinates": [
    //             78.5021299,
    //             17.4340684
    //         ],
    //         "type": "Point"
    //     },
    //     "requestedTime": "2025-04-16T12:13:41.89127",
    //     "rider": {
    //         "id": 3,
    //         "user": {
    //             "id": 3,
    //             "name": "John Doe",
    //             "email": "email@gmail.com",
    //             "roles": [
    //                 "RIDER"
    //             ]
    //         },
    //         "rating": 0
    //     },
    //     "paymentMethod": "WALLET",
    //     "rideRequestStatus": "PENDING",
    //     "fare": 18734.672
    // }

    // Simulate incoming ride request after 2 seconds
    // setTimeout(() => {
    //   const newRequest = {
    //     id: Math.random().toString(36).substring(7),
    //     rider: {
    //       name: "Sarah Johnson",
    //       rating: 4.7,
    //     },
    //     pickup: "123 Main St",
    //     destination: "456 Market St",
    //     estimatedTime: "15 min",
    //     estimatedPrice: "$18.50",
    //     pickupLocation: [-122.4161, 37.7665] as [number, number],
    //     destinationLocation: [-122.4096, 37.7835] as [number, number],
    //   };

    //   // Fetch route for the request
    //   fetchRoute(driverLocation, newRequest.pickupLocation)
    //     .then((route) => {
    //       setRideRequests([
    //         {
    //           ...newRequest,
    //           routeCoordinates: route,
    //         },
    //       ]);
    //     })
    //     .catch((error) => {
    //       console.error("Failed to fetch route:", error);
    //       setRideRequests([newRequest]);
    //     });
    // }, 2000);
  };

  useEffect(() => {
    for (let rides of rideRequestList) {
      console.log(
        rides?.pickupLocation?.coordinates,
        " ",
        rides?.dropoffLocation?.coordinates
      );
      const newRequest = {
        id: rides?.id,
        rider: rides?.rider,
        pickup: "123 Main St siliguri",
        destination: "456 Market St siliguri",
        estimatedTime: "15 min",
        estimatedPrice: rides?.fare,
        pickupLocation: rides?.pickupLocation?.coordinates,
        destinationLocation: rides?.dropoffLocation?.coordinates,
      };
      fetchRoute(driverLocation, newRequest.pickupLocation)
        .then((route) => {
          console.log("route", route);
          setRideRequests([
            {
              ...newRequest,
              routeCoordinates: route,
            },
          ]);
        })
        .catch((error) => {
          console.error("Failed to fetch route:", error);
          setRideRequests([newRequest]);
        });
    }
  }, [rideRequestList]);

  const handleGoOffline = () => {
    setIsOnline(false);
    dispatch(setDriverAvailabilityAsync(false));
    setRideRequests([]);
  };

  const handleAcceptRide = (rideRequestId: string) => {
    console.log(rideRequestId);
    dispatch(acceptRideAsync(rideRequestId));
    const ride = rideRequests.find((r) => r.id === rideRequestId);
    if (ride) {
      setActiveRide({
        ...ride,
        status: "accepted",
        driverLocation,
      });
      setRideRequests([]);
    }
  };

  const handleDeclineRide = (rideId: string) => {
    setRideRequests(rideRequests.filter((r) => r.id !== rideId));
  };

  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);

  const handleStartRide = () => {
    if (otpInput === currentRideDriver.otp) {
      dispatch(
        startRideAsync({
          rideId: currentRideDriver?.id,
          rideStartDTO: { ...currentRideDriver, otp: otpInput },
        })
      );
      // This would match the OTP shown to the rider
      if (activeRide) {
        // Get route from pickup to destination
        fetchRoute(activeRide.pickupLocation, activeRide.destinationLocation)
          .then((route) => {
            setActiveRide({
              ...activeRide,
              status: "in_progress",
              routeCoordinates: route,
            });
          })
          .catch((error) => {
            console.error("Failed to fetch route:", error);
            setActiveRide({
              ...activeRide,
              status: "in_progress",
            });
          });
      }
      setOtpError(false);
      setShowOtpInput(false);
    } else {
      setOtpError(true);
    }
  };

  const handleOtpInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtpInput(e.target.value);
    if (otpError) setOtpError(false);
  };

  const handleCompleteRide = () => {
    console.log(currentRideDriver);
    dispatch(endRideAsync(currentRideDriver.id));
    if (activeRide) {
      setActiveRide({
        ...activeRide,
        status: "completed",
      });

      // Clear active ride after 3 seconds
      setTimeout(() => {
        setActiveRide(null);
      }, 3000);
    }
  };

  const handleCancelRide = () => {
    dispatch(cancelRideAsync(currentRideDriver.id));
    setActiveRide(null);
  };

  // Simulate driver movement when ride is in progress
  useEffect(() => {
    if (
      !activeRide ||
      activeRide.status !== "in_progress" ||
      !activeRide.routeCoordinates
    )
      return;

    let currentPointIndex = 0;
    const routePoints = activeRide.routeCoordinates!;

    const interval = setInterval(() => {
      if (currentPointIndex < routePoints.length - 1) {
        currentPointIndex++;
        setDriverLocation(routePoints[currentPointIndex]);
        setActiveRide((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            driverLocation: routePoints[currentPointIndex],
          };
        });
      } else {
        clearInterval(interval);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [activeRide?.status, activeRide?.routeCoordinates]);

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Driver Dashboard</CardTitle>
              <CardDescription>
                {isOnline
                  ? "You're online and available for rides"
                  : "You're currently offline"}
              </CardDescription>
            </div>
            <Badge
              variant={isOnline ? "default" : "outline"}
              className={isOnline ? "bg-green-600" : ""}
            >
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="pt-0">
          {isOnline ? (
            <Button
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleGoOffline}
            >
              Go Offline
            </Button>
          ) : (
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={handleGoOnline}
            >
              Go Online
            </Button>
          )}
        </CardFooter>
      </Card>

      {rideRequests.length > 0 && (
        <Card className="shadow-sm border-green-200 animate-pulse">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-green-600" />
              New Ride Request
            </CardTitle>
            <CardDescription>
              You have {rideRequests.length} new ride request
              {rideRequests.length > 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          {rideRequests.map((request) => (
            <>
              <CardContent>
                <div key={request.id} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src="/placeholder.svg?height=40&width=40"
                        alt={request.rider.user.name}
                      />
                      <AvatarFallback>
                        {request.rider.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {request.rider.user.name}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {request.rider.rating}
                      </div>
                    </div>
                  </div>

                  {/* Map showing pickup and destination */}
                  <OpenLayersMap
                    riderLocation={request.pickupLocation}
                    destinationLocation={request.destinationLocation}
                    driverLocation={driverLocation}
                    routeCoordinates={request.routeCoordinates}
                    height="200px"
                  />

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-muted-foreground mb-1">Pickup</div>
                      <div className="font-medium">
                        <RidePlace coordinates={request?.pickupLocation} />
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">
                        Destination
                      </div>
                      <div className="font-medium">
                        <RidePlace coordinates={request?.destinationLocation} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{request.estimatedTime}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{request.estimatedPrice}</span>
                    </div>
                  </div>
                </div>
              </CardContent>{" "}
              <CardFooter className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => handleDeclineRide(request.id)}
                >
                  Decline
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleAcceptRide(request.id)}
                >
                  Accept
                </Button>
              </CardFooter>
            </>
          ))}
        </Card>
      )}

      {activeRide && (
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                {activeRide.status === "accepted" && "Pickup Rider"}
                {activeRide.status === "in_progress" && "Ride in Progress"}
                {activeRide.status === "completed" && "Ride Completed"}
              </CardTitle>
              <Badge
                variant={
                  activeRide.status === "accepted"
                    ? "outline"
                    : activeRide.status === "in_progress"
                    ? "default"
                    : "success"
                }
                className={
                  activeRide.status === "in_progress" ? "bg-green-600" : ""
                }
              >
                {activeRide.status === "accepted" && "Pickup"}
                {activeRide.status === "in_progress" && "In Progress"}
                {activeRide.status === "completed" && "Completed"}
              </Badge>
            </div>
            <CardDescription>
              {activeRide.status === "accepted" &&
                "Head to the pickup location"}
              {activeRide.status === "in_progress" &&
                "Drive to the destination"}
              {activeRide.status === "completed" && "Ride has been completed"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src="/placeholder.svg?height=40&width=40"
                  alt={activeRide.rider.user.name}
                />
                <AvatarFallback>
                  {activeRide.rider.user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{activeRide.rider.name}</div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                  {activeRide.rider.rating}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto rounded-full"
              >
                <Phone className="h-5 w-5" />
              </Button>
            </div>

            {/* OpenLayers Map */}
            <OpenLayersMap
              driverLocation={activeRide.driverLocation}
              riderLocation={activeRide.pickupLocation}
              destinationLocation={activeRide.destinationLocation}
              isRideStarted={activeRide.status === "in_progress"}
              routeCoordinates={activeRide.routeCoordinates}
              height="250px"
            />

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              {(activeRide.status === "accepted" ||
                activeRide.status === "in_progress") && (
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {activeRide.status === "accepted"
                        ? "Pickup"
                        : "Current Location"}
                    </div>
                    <div className="font-medium">{activeRide.pickup}</div>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <Navigation className="h-4 w-4 text-gray-600" />
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Destination
                  </div>
                  <div className="font-medium">{activeRide.destination}</div>
                </div>
              </div>
            </div>

            {activeRide.status === "completed" && (
              <div className="flex flex-col items-center justify-center py-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-lg font-medium">Ride Completed</div>
                <div className="text-muted-foreground">
                  Fare: {activeRide.estimatedPrice}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter
            className={
              activeRide.status === "completed"
                ? "justify-center"
                : "grid grid-cols-2 gap-3"
            }
          >
            {activeRide.status === "accepted" && (
              <>
                <Button
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={handleCancelRide}
                >
                  Cancel
                </Button>
                {!showOtpInput ? (
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => setShowOtpInput(true)}
                  >
                    Enter OTP
                  </Button>
                ) : (
                  <div className="col-span-2 space-y-2">
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Enter rider's OTP"
                        value={otpInput}
                        onChange={handleOtpInputChange}
                        className={otpError ? "border-red-500" : ""}
                        maxLength={4}
                      />
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={handleStartRide}
                      >
                        Verify
                      </Button>
                    </div>
                    {otpError && (
                      <p className="text-red-500 text-sm">
                        Invalid OTP. Please check and try again.
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

            {activeRide.status === "in_progress" && (
              <>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleCompleteRide}
                >
                  Complete Ride
                </Button>
              </>
            )}

            {activeRide.status === "completed" && (
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setActiveRide(null)}
              >
                Back to Dashboard
              </Button>
            )}
          </CardFooter>
        </Card>
      )}

      {isOnline && !activeRide && rideRequests.length === 0 && (
        <Card className="shadow-sm">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Navigation className="h-6 w-6 text-gray-600" />
              </div>
              <DashboardLocationSender />
              <div className="text-lg font-medium">
                Waiting for ride requests
              </div>
              <div className="text-muted-foreground mt-1">
                You'll be notified when a new request comes in
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!isOnline && !activeRide && (
        <Tabs defaultValue="earnings">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="all-rides">All Rides</TabsTrigger>
          </TabsList>
          <TabsContent value="earnings" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Summary</CardTitle>
                <CardDescription>Your earnings for the past</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      Total Earnings
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      ₹342.50
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">Rides</div>
                      <div className="text-2xl font-bold">24</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">Hours</div>
                      <div className="text-2xl font-bold">18.5</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all-rides" className="mt-4">
            <RideHistory userType="driver" />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

const rideHistory = [
  {
    id: "1",
    date: "Today, 3:45 PM",
    destination: "Airport Terminal C",
    earnings: "$28.75",
  },
  {
    id: "2",
    date: "Today, 1:20 PM",
    destination: "Central Station",
    earnings: "$15.50",
  },
  {
    id: "3",
    date: "Yesterday, 5:30 PM",
    destination: "Shopping Mall",
    earnings: "$12.25",
  },
  {
    id: "4",
    date: "Yesterday, 2:15 PM",
    destination: "University Campus",
    earnings: "$18.90",
  },
];
