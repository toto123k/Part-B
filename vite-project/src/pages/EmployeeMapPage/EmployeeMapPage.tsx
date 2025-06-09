import { Box, CircularProgress, Typography } from "@mui/material";
import EmployeeMap from "../../Components/EmployeeMap/EmployeeMap";
import { useEmployees } from "../../contexts/EmployeeContext";

export const EmployeeMapPage = () => {
  const { employees, loading, errorMessage } = useEmployees();

  // Reusable styles
  const fullScreenCenterStyles = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  };

  const noDataMessageStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50vh",
    textAlign: "center",
  };

  if (loading) {
    return (
      <Box sx={fullScreenCenterStyles}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="h6">Loading employee data...</Typography>
      </Box>
    );
  }

  if (errorMessage) {
    const errorMessageContainerStyles = {
      ...fullScreenCenterStyles,
      color: "error.main",
      textAlign: "center",
      p: 2,
    };

    return (
      <Box sx={errorMessageContainerStyles}>
        <Typography variant="h6" color="error">
          Error loading employee data:
        </Typography>
        <Typography variant="body1" color="error">
          {errorMessage}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Please ensure the Northwind API server is running and accessible.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {employees.length > 0 ? (
        <EmployeeMap employees={employees} />
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
