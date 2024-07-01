import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { useGeolocated } from "react-geolocated";
import {
  APIProvider,
  Map,
  Marker,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";

type Poi = { key: string; location: google.maps.LatLngLiteral };
const locations: Poi[] = [
  { key: "bleedingHorse", location: { lat: 53.33354, lng: -6.2649 } },
  { key: "D2", location: { lat: 53.33438, lng: -6.26288 } },
  { key: "nearys", location: { lat: 53.34074, lng: -6.26119 } },
  { key: "davyByrnes", location: { lat: 53.34183, lng: -6.25936 } },
  { key: "duke", location: { lat: 53.34195, lng: -6.25869 } },
  { key: "davyByrnes", location: { lat: 53.34183, lng: -6.25936 } },
  { key: "mcdaids", location: { lat: 53.34125, lng: -6.261 } },
  { key: "toners", location: { lat: 53.33775, lng: -6.25242 } },
  { key: "waterloo", location: { lat: 53.3305, lng: -6.24445 } },
];

const PoiMarkers = (props: { pois: Poi[] }) => {
  return (
    <>
      {props.pois.map((poi: Poi) => (
        <AdvancedMarker key={poi.key} position={poi.location}>
          <Pin
            background={"#08a04b"}
            glyphColor={"#000"}
            borderColor={"#000"}
          />
        </AdvancedMarker>
      ))}
    </>
  );
};

const GeolocatedMap = () => {
  const [center, setCenter] = useState(null);
  const [error, setError] = useState(null);

  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    });

  useEffect(() => {
    if (coords) {
      console.log("Coordinates received:", coords);
      setCenter({ lat: coords.latitude, lng: coords.longitude });
    }
  }, [coords]);

  if (!isGeolocationAvailable) {
    return <div>Your browser does not support Geolocation</div>;
  }
  if (!isGeolocationEnabled) {
    return (
      <div>
        Geolocation is not enabled. Please enable it in your browser settings.
      </div>
    );
  }
  if (!coords) {
    return (
      <div>
        Getting the location data&hellip; If this takes too long, please check
        your location permissions.
      </div>
    );
  }

  const handleApiLoaded = () => {
    console.log("Google Maps API has loaded successfully.");
  };

  const handleApiLoadError = (error) => {
    console.error("Error loading Google Maps API:", error);
    setError(
      "Failed to load Google Maps. Please check your API key and network connection."
    );
  };

  return (
    <div>
      {/*<p>Coordinates: {coords.latitude}, {coords.longitude}</p>*/}
      {center ? (
        <APIProvider
          apiKey={API_KEY}
          onLoad={handleApiLoaded}
          onError={handleApiLoadError}
        >
          <div style={{ height: "400px", width: "100%" }}>
            <Map
              defaultCenter={center}
              mapId= MAP_ID
              defaultZoom={13}
              gestureHandling={"greedy"}
              disableDefaultUI={true}
            >
              <Marker position={center} />
              <PoiMarkers pois={locations} />
            </Map>
          </div>
        </APIProvider>
      ) : (
        <div>Loading map...</div>
      )}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

const App = () => (
  <div>
    <h1>Geolocated Map</h1>
    <GeolocatedMap />
  </div>
);

const root = createRoot(document.getElementById("app"));
root.render(<App />);

export default App;
