import React, { useState, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { useGeolocated } from "react-geolocated";
import {
  FacebookShareButton,
  WhatsappShareButton,
  EmailShareButton,
  LinkedinShareButton,
  FacebookIcon,
  WhatsappIcon,
  EmailIcon,
  LinkedinIcon

} from "react-share";
import {
  APIProvider,
  Map,
  Marker,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";

type Poi = {
  key: string;
  location: google.maps.LatLngLiteral;
  name: string;
  description: string;
};

const locations: Poi[] = [
  {
    key: "bleedingHorse",
    location: { lat: 53.33354, lng: -6.2649 },
    name: "Bleeding Horse",
    description: (
      <a href="https://drive.google.com/file/d/1ckc83S8PqdK4tIndMeqQtzdVpOaZ3q1C/view?usp=drive_link" class="irish-orange-link">
        Traditinal bar in high ceilinged historic building with two wooden
        balconies and large windows.
      </a>
    ),
  },
  {
    key: "D2",
    location: { lat: 53.33438, lng: -6.26288 },
    name: "D2",
    description: (
      <a href="https://drive.google.com/file/d/1Y6iMZ_PZ4p0G7bvlQi5Tjh9BMNBRNNfq/view?usp=drive_link" class="irish-orange-link">
        Buzzing bar with rock walled garden and club.
      </a>
    ),
  },
  {
    key: "nearys",
    location: { lat: 53.34074, lng: -6.26119 },
    name: "Neary's",
    description: (
      <a href="https://drive.google.com/file/d/1v9yuevXkVFZxe8xcsCBxsny69I_6hXbB/view?usp=drive_link" class="irish-orange-link">
        Traditional Irish pub
      </a>
    ),
  },
  {
    key: "davyByrnes",
    location: { lat: 53.34183, lng: -6.25936 },
    name: "Davy Byrnes",
    description: (
      <a href="https://drive.google.com/file/d/1FpicQ5_LrWqmQZAFe626VQvFNASutZK1/view?usp=drive_link" class="irish-orange-link">
        Famous for its mention in James Joyce's Ulysses
      </a>
    ),
  },
  {
    key: "duke",
    location: { lat: 53.34195, lng: -6.25869 },
    name: "The Duke",
    description: (
      <a href="https://drive.google.com/file/d/1BTTMoFhngSNItaFgqTqIyKB4Lm4uciU0/view?usp=drive_link" class="irish-orange-link">
        Popular pub on Duke Street
      </a>
    ),
  },
  {
    key: "mcdaids",
    location: { lat: 53.34125, lng: -6.261 },
    name: "McDaid's",
    description: (
      <a href="https://drive.google.com/file/d/1QiCqeOJ-zqlenSClmgWaP1dohlWxm0k7/view?usp=drive_link" class="irish-orange-link">
        Literary pub frequented by famous Irish writers
      </a>
    ),
  },
  {
    key: "toners",
    location: { lat: 53.33775, lng: -6.25242 },
    name: "Toner's",
    description: (
      <a href="https://drive.google.com/file/d/1t1u5yyrreUkQCRDFg_i2_OT9OtCCqR9r/view?usp=drive_link" class="irish-orange-link">
        One of Dublin's oldest and most famous pubs
      </a>
    ),
  },
  {
    key: "waterloo",
    location: { lat: 53.3305, lng: -6.24445 },
    name: "Waterloo",
    description: (
      <a href="https://drive.google.com/file/d/1rqUKCyZz4Yhwi9nHW1xN0odKR64u7stJ/view?usp=drive_link" class="irish-orange-link">
        Bar known for its live music
      </a>
    ),
  },
];

const MarkerWithInfoWindow = ({ poi }: { poi: Poi }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowShown, setInfoWindowShown] = useState(false);

  const handleMarkerClick = useCallback(
    () => setInfoWindowShown((isShown) => !isShown),
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
        <Pin background={"#08a04b"} glyphColor={"#000"} borderColor={"#000"} />
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
          apiKey={process.env.REACT_APP_GOOGLEPLACES_API_KEY || ""}
          onLoad={handleApiLoaded}
          onError={handleApiLoadError}
        >
          <div style={{ height: "500px", width: "100%" }}>
            <Map
              defaultCenter={center}
              mapId="4ee3add0b5d7a9ee"
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

// Get the URL and title of the current page dynamically
const ShareComponent = () => {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const title =
    typeof document !== "undefined"
      ? document.title
      : "Check out this awesome Dublin's Literary Pub Crawl!";

  return (
    <section id="share" className="share-section">
      <h2>Spread the Literary Love!</h2>
      <p>
        Enjoyed your pub crawl? Share this literary adventure with your
        friends and family!
      </p>
      <div className="share-buttons">
        <FacebookShareButton url={shareUrl} quote={title}>
          <FacebookIcon size={48} round />
        </FacebookShareButton>
        <WhatsappShareButton url={shareUrl} title={title}>
          <WhatsappIcon size={48} round />
        </WhatsappShareButton>
        <EmailShareButton url={shareUrl} title={title}>
          <EmailIcon size={48} round />
        </EmailShareButton>
        <LinkedinShareButton url={shareUrl} title={title}>
          <LinkedinIcon size={48} round />
        </LinkedinShareButton>
      </div>
    </section>
  );
};

const App = () => (
  <div>
    <h2>Dublin's Literary Pub Crawl</h2>
    <GeolocatedMap />
  </div>
);

const root = createRoot(document.getElementById("app")!);
root.render(<App />);

// Render ShareComponent separately
const shareRoot = createRoot(document.getElementById("share-component")!);
shareRoot.render(<ShareComponent />);

export default App;
