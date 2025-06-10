import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { EmployeeCard } from "../../Components/EmplyoeeCard/EmployeeCard";
import type { Employee } from "../../modules/types";
import { EmployeeModal } from "../../Components/EmployeeModal/EmployeeModal";
import { useEmployees } from "../../contexts/EmployeeContext";

export const EmployeePage = () => {
  const { employees } = useEmployees();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  const handleOpenModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const PageTitleSx = {
    textAlign: "center",
    width: "100%",
    marginTop: "3.5rem",
  };
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
    </>
  );
};

export default EmployeePage;
