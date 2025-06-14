import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { EmployeeProvider } from "../../contexts/EmployeeContext";
import { EmployeeLocationProvider } from "../../contexts/EmployeeLocationContext";
import { EmployeePage } from "../EmployeePage/EmployeePage";
import { Layout } from "../Layout/Layout";
import { EmployeeMapPage } from "../EmployeeMapPage/EmployeeMapPage";

export const App = () => {
  return (
    <BrowserRouter>
      <EmployeeProvider>
        <EmployeeLocationProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/employees" replace />} />

              <Route index path="employees" element={<EmployeePage />} />

              <Route path="map" element={<EmployeeMapPage />} />
            </Route>
          </Routes>
        </EmployeeLocationProvider>
      </EmployeeProvider>
    </BrowserRouter>
  );
};
