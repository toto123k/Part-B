import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Box } from "@mui/material";
import { useEmployeeLocations } from "../../contexts/EmployeeLocationContext";
import { EmployeeLocationPopup } from "../EmployeeLocationPopup/EmployeeLocationPopup";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react"; // Import useEffect

const getInitialMapCenter = (
  geocodedMapData: ReturnType<typeof useEmployeeLocations>["geocodedMapData"]
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

const EmployeeMap = () => {
  const { geocodedMapData, isLoading, loadEmployeeLocations } =
    useEmployeeLocations();

  useEffect(() => {
    loadEmployeeLocations();
  }, []);

  const initialMapCenter = getInitialMapCenter(geocodedMapData);
  const MapContainerSx = {
    height: "50rem",
    width: "100%",
    maxWidth: "100rem",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const mapSizeStyling = { height: "100%", width: "100%" };

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
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap={true}
        />
        {Object.values(geocodedMapData).flatMap((countryData) =>
          Object.values(countryData).map((locationData, index) => (
            <Marker
              key={`${locationData.latitude}-${locationData.longitude}-${index}`}
              position={[locationData.latitude, locationData.longitude]}
            >
              <EmployeeLocationPopup employees={locationData.employees} />
            </Marker>
          ))
        )}
      </MapContainer>
    </Box>
  );
};

export default EmployeeMap;
