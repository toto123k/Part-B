import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Box, Typography } from "@mui/material";
import type { Employee, GroupedEmployees } from "../../modules/Types";
import "leaflet/dist/leaflet.css";
import { useEffect, useState, useMemo } from "react";
import L from "leaflet";
import { calculateAge } from "../../utils/EmployeeUtils";
import API_NINJAS_API_KEY from "../../config/NinjaApi";

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

    grouped[country] = grouped[country] || {};
    grouped[country][city] = grouped[country][city] || [];
    grouped[country][city].push(employee);
  });

  return grouped;
};

const fetchGeocodedLocation = async (
  city: string,
  country: string,
  apiKey: string
): Promise<{ latitude: number; longitude: number } | null> => {
  let geocodeResult = null;

  try {
    console.log(`Geocoding: attempting ${city}, ${country}`);
    const response = await fetch(
      `https://api.api-ninjas.com/v1/geocoding?city=${city}&country=${country}`,
      { headers: { "X-Api-Key": apiKey } }
    );
    const fetchedLocations = await response.json();
    if (fetchedLocations && fetchedLocations.length > 0) {
      geocodeResult = fetchedLocations[0];
    } else {
      console.warn(
        `Geocoding: no results for ${city}, ${country}. Trying city only.`
      );
    }
  } catch (error) {
    console.error(
      `Geocoding error for ${city}, ${country} (attempt 1):`,
      error
    );
  }

  if (!geocodeResult) {
    try {
      console.log(`Geocoding: attempting ${city} only.`);
      const response = await fetch(
        `https://api.api-ninjas.com/v1/geocoding?city=${city}`,
        { headers: { "X-Api-Key": apiKey } }
      );
      const fetchedLocations = await response.json();
      if (fetchedLocations && fetchedLocations.length > 0) {
        geocodeResult = fetchedLocations[0];
      } else {
        console.warn(
          `Geocoding: no results for ${city} (attempt 2). Skipping.`
        );
      }
    } catch (error) {
      console.error(`Geocoding error for ${city} (attempt 2):`, error);
    }
  }

  return geocodeResult
    ? { latitude: geocodeResult.latitude, longitude: geocodeResult.longitude }
    : null;
};

const useEmployeeLocations = (employees: Employee[], apiKey: string) => {
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
          const locationCoords = await fetchGeocodedLocation(
            city,
            country,
            apiKey
          );

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
): [number, number] => {
  const countries = Object.keys(geocodedMapData);
  if (countries.length > 0) {
    const firstCountry = countries[0];
    const cities = Object.keys(geocodedMapData[firstCountry]);
    if (cities.length > 0) {
      const firstCity = cities[0];
      const { latitude, longitude } = geocodedMapData[firstCountry][firstCity];
      return [latitude, longitude];
    }
  }
  return [0, 0];
};

const EmployeeMap = ({ employees }: EmployeeMapProps) => {
  const { geocodedMapData, isLoading } = useEmployeeLocations(
    employees,
    API_NINJAS_API_KEY
  );

  const initialMapCenter: [number, number] =
    getInitialMapCenter(geocodedMapData);

  // Define the geographical bounds for the entire world
  const WORLD_BOUNDS: L.LatLngBoundsExpression = [
    [-90, -180], // Southwest coordinates
    [90, 180], // Northeast coordinates
  ];

  return (
    <Box
      sx={{
        height: "50rem",
        width: "100%",
        maxWidth: "100rem",
        margin: "20px auto",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isLoading ? (
        <Typography variant="h5" color="text.secondary">
          Loading team map...
        </Typography>
      ) : (
        <MapContainer
          center={initialMapCenter}
          zoom={2}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          maxBounds={WORLD_BOUNDS} // Apply maxBounds
          maxBoundsViscosity={1.0} // Make the bounds solid
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
                <Popup>
                  <strong>
                    {locationData.employees[0].city},{" "}
                    {locationData.employees[0].country}
                  </strong>
                  <br />
                  Employees:
                  <ul>
                    {locationData.employees.map((employee) => (
                      <li key={employee.id}>
                        {employee.firstName} {employee.lastName} (Age:{" "}
                        {calculateAge(new Date(employee.birthDate))})
                      </li>
                    ))}
                  </ul>
                </Popup>
              </Marker>
            ))
          )}
        </MapContainer>
      )}
    </Box>
  );
};

export default EmployeeMap;
