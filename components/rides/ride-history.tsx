"use client";
import "@/app/globals.css";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Car,
  Clock,
  Filter,
  MapPin,
  Search,
  Star,
  User,
} from "lucide-react";
import { OpenLayersMap } from "@/components/map/open-layers-map";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetchRoute } from "@/lib/routing";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyRidesAsync,
  resetRiderRides,
  selectRides,
} from "@/redux/features/rider/riderSlice";
import { getAddressFromCoordinates } from "@/utils/common";
import RidePlace from "./ride-place";
import Image from "next/image";
import {
  getMyRidesForDriverAsync,
  resetDriverRides,
  selectDriverRides,
} from "@/redux/features/driver/driverSlice";

interface RideHistoryProps {
  userType: "rider" | "driver";
}

export function RideHistory({ userType }: RideHistoryProps) {
  const dispatch = useDispatch();
  const rides =
    userType === "rider"
      ? useSelector(selectRides)
      : useSelector(selectDriverRides);
  // let rides;
  // if (userType === "rider") {
  //   rides = useSelector(selectRides);
  // } else {
  //   rides = useSelector(selectDriverRides);
  // }

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedRide, setSelectedRide] = useState<null | (typeof allRides)[0]>(
    null
  );
  const [routeCoordinates, setRouteCoordinates] = useState<Array<
    [number, number]
  > | null>(null);
  const [page, setPage] = useState(1);
  const handlePage = (page: number) => {
    setPage(page);
  };
  // const totalPages = 10;
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(rides?.totalElements / ITEMS_PER_PAGE);
  // Fetch route when a ride is selected
  useEffect(() => {
    if (!selectedRide) {
      setRouteCoordinates(null);
      return;
    }

    const getRoute = async () => {
      try {
        const route = await fetchRoute(
          selectedRide.pickupLocation.coordinates,
          selectedRide.dropoffLocation.coordinates
        );

        setRouteCoordinates(route);
      } catch (error) {
        console.error("Failed to fetch route:", error);
        setRouteCoordinates(null);
      }
    };

    getRoute();
  }, [selectedRide]);

  useEffect(() => {
    const pagination = { pageOffset: page, pageSize: ITEMS_PER_PAGE };
    if (userType == "driver") {
      dispatch(getMyRidesForDriverAsync(pagination));
      // dispatch(resetRiderRides());
    } else if (userType == "rider") {
      dispatch(getMyRidesAsync(pagination));
      // dispatch(resetDriverRides());
    }
  }, [page, dispatch]);

  // // Filter rides based on search term, status, and date
  // const filteredRides = allRides.filter((ride) => {
  //   const matchesSearch =
  //     searchTerm === "" ||
  //     ride.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     ride.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     (userType === "rider" ? ride.driver.name : ride.rider.name)
  //       .toLowerCase()
  //       .includes(searchTerm.toLowerCase());

  //   const matchesStatus =
  //     statusFilter === "all" || ride.status === statusFilter;

  //   const matchesDate =
  //     dateFilter === "all" ||
  //     (dateFilter === "today" && ride.date.includes("Today")) ||
  //     (dateFilter === "yesterday" && ride.date.includes("Yesterday")) ||
  //     (dateFilter === "week" &&
  //       !ride.date.includes("Today") &&
  //       !ride.date.includes("Yesterday"));

  //   return matchesSearch && matchesStatus && matchesDate;
  // });

  const filteredRides1 = rides?.content?.filter((ride) => {
    const matchesSearch =
      searchTerm === "" ||
      ride.pickupLocation?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      ride.dropoffLocation?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (userType === "rider"
        ? ride.driver?.user?.name?.toLowerCase()
        : ride.rider?.user?.name?.toLowerCase()
      )?.includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || ride.rideStatus === statusFilter;

    const rideDate = new Date(ride.createdTime);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (d1, d2) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "today" && isSameDay(rideDate, today)) ||
      (dateFilter === "yesterday" && isSameDay(rideDate, yesterday)) ||
      (dateFilter === "week" &&
        !isSameDay(rideDate, today) &&
        !isSameDay(rideDate, yesterday));

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Rides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and filters */}

            {/* Rides list */}
            <div className="space-y-4">
              {filteredRides1?.length > 0 ? (
                filteredRides1?.map((ride) => (
                  <Dialog
                    key={ride.id}
                    onOpenChange={(open) => {
                      if (open) setSelectedRide(ride);
                      else setSelectedRide(null);
                    }}
                  >
                    <DialogTrigger asChild>
                      <div className="flex items-start border p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className="bg-gray-100 p-2 rounded-full mr-3">
                          <Clock className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="font-medium truncate">
                              {new Date(ride.startedAt).toLocaleString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                }
                              )}
                            </div>
                            <Badge
                              variant={
                                ride.rideStatus === "CANCELLED"
                                  ? "destructive"
                                  : "default"
                              }
                              className={
                                ride.rideStatus === "CANCELLED"
                                  ? "bg-red-600"
                                  : ride.rideStatus === "CONFIRMED"
                                  ? "bg-blue-600"
                                  : ride.rideStatus === "ONGOING"
                                  ? "bg-yellow-500"
                                  : ride.rideStatus === "ENDED"
                                  ? "bg-green-600"
                                  : "bg-gray-400"
                              }
                            >
                              {ride.rideStatus === "CANCELLED"
                                ? "Cancelled"
                                : ride.rideStatus === "CONFIRMED"
                                ? "Confirmed"
                                : ride.rideStatus === "ONGOING"
                                ? "Ongoing"
                                : ride.rideStatus === "ENDED"
                                ? "Completed"
                                : "Unknown"}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1 inline text-green-500" />
                            <span className="truncate">
                              <RidePlace
                                coordinates={ride.pickupLocation.coordinates}
                              />
                            </span>
                          </div>
                          |
                          <div className="text-sm text-muted-foreground flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1 inline text-red-500" />
                            <span className="truncate">
                              <RidePlace
                                coordinates={ride.dropoffLocation.coordinates}
                              />
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <div className="text-sm text-green-600">
                              ₹{ride.fare}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              {userType === "rider" ? (
                                <>
                                  <Car className="h-3 w-3 mr-1" />
                                  <span className="truncate">
                                    {ride.driver.user.name}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <User className="h-3 w-3 mr-1" />
                                  <span className="truncate">
                                    {ride.rider.user.name}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Ride Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-2">
                        <div className="flex items-center gap-3">
                          <Image
                            src={`https://ui-avatars.com/api/?name=${
                              userType === "rider"
                                ? ride.driver.user.name
                                : ride.rider.user.name
                            }&background=random`}
                            alt="User avatar"
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                          <div>
                            <div className="font-medium">
                              {userType === "rider"
                                ? ride.driver.user.name
                                : ride.rider.user.name}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                              {userType === "rider"
                                ? ride.driver.rating
                                : ride.rider.rating}
                            </div>
                          </div>
                        </div>

                        <OpenLayersMap
                          riderLocation={ride.pickupLocation.coordinates}
                          destinationLocation={ride.dropoffLocation.coordinates}
                          driverLocation={ride.driverLocation}
                          isRideStarted={true}
                          height="200px"
                          routeCoordinates={routeCoordinates || undefined}
                          showDriver={false}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Date & Time
                            </div>
                            <div className="font-medium">
                              {new Date(ride.startedAt).toLocaleString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                }
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Status
                            </div>
                            <div className="font-medium capitalize">
                              {ride.rideStatus}
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                                <MapPin className="h-4 w-4 text-green-600" />
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">
                                Pickup
                              </div>
                              <div className="font-medium">
                                <RidePlace
                                  coordinates={ride.pickupLocation.coordinates}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                                <MapPin className="h-4 w-4 text-gray-600" />
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">
                                Destination
                              </div>
                              <div className="font-medium">
                                <RidePlace
                                  coordinates={ride.dropoffLocation.coordinates}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Ride Time
                            </div>
                            <div className="font-medium">
                              {new Date(ride.startedAt).toLocaleString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                }
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Price
                            </div>
                            <div className="font-medium">₹{ride.fare}</div>
                          </div>
                        </div>

                        {userType === "rider" &&
                          ride.status === "completed" && (
                            <Button className="w-full bg-green-600 hover:bg-green-700">
                              Book Again
                            </Button>
                          )}
                      </div>
                    </DialogContent>
                  </Dialog>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No rides found matching your filters
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden ">
            <div
              onClick={(e) => handlePage(page > 1 ? page - 1 : page)}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Previous
            </div>
            <div
              onClick={(e) => handlePage(page < totalPages ? page + 1 : page)}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Next
            </div>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(page - 1) * ITEMS_PER_PAGE + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {page * ITEMS_PER_PAGE > rides?.totalElements
                    ? rides?.totalElements
                    : page * ITEMS_PER_PAGE}
                </span>{" "}
                of <span className="font-medium">{rides?.totalElements}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                aria-label="Pagination"
                className="isolate inline-flex -space-x-px rounded-md shadow-xs"
              >
                <div
                  onClick={(e) => handlePage(page > 1 ? page - 1 : page)}
                  className="relative cursor-pointer inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Previous</span>
                  Previous
                </div>
                {Array.from({ length: totalPages }).map((el, index) => (
                  <a
                    href="#"
                    onClick={(e) => handlePage(index + 1)}
                    className={`relative inline-flex ${
                      index + 1 == page ? "bg-green-600 text-white" : ""
                    } items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0`}
                  >
                    {index + 1}
                  </a>
                ))}

                <div
                  onClick={(e) =>
                    handlePage(page < totalPages ? page + 1 : page)
                  }
                  className="relative cursor-pointer inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Next</span>Next
                </div>
              </nav>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Sample ride history data
const allRides = [
  {
    id: "1",
    date: "Today, 3:45 PM",
    pickup: "123 Main St",
    destination: "Airport Terminal C",
    price: "$28.75",
    status: "completed",
    rideTime: "32 min",
    driver: {
      name: "Michael Chen",
      rating: 4.8,
      car: "Toyota Camry (White)",
      licensePlate: "ABC 123",
    },
    rider: {
      name: "Sarah Johnson",
      rating: 4.7,
    },
    pickupLocation: [-122.4161, 37.7665],
    destinationLocation: [-122.4096, 37.7835],
    driverLocation: [-122.4194, 37.7749],
  },
  {
    id: "2",
    date: "Today, 1:20 PM",
    pickup: "456 Oak Ave",
    destination: "Central Station",
    price: "$15.50",
    status: "completed",
    rideTime: "18 min",
    driver: {
      name: "Jessica Wong",
      rating: 4.9,
      car: "Honda Civic (Black)",
      licensePlate: "XYZ 789",
    },
    rider: {
      name: "David Miller",
      rating: 4.5,
    },
    pickupLocation: [-122.4181, 37.7695],
    destinationLocation: [-122.4146, 37.7795],
    driverLocation: [-122.4174, 37.7739],
  },
  {
    id: "3",
    date: "Yesterday, 5:30 PM",
    pickup: "789 Pine St",
    destination: "Shopping Mall",
    price: "$12.25",
    status: "cancelled",
    rideTime: "N/A",
    driver: {
      name: "Robert Smith",
      rating: 4.6,
      car: "Hyundai Sonata (Silver)",
      licensePlate: "DEF 456",
    },
    rider: {
      name: "Emily Wilson",
      rating: 4.8,
    },
    pickupLocation: [-122.4111, 37.7625],
    destinationLocation: [-122.4076, 37.7815],
    driverLocation: [-122.4134, 37.7719],
  },
  {
    id: "4",
    date: "Yesterday, 2:15 PM",
    pickup: "321 Elm St",
    destination: "University Campus",
    price: "$18.90",
    status: "completed",
    rideTime: "25 min",
    driver: {
      name: "John Davis",
      rating: 4.7,
      car: "Ford Fusion (Blue)",
      licensePlate: "GHI 789",
    },
    rider: {
      name: "Amanda Brown",
      rating: 4.6,
    },
    pickupLocation: [-122.4151, 37.7645],
    destinationLocation: [-122.4066, 37.7755],
    driverLocation: [-122.4124, 37.7709],
  },
  {
    id: "5",
    date: "Apr 15, 9:30 AM",
    pickup: "555 Market St",
    destination: "Tech Park",
    price: "$22.30",
    status: "completed",
    rideTime: "28 min",
    driver: {
      name: "Lisa Garcia",
      rating: 4.9,
      car: "Tesla Model 3 (White)",
      licensePlate: "JKL 012",
    },
    rider: {
      name: "Thomas Lee",
      rating: 4.7,
    },
    pickupLocation: [-122.4021, 37.7595],
    destinationLocation: [-122.3986, 37.7705],
    driverLocation: [-122.4004, 37.7659],
  },
  {
    id: "6",
    date: "Apr 14, 4:45 PM",
    pickup: "777 Broadway",
    destination: "Golden Gate Park",
    price: "$32.15",
    status: "cancelled",
    rideTime: "N/A",
    driver: {
      name: "Kevin Wilson",
      rating: 4.5,
      car: "Chevrolet Malibu (Red)",
      licensePlate: "MNO 345",
    },
    rider: {
      name: "Jennifer Taylor",
      rating: 4.4,
    },
    pickupLocation: [-122.4071, 37.7575],
    destinationLocation: [-122.4836, 37.7695],
    driverLocation: [-122.4104, 37.7629],
  },
  {
    id: "7",
    date: "Apr 12, 11:20 AM",
    pickup: "888 Harrison St",
    destination: "Financial District",
    price: "$14.75",
    status: "completed",
    rideTime: "15 min",
    driver: {
      name: "Daniel Martinez",
      rating: 4.8,
      car: "Kia Optima (Gray)",
      licensePlate: "PQR 678",
    },
    rider: {
      name: "Michelle Robinson",
      rating: 4.9,
    },
    pickupLocation: [-122.4031, 37.7785],
    destinationLocation: [-122.3996, 37.7945],
    driverLocation: [-122.4014, 37.7859],
  },
];
