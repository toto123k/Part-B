import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Box } from "@mui/material";
import type { Employee, GroupedEmployees } from "../../modules/types";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { geocodeLocation } from "../../services/NinjaApiService";
import { EmployeeLocationPopup } from "../EmployeeLocationPopup/EmployeeLocationPopup";
import { toast } from "react-toastify"; // Import toast

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
  return await geocodeLocation(city, country).then(async (geoCodeResult) => {
    return geoCodeResult ?? (await geocodeLocation(city));
  });
};

const useEmployeeLocations = (employees: Employee[]) => {
  const [geocodedMapData, setGeocodedMapData] = useState<GeocodedMapData>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const processEmployeeLocations = async () => {
      setIsLoading(true);
      const toastId = toast.loading("Loading employee locations...");

      if (employees.length === 0) {
        setGeocodedMapData({});
        setIsLoading(false);
        toast.update(toastId, {
          render: "No employees to display on the map.",
          type: "info",
          isLoading: false,
          autoClose: 5000,
        });
        return;
      }

      const groupedEmployees = groupEmployeesByLocation(employees);
      const newGeocodedMapData: GeocodedMapData = {};
      let hasError = false;

      for (const country in groupedEmployees) {
        newGeocodedMapData[country] = {};
        for (const city in groupedEmployees[country]) {
          const employees = groupedEmployees[country][city];
          try {
            const coords = await getGeocodedLocation(city, country);

            if (coords) {
              newGeocodedMapData[country][city] = {
                latitude: coords.latitude,
                longitude: coords.longitude,
                employees: employees,
              };
            } else {
              toast.warn(`Could not geocode: ${city}, ${country}`);
            }
          } catch (error) {
            toast.error(`Error geocoding ${city}, ${country}:`, error);
            hasError = true;
          }
        }
      }

      setGeocodedMapData(newGeocodedMapData);
      setIsLoading(false);

      if (hasError) {
        toast.update(toastId, {
          render:
            "Some locations could not be mapped. Check console for details.",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      } else {
        toast.update(toastId, {
          render: "Employee locations loaded successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      }
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
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    !isLoading && (
      <Box sx={MapContainerSx}>
        <MapContainer
          center={[initialMapCenter.latitude, initialMapCenter.longitude]}
          zoom={5}
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
      </Box>
    )
  );
};

export default EmployeeMap;
