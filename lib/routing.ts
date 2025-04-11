/**
 * Fetches the shortest route between two points using Open Source Routing Machine (OSRM)
 * @param start Starting coordinates [longitude, latitude]
 * @param end Ending coordinates [longitude, latitude]
 * @returns Array of coordinates representing the route
 */
export async function fetchRoute(start: [number, number], end: [number, number]): Promise<Array<[number, number]>> {
  try {
    // OSRM public API endpoint
    const osrmEndpoint = "https://router.project-osrm.org/route/v1/driving"

    // Format coordinates for OSRM API
    const coordinates = `${start[0]},${start[1]};${end[0]},${end[1]}`

    // Make request to OSRM API
    const response = await fetch(`${osrmEndpoint}/${coordinates}?overview=full&geometries=geojson`)

    if (!response.ok) {
      throw new Error(`OSRM API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.routes || data.routes.length === 0) {
      throw new Error("No route found")
    }

    // Extract coordinates from the response
    const route = data.routes[0].geometry.coordinates

    // Return as array of [longitude, latitude] pairs
    return route as Array<[number, number]>
  } catch (error) {
    console.error("Error fetching route:", error)

    // Fallback: return a straight line between start and end
    return [start, end]
  }
}

/**
 * Estimates the travel time between two points
 * @param start Starting coordinates [longitude, latitude]
 * @param end Ending coordinates [longitude, latitude]
 * @returns Estimated travel time in minutes
 */
export async function estimateTravelTime(start: [number, number], end: [number, number]): Promise<number> {
  try {
    const osrmEndpoint = "https://router.project-osrm.org/route/v1/driving"
    const coordinates = `${start[0]},${start[1]};${end[0]},${end[1]}`

    const response = await fetch(`${osrmEndpoint}/${coordinates}`)

    if (!response.ok) {
      throw new Error(`OSRM API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.routes || data.routes.length === 0) {
      throw new Error("No route found")
    }

    // Duration is in seconds, convert to minutes
    const durationInMinutes = Math.ceil(data.routes[0].duration / 60)

    return durationInMinutes
  } catch (error) {
    console.error("Error estimating travel time:", error)

    // Fallback: rough estimate based on distance
    const distance = calculateDistance(start, end)
    const averageSpeedKmh = 30 // Assume average speed of 30 km/h in city
    const estimatedTimeMinutes = Math.ceil((distance / averageSpeedKmh) * 60)

    return estimatedTimeMinutes
  }
}

/**
 * Calculates the distance between two points using the Haversine formula
 * @param start Starting coordinates [longitude, latitude]
 * @param end Ending coordinates [longitude, latitude]
 * @returns Distance in kilometers
 */
function calculateDistance(start: [number, number], end: [number, number]): number {
  const [startLng, startLat] = start
  const [endLng, endLat] = end

  const R = 6371 // Earth's radius in km
  const dLat = toRadians(endLat - startLat)
  const dLng = toRadians(endLng - startLng)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(startLat)) * Math.cos(toRadians(endLat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return distance
}

/**
 * Converts degrees to radians
 * @param degrees Angle in degrees
 * @returns Angle in radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}
