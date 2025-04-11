"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle, CheckCircle, Clock, DollarSign, MapPin, Navigation, Phone, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { OpenLayersMap } from "@/components/map/open-layers-map"
import { RideHistory } from "@/components/rides/ride-history"
import { fetchRoute } from "@/lib/routing"

export function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(false)
  const [activeRide, setActiveRide] = useState<null | {
    id: string
    status: "requested" | "accepted" | "in_progress" | "completed"
    rider: {
      name: string
      rating: number
    }
    pickup: string
    destination: string
    estimatedTime: string
    estimatedPrice: string
    pickupLocation: [number, number]
    destinationLocation: [number, number]
    driverLocation: [number, number]
    routeCoordinates?: Array<[number, number]>
  }>(null)
  const [rideRequests, setRideRequests] = useState<
    Array<{
      id: string
      rider: {
        name: string
        rating: number
      }
      pickup: string
      destination: string
      estimatedTime: string
      estimatedPrice: string
      pickupLocation: [number, number]
      destinationLocation: [number, number]
      routeCoordinates?: Array<[number, number]>
    }>
  >([])

  // Driver's current location - in a real app, this would come from geolocation
  const [driverLocation, setDriverLocation] = useState<[number, number]>([-122.4194, 37.7749])

  const handleGoOnline = () => {
    setIsOnline(true)

    // Simulate incoming ride request after 2 seconds
    setTimeout(() => {
      const newRequest = {
        id: Math.random().toString(36).substring(7),
        rider: {
          name: "Sarah Johnson",
          rating: 4.7,
        },
        pickup: "123 Main St",
        destination: "456 Market St",
        estimatedTime: "15 min",
        estimatedPrice: "$18.50",
        pickupLocation: [-122.4161, 37.7665] as [number, number],
        destinationLocation: [-122.4096, 37.7835] as [number, number],
      }

      // Fetch route for the request
      fetchRoute(driverLocation, newRequest.pickupLocation)
        .then((route) => {
          setRideRequests([
            {
              ...newRequest,
              routeCoordinates: route,
            },
          ])
        })
        .catch((error) => {
          console.error("Failed to fetch route:", error)
          setRideRequests([newRequest])
        })
    }, 2000)
  }

  const handleGoOffline = () => {
    setIsOnline(false)
    setRideRequests([])
  }

  const handleAcceptRide = (rideId: string) => {
    const ride = rideRequests.find((r) => r.id === rideId)
    if (ride) {
      setActiveRide({
        ...ride,
        status: "accepted",
        driverLocation,
      })
      setRideRequests([])
    }
  }

  const handleDeclineRide = (rideId: string) => {
    setRideRequests(rideRequests.filter((r) => r.id !== rideId))
  }

  const [otpInput, setOtpInput] = useState("")
  const [otpError, setOtpError] = useState(false)
  const [showOtpInput, setShowOtpInput] = useState(false)

  const handleStartRide = () => {
    // Simulate OTP verification
    // In a real app, you would verify this against the OTP given to the rider
    if (otpInput === "1234") {
      // This would match the OTP shown to the rider
      if (activeRide) {
        // Get route from pickup to destination
        fetchRoute(activeRide.pickupLocation, activeRide.destinationLocation)
          .then((route) => {
            setActiveRide({
              ...activeRide,
              status: "in_progress",
              routeCoordinates: route,
            })
          })
          .catch((error) => {
            console.error("Failed to fetch route:", error)
            setActiveRide({
              ...activeRide,
              status: "in_progress",
            })
          })
      }
      setOtpError(false)
      setShowOtpInput(false)
    } else {
      setOtpError(true)
    }
  }

  const handleOtpInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtpInput(e.target.value)
    if (otpError) setOtpError(false)
  }

  const handleCompleteRide = () => {
    if (activeRide) {
      setActiveRide({
        ...activeRide,
        status: "completed",
      })

      // Clear active ride after 3 seconds
      setTimeout(() => {
        setActiveRide(null)
      }, 3000)
    }
  }

  const handleCancelRide = () => {
    setActiveRide(null)
  }

  // Simulate driver movement when ride is in progress
  useEffect(() => {
    if (!activeRide || activeRide.status !== "in_progress" || !activeRide.routeCoordinates) return

    let currentPointIndex = 0
    const routePoints = activeRide.routeCoordinates!

    const interval = setInterval(() => {
      if (currentPointIndex < routePoints.length - 1) {
        currentPointIndex++
        setDriverLocation(routePoints[currentPointIndex])
        setActiveRide((prev) => {
          if (!prev) return null
          return {
            ...prev,
            driverLocation: routePoints[currentPointIndex],
          }
        })
      } else {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [activeRide?.status, activeRide?.routeCoordinates])

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Driver Dashboard</CardTitle>
              <CardDescription>
                {isOnline ? "You're online and available for rides" : "You're currently offline"}
              </CardDescription>
            </div>
            <Badge variant={isOnline ? "default" : "outline"} className={isOnline ? "bg-green-600" : ""}>
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
            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleGoOnline}>
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
              You have {rideRequests.length} new ride request{rideRequests.length > 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {rideRequests.map((request) => (
              <div key={request.id} className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt={request.rider.name} />
                    <AvatarFallback>{request.rider.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{request.rider.name}</div>
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
                    <div className="font-medium">{request.pickup}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Destination</div>
                    <div className="font-medium">{request.destination}</div>
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
            ))}
          </CardContent>
          <CardFooter className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => handleDeclineRide(rideRequests[0].id)}
            >
              Decline
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleAcceptRide(rideRequests[0].id)}>
              Accept
            </Button>
          </CardFooter>
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
                className={activeRide.status === "in_progress" ? "bg-green-600" : ""}
              >
                {activeRide.status === "accepted" && "Pickup"}
                {activeRide.status === "in_progress" && "In Progress"}
                {activeRide.status === "completed" && "Completed"}
              </Badge>
            </div>
            <CardDescription>
              {activeRide.status === "accepted" && "Head to the pickup location"}
              {activeRide.status === "in_progress" && "Drive to the destination"}
              {activeRide.status === "completed" && "Ride has been completed"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt={activeRide.rider.name} />
                <AvatarFallback>{activeRide.rider.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{activeRide.rider.name}</div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                  {activeRide.rider.rating}
                </div>
              </div>
              <Button variant="ghost" size="icon" className="ml-auto rounded-full">
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
              {(activeRide.status === "accepted" || activeRide.status === "in_progress") && (
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {activeRide.status === "accepted" ? "Pickup" : "Current Location"}
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
                  <div className="text-sm text-muted-foreground">Destination</div>
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
                <div className="text-muted-foreground">Fare: {activeRide.estimatedPrice}</div>
              </div>
            )}
          </CardContent>
          <CardFooter className={activeRide.status === "completed" ? "justify-center" : "grid grid-cols-2 gap-3"}>
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
                  <Button className="bg-green-600 hover:bg-green-700" onClick={() => setShowOtpInput(true)}>
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
                      <Button className="bg-green-600 hover:bg-green-700" onClick={handleStartRide}>
                        Verify
                      </Button>
                    </div>
                    {otpError && <p className="text-red-500 text-sm">Invalid OTP. Please check and try again.</p>}
                  </div>
                )}
              </>
            )}

            {activeRide.status === "in_progress" && (
              <>
                <Button
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={handleCancelRide}
                >
                  Cancel
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleCompleteRide}>
                  Complete Ride
                </Button>
              </>
            )}

            {activeRide.status === "completed" && (
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => setActiveRide(null)}>
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
              <div className="text-lg font-medium">Waiting for ride requests</div>
              <div className="text-muted-foreground mt-1">You'll be notified when a new request comes in</div>
            </div>
          </CardContent>
        </Card>
      )}

      {!isOnline && !activeRide && (
        <Tabs defaultValue="earnings">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="history">Ride History</TabsTrigger>
            <TabsTrigger value="all-rides">All Rides</TabsTrigger>
          </TabsList>
          <TabsContent value="earnings" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Summary</CardTitle>
                <CardDescription>Your earnings for the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Total Earnings</div>
                    <div className="text-3xl font-bold text-green-600">$342.50</div>
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
          <TabsContent value="history" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {rideHistory.map((ride) => (
                    <div key={ride.id} className="flex items-start border-b pb-4 last:border-0 last:pb-0">
                      <div className="bg-gray-100 p-2 rounded-full mr-3">
                        <Clock className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{ride.date}</div>
                        <div className="text-sm text-muted-foreground flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1 inline" />
                          {ride.destination}
                        </div>
                        <div className="text-sm text-green-600 mt-1">{ride.earnings}</div>
                      </div>
                    </div>
                  ))}
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
  )
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
]
