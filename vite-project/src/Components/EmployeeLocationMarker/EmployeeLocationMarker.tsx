import { Marker } from "react-leaflet";
import {
  type GeocodedLocationData,
  type GeocodedMapData,
} from "../../contexts/EmployeeLocationContext";
import { EmployeeLocationPopup } from "../EmployeeLocationPopup/EmployeeLocationPopup";
import "leaflet/dist/leaflet.css";
import L from "leaflet"; // Import Leaflet for type definitions

interface EmployeeLocationMarkerProps {
  locationData: GeocodedLocationData;
}

export const EmployeeLocationMarker = ({
  locationData,
}: EmployeeLocationMarkerProps) => {
  const country = locationData.employees[0].country;
  const city = locationData.employees[0].city;

  const testId = `${country}-${city}`;

  return (
    <Marker
      key={testId}
      position={[locationData.latitude, locationData.longitude]}
      alt={`${country}, ${city}`}
      ref={(markerInstance: L.Marker | null) => {
        if (markerInstance) {
          markerInstance.on("add", () => {
            const markerElement = markerInstance.getElement();
            if (markerElement) {
              markerElement.setAttribute("data-testid", testId);
            } else {
              console.warn(
                `[${testId}] Marker element was null/undefined on 'add' event.`
              );
            }
          });
        }
      }}
    >
      <EmployeeLocationPopup employees={locationData.employees} />
    </Marker>
  );
};
