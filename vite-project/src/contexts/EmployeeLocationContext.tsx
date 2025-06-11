import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useCallback,
  useRef,
} from "react";
import type { Employee, GroupedEmployees } from "../modules/types";
import { geocodeLocation } from "../services/NinjaApiService";
import { toast } from "react-toastify";
import { useEmployees } from "./EmployeeContext";

export interface GeocodedLocationData {
  latitude: number;
  longitude: number;
  employees: Employee[];
}

export interface GeocodedMapData {
  [country: string]: {
    [city: string]: GeocodedLocationData;
  };
}

interface EmployeeLocationContextType {
  geocodedMapData: GeocodedMapData;
  isLoading: boolean;
  loadEmployeeLocations: () => Promise<void>;
}

const EmployeeLocationContext = createContext<EmployeeLocationContextType>({
  geocodedMapData: {},
  isLoading: true,
  loadEmployeeLocations: async () => {},
});

export const useEmployeeLocations = () => useContext(EmployeeLocationContext);

const groupEmployeesByLocation = (employees: Employee[]): GroupedEmployees => {
  const grouped: GroupedEmployees = {};
  employees.forEach(({ country, city, ...rest }) => {
    if (!grouped[country]) grouped[country] = {};
    if (!grouped[country][city]) grouped[country][city] = [];
    grouped[country][city].push({ country, city, ...rest });
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

interface Props {
  children: ReactNode;
}

export const EmployeeLocationProvider = ({ children }: Props) => {
  const { employees, loading: employeesLoading } = useEmployees();
  const [geocodedMapData, setGeocodedMapData] = useState<GeocodedMapData>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const loadingRef = useRef(false);

  const loadEmployeeLocations = useCallback(async () => {
    if (loadingRef.current || isLoaded || employeesLoading) {
      return;
    }

    loadingRef.current = true;

    const toastId = toast.loading("Loading employee locations...");

    if (employees.length === 0) {
      setGeocodedMapData({});
      setIsLoaded(true);
      loadingRef.current = false;

      toast.update(toastId, {
        render: "No employees to display.",
        type: "info",
        isLoading: false,
        autoClose: 5000,
      });
      return;
    }

    const grouped = groupEmployeesByLocation(employees);
    const data: GeocodedMapData = {};
    let hasError = false;

    for (const country in grouped) {
      data[country] = {};
      for (const city in grouped[country]) {
        try {
          const coords = await getGeocodedLocation(city, country);
          if (coords) {
            data[country][city] = {
              latitude: coords.latitude,
              longitude: coords.longitude,
              employees: grouped[country][city],
            };
          } else {
            toast.warn(`Could not geocode: ${city}, ${country}`);
          }
        } catch (error) {
          console.error(error);
          toast.error(`Error geocoding ${city}, ${country}`);
          hasError = true;
        }
      }
    }

    setGeocodedMapData(data);
    setIsLoaded(true);
    loadingRef.current = false;

    toast.update(toastId, {
      render: hasError
        ? "Some locations failed to load. See console for details."
        : "Employee locations loaded!",
      type: hasError ? "error" : "success",
      isLoading: false,
      autoClose: 4000,
    });
  }, [employees, employeesLoading, isLoaded]);

  return (
    <EmployeeLocationContext.Provider
      value={{
        geocodedMapData,
        isLoading: loadingRef.current,
        loadEmployeeLocations,
      }}
    >
      {children}
    </EmployeeLocationContext.Provider>
  );
};
