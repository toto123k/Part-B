import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { EmployeeCard } from "../../Components/EmplyoeeCard/EmployeeCard";
import { fetchAllEmployees } from "../../axios/api/employeeService";
import type { Employee } from "../../modules/types";
import { EmployeeModal } from "../../Components/EmployeeModal/EmployeeModal";
import EmployeeMap from "../../Components/EmployeeMap/EmployeeMap";
import "./App.css";

export const App = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const data = await fetchAllEmployees();
        setEmployees(data);
      } catch (err: any) {
        setErrorMessage(
          err.message ?? "An unknown error occurred while fetching employees."
        );
      } finally {
        setLoading(false);
      }
    };
    getEmployees();
  }, []);

  const handleOpenModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const LoadingTextSx = { textAlign: "center", mt: 4 };

  if (loading) {
    return (
      <Typography variant="h6" sx={LoadingTextSx}>
        Loading team members...
      </Typography>
    );
  }

  if (errorMessage) {
    return (
      <Typography variant="h6" color="error" sx={LoadingTextSx}>
        Oof We Got An Error: {errorMessage}
      </Typography>
    );
  }

  const PageTitleSx = { textAlign: "center", width: "100%" };

  const ErrorMessageSx = { mt: 2 };
  
  return (
    <>
      <Typography variant="h1" sx={PageTitleSx}>
        Meet The Team
      </Typography>

      <Box className="employee-cards-container">
        {employees.length === 0 ? (
          <Typography variant="body1" sx={ErrorMessageSx}>
            No team members found.
          </Typography>
        ) : (
          employees.map((employee, employeeIndex) => (
            <EmployeeCard
              employee={employee}
              onAboutMeClick={() => handleOpenModal(employee)}
              key={employeeIndex}
            />
          ))
        )}
      </Box>
      {selectedEmployee && (
        <EmployeeModal
          handleClose={handleCloseModal}
          open={isModalOpen}
          employeeToShow={selectedEmployee}
        />
      )}

      <EmployeeMap employees={employees}></EmployeeMap>
    </>
  );
};

export default App;
