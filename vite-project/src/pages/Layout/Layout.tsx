import { Box, Typography } from "@mui/material";
import "./Layout.css";
import { useEmployees } from "../../contexts/EmployeeContext";
import { Navbar } from "../../Components/Navbar/Navbar";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  const { loading, errorMessage } = useEmployees(); // Use global loading/error

  const LoadingTextSx = { textAlign: "center", mt: 4 };

  return (
    <>
      <Navbar />
      {loading && (
        <Typography variant="h6" sx={LoadingTextSx}>
          Loading team members...
        </Typography>
      )}
      {errorMessage && (
        <Typography variant="h6" color="error" sx={LoadingTextSx}>
          Oof We Got An Error: {errorMessage}
        </Typography>
      )}
      {!loading && !errorMessage && <Outlet />}
    </>
  );
};
