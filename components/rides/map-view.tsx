"use client"

import { useEffect, useState } from "react"
import { Car, MapPin } from "lucide-react"

interface MapViewProps {
  driverLocation?: { lat: number; lng: number }
  riderLocation?: { lat: number; lng: number }
  destinationLocation?: { lat: number; lng: number }
  isRideStarted?: boolean
}

export function MapView({
  driverLocation = { lat: 37.7749, lng: -122.4194 },
  riderLocation = { lat: 37.7665, lng: -122.4161 },
  destinationLocation = { lat: 37.7835, lng: -122.4096 },
  isRideStarted = false,
}: MapViewProps) {
  const [driverPosition, setDriverPosition] = useState({ x: 30, y: 60 })
  const [riderPosition, setRiderPosition] = useState({ x: 70, y: 70 })
  const [destinationPosition, setDestinationPosition] = useState({ x: 150, y: 30 })

  // Simulate driver movement
  useEffect(() => {
    if (!isRideStarted) {
      const interval = setInterval(() => {
        setDriverPosition((prev) => {
          // Move driver closer to rider if ride not started
          const dx = riderPosition.x - prev.x
          const dy = riderPosition.y - prev.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 5) {
            clearInterval(interval)
            return prev
          }

          return {
            x: prev.x + (dx / distance) * 2,
            y: prev.y + (dy / distance) * 2,
          }
        })
      }, 1000)

      return () => clearInterval(interval)
    } else {
      const interval = setInterval(() => {
        setDriverPosition((prev) => {
          // Move driver and rider together toward destination
          const dx = destinationPosition.x - prev.x
          const dy = destinationPosition.y - prev.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 5) {
            clearInterval(interval)
            return prev
          }

          const newPos = {
            x: prev.x + (dx / distance) * 2,
            y: prev.y + (dy / distance) * 2,
          }

          // Move rider along with driver when ride started
          setRiderPosition(newPos)

          return newPos
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isRideStarted, riderPosition.x, riderPosition.y, destinationPosition.x, destinationPosition.y])

  return (
    <div className="relative w-full h-[200px] bg-gray-100 rounded-lg overflow-hidden">
      {/* Simple map background with grid */}
      <div className="absolute inset-0 bg-[#E8F0F7]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D1DBEA" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Road */}
          <path
            d={`M ${riderPosition.x} ${riderPosition.y} Q ${(riderPosition.x + destinationPosition.x) / 2} ${
              (riderPosition.y + destinationPosition.y) / 2 - 20
            } ${destinationPosition.x} ${destinationPosition.y}`}
            stroke="#CBD5E1"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Destination marker */}
      <div
        className="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
        style={{ left: destinationPosition.x, top: destinationPosition.y }}
      >
        <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
        <div className="absolute -top-7 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          Destination
        </div>
      </div>

      {/* Rider marker */}
      <div
        className="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2"
        style={{ left: riderPosition.x, top: riderPosition.y }}
      >
        <div className="relative">
          <MapPin className="h-6 w-6 text-green-600 fill-green-100" />
          {!isRideStarted && (
            <div className="absolute -top-7 -left-6 bg-green-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              You
            </div>
          )}
        </div>
      </div>

      {/* Driver marker */}
      <div
        className="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2"
        style={{ left: driverPosition.x, top: driverPosition.y }}
      >
        <div className="relative">
          <Car className="h-6 w-6 text-blue-600" />
          <div className="absolute -top-7 -left-8 bg-blue-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            Driver
          </div>
        </div>
      </div>
    </div>
  )
}
