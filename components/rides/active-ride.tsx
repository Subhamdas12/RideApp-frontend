"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MapPin,
  Navigation,
  Phone,
  Star,
  Copy,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { OpenLayersMap } from "@/components/map/open-layers-map";
import { fetchRoute } from "@/lib/routing";
import RidePlace from "./ride-place";

interface ActiveRideProps {
  ride: {
    id: string;
    status: "searching" | "accepted" | "in_progress" | "completed";
    driver?: any;
    pickup: string;
    destination: string;
    estimatedTime: string;
    estimatedPrice: string;
    pickupLocation: [number, number];
    destinationLocation: [number, number];
    driverLocation?: [number, number];
    routeCoordinates?: Array<[number, number]>;
    otp: string;
  };
  onCancel: () => void;
}

export function ActiveRide({ ride, onCancel }: ActiveRideProps) {
  const [otp, setOtp] = useState<string>("");
  const [otpCopied, setOtpCopied] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState<Array<
    [number, number]
  > | null>(ride.routeCoordinates || null);

  // Generate OTP when ride is accepted
  // useEffect(() => {
  //   if (ride.status === "accepted" && !otp) {
  //     // Generate a 4-digit OTP
  //     const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
  //     setOtp(generatedOtp);
  //   }
  // }, [ride.status, otp]);

  // Fetch route when ride is accepted or in progress
  useEffect(() => {
    const getRoute = async () => {
      if (!ride.driverLocation) return;

      try {
        let start: [number, number], end: [number, number];

        if (ride.status === "accepted") {
          // Driver to pickup
          start = ride.driverLocation;
          end = ride.pickupLocation;
        } else if (ride.status === "in_progress") {
          // Pickup to destination
          start = ride.pickupLocation;
          end = ride.destinationLocation;
        } else {
          return;
        }

        const route = await fetchRoute(start, end);
        setRouteCoordinates(route);
      } catch (error) {
        console.error("Failed to fetch route:", error);
      }
    };

    if (
      (ride.status === "accepted" || ride.status === "in_progress") &&
      !routeCoordinates
    ) {
      getRoute();
    }
  }, [
    ride.status,
    ride.driverLocation,
    ride.pickupLocation,
    ride.destinationLocation,
    routeCoordinates,
  ]);

  const copyOtpToClipboard = () => {
    navigator.clipboard.writeText(ride.otp);
    setOtpCopied(true);
    setTimeout(() => setOtpCopied(false), 2000);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Your Ride</CardTitle>
          <Badge
            variant={
              ride.status === "searching"
                ? "outline"
                : ride.status === "accepted"
                ? "default"
                : "success"
            }
            className={ride.status === "accepted" ? "bg-green-600" : ""}
          >
            {ride.status === "searching" && "Finding Driver"}
            {ride.status === "accepted" && "Driver Coming"}
            {ride.status === "in_progress" && "In Progress"}
            {ride.status === "completed" && "Completed"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {ride.status === "searching" ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="h-12 w-12 rounded-full border-4 border-t-green-600 border-green-100 animate-spin mb-4" />
            <div className="text-lg font-medium">Finding a driver</div>
            <div className="text-muted-foreground">
              This may take a few moments
            </div>
          </div>
        ) : (
          <>
            {ride.driver && (
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src="/placeholder.svg?height=48&width=48"
                    alt={ride.driver.user.name}
                  />
                  <AvatarFallback>
                    {ride.driver.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{ride.driver.user.name}</div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                    {ride.driver.rating}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {ride.driver.vehicleId}
                  </div>
                  <div className="text-sm font-medium">
                    {ride.driver.licensePlate}
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
            )}

            {/* OpenLayers Map */}
            <OpenLayersMap
              driverLocation={ride.driverLocation}
              riderLocation={ride.pickupLocation}
              destinationLocation={ride.destinationLocation}
              isRideStarted={ride.status === "in_progress"}
              routeCoordinates={routeCoordinates || undefined}
            />
            {console.log(ride)}

            {/* OTP Section - Only show when ride is accepted but not started */}
            {ride.status === "accepted" && ride.otp && (
              <Alert className="bg-green-50 border-green-200">
                <div className="flex justify-between items-center">
                  <div>
                    <AlertDescription className="text-sm text-green-800">
                      Share this code with your driver to start the ride
                    </AlertDescription>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="text-2xl font-bold tracking-widest text-green-700">
                        {ride?.otp}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-green-600"
                        onClick={copyOtpToClipboard}
                      >
                        {otpCopied ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </Alert>
            )}

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Pickup</div>

                  <div className="font-medium">
                    <RidePlace coordinates={ride?.pickupLocation} />
                  </div>
                </div>
              </div>

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
                  <div className="font-medium">
                    <RidePlace coordinates={ride?.destinationLocation} />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Est. Time</div>
                <div className="font-medium">{ride.estimatedTime}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Est. Price</div>
                <div className="font-medium">{ride.estimatedPrice}</div>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        {ride.status === "accepted" && (
          <Button
            variant="outline"
            className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={onCancel}
          >
            Cancel Ride
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
