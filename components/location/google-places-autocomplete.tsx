"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface GooglePlacesAutocompleteProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (place: {
    address: string;
    location: [number, number];
  }) => void;
  className?: string;
  required?: boolean;
  icon?: React.ReactNode;
}

declare global {
  interface Window {
    google: any;
  }
}

export function GooglePlacesAutocomplete({
  placeholder,
  value,
  onChange,
  onPlaceSelect,
  className,
  required = false,
  icon,
}: GooglePlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  // Load Google Maps API
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      setIsGoogleMapsLoaded(true);
      return;
    }

    const googleMapsScript = document.createElement("script");
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    googleMapsScript.async = true;
    googleMapsScript.defer = true;
    googleMapsScript.onload = () => {
      setIsGoogleMapsLoaded(true);
    };
    document.head.appendChild(googleMapsScript);

    return () => {
      // Clean up script if component unmounts before script loads
      if (document.head.contains(googleMapsScript)) {
        document.head.removeChild(googleMapsScript);
      }
    };
  }, []);

  // Initialize autocomplete
  useEffect(() => {
    if (!isGoogleMapsLoaded || !inputRef.current) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["address"],
        fields: ["formatted_address", "geometry"],
      }
    );

    autocompleteRef.current.addListener("place_changed", () => {
      if (!autocompleteRef.current) return;

      const place = autocompleteRef.current.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const address = place.formatted_address || "";

      onChange(address);
      onPlaceSelect({
        address,
        location: [lng, lat], // [longitude, latitude] format for OpenLayers
      });
    });

    return () => {
      // Clean up listener
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(
          autocompleteRef.current
        );
      }
    };
  }, [isGoogleMapsLoaded, onChange, onPlaceSelect]);

  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-3 h-4 w-4 text-muted-foreground">
          {icon}
        </div>
      )}
      {/* value={value}
      onChange={(e) => onChange(e.target.value)} */}
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className={`${icon ? "pl-10" : ""} ${className || ""}`}
        required={required}
        disabled={!isGoogleMapsLoaded}
      />
      {!isGoogleMapsLoaded && (
        <div className="absolute right-3 top-3">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
