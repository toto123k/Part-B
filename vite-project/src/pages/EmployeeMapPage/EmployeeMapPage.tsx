import { Box, Typography } from "@mui/material";
import { EmployeeMap } from "../../Components/EmployeeMap/EmployeeMap";
import { useEmployees } from "../../contexts/EmployeeContext";

export const EmployeeMapPage = () => {
  const { employees } = useEmployees();

  const noDataMessageStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50vh",
    textAlign: "center",
  };

  return (
    <Box>
      {employees.length > 0 ? (
        <EmployeeMap />
      ) : (
        <Box sx={noDataMessageStyles}>
          <Typography variant="h6">
            No employee data available to display on the map.
            <br />
            (Check if the API is returning any employees or if there's a
            filtering issue.)
          </Typography>
        </Box>
      )}
    </Box>
  );
};
