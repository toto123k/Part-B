import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import { Box } from "@mui/material";
import {
  useEmployeeLocations,
  type GeocodedMapData,
} from "../../contexts/EmployeeLocationContext";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { EmployeeLocationMarker } from "../EmployeeLocationMarker/EmployeeLocationMarker";

// Helper function to get initial map center (no change needed here)
const getInitialMapCenter = (
  geocodedMapData: GeocodedMapData
): { latitude: number; longitude: number } => {
  const countries = Object.keys(geocodedMapData);
  if (countries.length > 0) {
    const firstCountry = countries[0];
    const cities = Object.keys(geocodedMapData[firstCountry]);
    if (cities.length > 0) {
      const firstCity = cities[0];
      const { latitude, longitude } = geocodedMapData[firstCountry][firstCity];
      return { latitude, longitude };
    }
  }
  return { latitude: 0, longitude: 0 };
};

export const EmployeeMap = () => {
  const { geocodedMapData, isLoading, loadEmployeeLocations } =
    useEmployeeLocations();

  useEffect(() => {
    loadEmployeeLocations();
  }, []);

  const initialMapCenter = getInitialMapCenter(geocodedMapData);
  const MapContainerSx = {
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const mapSizeStyling = {
    height: "100vh",
    width: "100vw",
  };

  if (isLoading) {
    return (
      <Box
        sx={MapContainerSx}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        Loading employee map...
      </Box>
    );
  }

  if (Object.keys(geocodedMapData).length === 0 && !isLoading) {
    return (
      <Box
        sx={MapContainerSx}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        No employee locations available to display.
      </Box>
    );
  }

  return (
    <Box sx={MapContainerSx}>
      <MapContainer
        center={[initialMapCenter.latitude, initialMapCenter.longitude]}
        zoom={5}
        scrollWheelZoom={true}
        style={mapSizeStyling}
        key={"employee-map"}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap={true}
        />
        <ZoomControl position="bottomleft" />
        {Object.values(geocodedMapData).flatMap((countryData) =>
          Object.values(countryData).map((locationData) => (
            <EmployeeLocationMarker locationData={locationData} />
          ))
        )}
      </MapContainer>
    </Box>
  );
};

