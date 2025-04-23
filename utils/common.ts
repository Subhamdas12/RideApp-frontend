export const getAddressFromCoordinates = async (lat, lon) => {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
  );
  const data = await res.json();

  return data.results[0]?.formatted_address || "Unknown location";
};
