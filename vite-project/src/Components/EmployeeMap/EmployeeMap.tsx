import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Box, Typography } from "@mui/material";
import type { Employee, GroupedEmployees } from "../../modules/types";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { geocodeLocation } from "../../services/NinjaApiService";
import { EmployeeLocationPopup } from "../EmployeeLocationPopup/EmployeeLocationPopup";

interface EmployeeMapProps {
  employees: Employee[];
}

interface GeocodedLocationData {
  latitude: number;
  longitude: number;
  employees: Employee[];
}

interface GeocodedMapData {
  [country: string]: {
    [city: string]: GeocodedLocationData;
  };
}

const groupEmployeesByLocation = (employees: Employee[]): GroupedEmployees => {
  const grouped: GroupedEmployees = {};

  employees.forEach((employee) => {
    const { country, city } = employee;

    grouped[country] = grouped[country] ?? {};
    grouped[country][city] = grouped[country][city] ?? [];
    grouped[country][city].push(employee);
  });

  return grouped;
};

const getGeocodedLocation = async (
  city: string,
  country: string
): Promise<{ latitude: number; longitude: number } | null> => {
  let geocodeResult = null;

  console.log(`Geocoding: attempting ${city}, ${country}`);
  geocodeResult = await geocodeLocation(city, country);

  if (!geocodeResult) {
    console.warn(
      `Geocoding: no results for ${city}, ${country}. Trying city only.`
    );
    console.log(`Geocoding: attempting ${city} only.`);
    geocodeResult = await geocodeLocation(city);
    if (!geocodeResult) {
      console.warn(`Geocoding: no results for ${city} (attempt 2). Skipping.`);
    }
  }

  return geocodeResult
    ? { latitude: geocodeResult.latitude, longitude: geocodeResult.longitude }
    : null;
};

const useEmployeeLocations = (employees: Employee[]) => {
  const [geocodedMapData, setGeocodedMapData] = useState<GeocodedMapData>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const processEmployeeLocations = async () => {
      setIsLoading(true);
      if (employees.length === 0) {
        setGeocodedMapData({});
        setIsLoading(false);
        return;
      }

      const groupedEmployees = groupEmployeesByLocation(employees);
      const newGeocodedMapData: GeocodedMapData = {};

      for (const country in groupedEmployees) {
        newGeocodedMapData[country] = {};
        for (const city in groupedEmployees[country]) {
          const employeesInCity = groupedEmployees[country][city];
          const locationCoords = await getGeocodedLocation(city, country);

          if (locationCoords) {
            newGeocodedMapData[country][city] = {
              latitude: locationCoords.latitude,
              longitude: locationCoords.longitude,
              employees: employeesInCity,
            };
          }
        }
      }
      setGeocodedMapData(newGeocodedMapData);
      setIsLoading(false);
    };

    processEmployeeLocations();
  }, [employees]);

  return { geocodedMapData, isLoading };
};

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

const EmployeeMap = ({ employees }: EmployeeMapProps) => {
  const { geocodedMapData, isLoading } = useEmployeeLocations(employees);

  const initialMapCenter = getInitialMapCenter(geocodedMapData);
  const MapContainerSx = {
    height: "50rem",
    width: "100%",
    maxWidth: "100rem",
    margin: "20px auto",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <Box sx={MapContainerSx}>
      {isLoading ? (
        <Typography variant="h5" color="text.secondary">
          Loading team map...
        </Typography>
      ) : (
        <MapContainer
          center={[initialMapCenter.latitude, initialMapCenter.longitude]}
          zoom={2}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            noWrap={true}
          />

          {Object.values(geocodedMapData).map((countryData) =>
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
      )}
    </Box>
  );
};

export default EmployeeMap;
