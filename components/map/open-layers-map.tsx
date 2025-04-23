"use client";

import { useEffect, useRef, useState } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Icon, Style } from "ol/style";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import LineString from "ol/geom/LineString";
import { Stroke } from "ol/style";

interface OpenLayersMapProps {
  driverLocation?: [number, number]; // [longitude, latitude]
  riderLocation?: [number, number];
  destinationLocation?: [number, number];
  isRideStarted?: boolean;
  height?: string;
  zoom?: number;
  showControls?: boolean;
  routeCoordinates?: Array<[number, number]>; // Array of [longitude, latitude] points for the route
  showDriver?: boolean;
  showDestination?: boolean;
  showRider?: boolean;
}

export function OpenLayersMap({
  driverLocation = [88.4194, 27.7749], // San Francisco by default
  riderLocation = [-122.4161, 37.7665],
  destinationLocation = [-122.4096, 37.7835],
  isRideStarted = false,
  height = "300px",
  zoom = 14,
  showControls = false,
  routeCoordinates,
  showDriver = true,
  showDestination = true,
  showRider = true,
}: OpenLayersMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);

  // Initialize map on component mount
  useEffect(() => {
    if (!mapRef.current) return;

    // Create map instance
    const initialMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat(riderLocation),
        zoom: zoom,
      }),
      controls: showControls ? undefined : [], // Use default controls if true, empty array if false
    });

    setMap(initialMap);

    return () => {
      initialMap.setTarget(undefined);
    };
  }, [riderLocation, zoom, showControls]);

  // Update map when locations change
  useEffect(() => {
    if (!map) return;

    // Clear existing vector layers
    map
      .getLayers()
      .getArray()
      .filter((layer) => layer instanceof VectorLayer)
      .forEach((layer) => map.removeLayer(layer));

    // Create features for driver, rider, and destination
    const driverFeature = new Feature({
      geometry: new Point(fromLonLat(driverLocation)),
    });

    const riderFeature = new Feature({
      geometry: new Point(fromLonLat(riderLocation)),
    });

    const destinationFeature = new Feature({
      geometry: new Point(fromLonLat(destinationLocation)),
    });

    // Style the features
    driverFeature.setStyle(
      new Style({
        image: new Icon({
          src:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#2563eb" viewBox="0 0 24 24">
                <path d="M3 13l1-4c.2-.8 1-1.5 2-1.5h12c1 0 1.8.7 2 1.5l1 4v5a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H8a2 2 0 0 1-4 0H3a1 1 0 0 1-1-1v-5zM6 16a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm12 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
              </svg>
            `),
          anchor: [0.5, 0.5],
          scale: 1.2,
        }),
      })
    );

    riderFeature.setStyle(
      new Style({
        image: new Icon({
          src:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="6" fill="#2563eb" />
              </svg>
            `),
          anchor: [0.5, 0.5],
          scale: 1.2,
        }),
      })
    );

    destinationFeature.setStyle(
      new Style({
        image: new Icon({
          src:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" width="24" height="24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
              </svg>
            `),
          anchor: [0.5, 1],
          scale: 1.5,
        }),
      })
    );
    const features = [];

    if (showDriver) {
      features.push(driverFeature);
    }
    if (showRider) {
      features.push(riderFeature);
    }
    if (showDestination) {
      features.push(destinationFeature);
    }

    const vectorSource = new VectorSource({
      features: features,
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    // Add route lines
    const routeSource = new VectorSource();
    const routeLayer = new VectorLayer({
      source: routeSource,
      style: new Style({
        stroke: new Stroke({
          color: "#94a3b8",
          width: 4,
        }),
      }),
    });

    // Create route line
    if (routeCoordinates && routeCoordinates.length > 1) {
      // Use OSRM route if available
      const routePoints = routeCoordinates.map((coord) => fromLonLat(coord));
      const routeFeature = new Feature({
        geometry: new LineString(routePoints),
      });

      routeFeature.setStyle(
        new Style({
          stroke: new Stroke({
            color: "#3b82f6",
            width: 4,
          }),
        })
      );

      routeSource.addFeature(routeFeature);
    } else if (isRideStarted) {
      // If ride started, route is from driver (with rider) to destination
      const routeFeature = new Feature({
        geometry: new LineString([
          fromLonLat(driverLocation),
          fromLonLat(destinationLocation),
        ]),
      });
      routeSource.addFeature(routeFeature);
    } else {
      // If ride not started, route is from driver to rider, then to destination
      const driverToRiderFeature = new Feature({
        geometry: new LineString([
          fromLonLat(driverLocation),
          fromLonLat(riderLocation),
        ]),
      });

      const riderToDestinationFeature = new Feature({
        geometry: new LineString([
          fromLonLat(riderLocation),
          fromLonLat(destinationLocation),
        ]),
      });

      driverToRiderFeature.setStyle(
        new Style({
          stroke: new Stroke({
            color: "#3b82f6",
            width: 4,
            lineDash: [5, 5],
          }),
        })
      );

      riderToDestinationFeature.setStyle(
        new Style({
          stroke: new Stroke({
            color: "#94a3b8",
            width: 4,
          }),
        })
      );

      routeSource.addFeature(driverToRiderFeature);
      routeSource.addFeature(riderToDestinationFeature);
    }

    // Add layers to map
    map.addLayer(routeLayer);
    map.addLayer(vectorLayer);

    // Center map to fit all points
    const extent = vectorSource.getExtent();
    map.getView().fit(extent, {
      padding: [50, 50, 50, 50],
      maxZoom: 16,
    });
  }, [
    map,
    driverLocation,
    riderLocation,
    destinationLocation,
    isRideStarted,
    routeCoordinates,
  ]);

  return (
    <div
      ref={mapRef}
      className="w-full rounded-lg overflow-hidden border border-gray-200"
      style={{ height }}
    />
  );
}
