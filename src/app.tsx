import React, { useState, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { useGeolocated } from "react-geolocated";
import {
  APIProvider,
  Map,
  Marker,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useAdvancedMarkerRef
} from "@vis.gl/react-google-maps";

type Poi = {
  key: string;
  location: google.maps.LatLngLiteral;
  name: string;
  description: string;
};

const locations: Poi[] = [
  { key: "bleedingHorse", location: { lat: 53.33354, lng: -6.2649 }, name: "Bleeding Horse", description: "Historic pub on Camden Street" },
  { key: "D2", location: { lat: 53.33438, lng: -6.26288 }, name: "D2", description: "Nightclub on Harcourt Street" },
  { key: "nearys", location: { lat: 53.34074, lng: -6.26119 }, name: "Neary's", description: "Traditional Irish pub" },
  { key: "davyByrnes", location: { lat: 53.34183, lng: -6.25936 }, name: "Davy Byrnes", description: "Famous for its mention in James Joyce's Ulysses" },
  { key: "duke", location: { lat: 53.34195, lng: -6.25869 }, name: "The Duke", description: "Popular pub on Duke Street" },
  { key: "mcdaids", location: { lat: 53.34125, lng: -6.261 }, name: "McDaid's", description: "Literary pub frequented by famous Irish writers" },
  { key: "toners", location: { lat: 53.33775, lng: -6.25242 }, name: "Toner's", description: "One of Dublin's oldest and most famous pubs" },
  { key: "waterloo", location: { lat: 53.3305, lng: -6.24445 }, name: "Waterloo", description: "Bar known for its live music" },
];


const MarkerWithInfoWindow = ({ poi }: { poi: Poi }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowShown, setInfoWindowShown] = useState(false);

  const handleMarkerClick = useCallback(
    () => setInfoWindowShown(isShown => !isShown),
    []
  );

  const handleClose = useCallback(() => setInfoWindowShown(false), []);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={poi.location}
        onClick={handleMarkerClick}
      >
        <Pin
          background={"#08a04b"}
          glyphColor={"#000"}
          borderColor={"#000"}
        />
      </AdvancedMarker>

      {infoWindowShown && (
        <InfoWindow anchor={marker} onClose={handleClose}>
          <div>
            <h2>{poi.name}</h2>
            <p>{poi.description}</p>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

const PoiMarkers = (props: { pois: Poi[] }) => {
  return (
    <>
      {props.pois.map((poi: Poi) => (
        <MarkerWithInfoWindow key={poi.key} poi={poi} />
      ))}
    </>
  );
};

const GeolocatedMap = () => {
  const [center, setCenter] = useState<google.maps.LatLngLiteral | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const handleApiLoadError = (error: Error) => {
    console.error("Error loading Google Maps API:", error);
    setError(
      "Failed to load Google Maps. Please check your API key and network connection."
    );
  };

  return (
    <div>
      {center ? (
        <APIProvider
          apiKey={process.env.REACT_APP_GOOGLEPLACES_API_KEY || ''}
          onLoad={handleApiLoaded}
          onError={handleApiLoadError}
        >
          <div style={{ height: "400px", width: "100%" }}>
            <Map
              defaultCenter={center}
              mapId='4ee3add0b5d7a9ee'
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
    <h2>Your Evening's Itinerary</h2>
    <GeolocatedMap />
  </div>
);

const root = createRoot(document.getElementById("app")!);
root.render(<App />);

export default App;