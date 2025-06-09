import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import EmployeeCard from "../../Components/EmplyoeeCard/EmployeeCard";
import { fetchAllEmployees } from "../../axios/api/employeeService";
import type { Employee } from "../../modules/Types";
import EmployeeModal from "../../Components/EmployeeModal/EmployeeModal";
import EmployeeMap from "../../Components/EmployeeMap/EmployeeMap";

function App() {
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
        if (err.message) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage(
            "An unknown error occurred while fetching employees."
          );
        }
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
    setSelectedEmployee(null); // Clear selected employee when closing
  };

  if (loading) {
    return (
      <Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>
        Loading team members...
      </Typography>
    );
  }

  if (errorMessage) {
    return (
      <Typography
        variant="h6"
        color="error"
        sx={{ textAlign: "center", mt: 4 }}
      >
        Oof We Got An Error: {errorMessage}
      </Typography>
    );
  }

  return (
    <>
      <Typography
        variant="h1"
        sx={{ padding: "0px", textAlign: "center", width: "100%" }}
      >
        Meet The Team
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          p: 1,
          m: 1,
          bgcolor: "background.paper",
          borderRadius: 1,
          gap: "6rem",
          justifyContent: "center",
        }}
      >
        {employees.length === 0 ? (
          <Typography variant="body1" sx={{ mt: 2 }}>
            No team members found.
          </Typography>
        ) : (
          employees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              city={employee.city}
              country={employee.country}
              firstName={employee.firstName}
              lastName={employee.lastName}
              title={employee.title}
              imageUrl={employee.imageUrl || "assets/jake.jpg"}
              onAboutMeClick={() => handleOpenModal(employee)}
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
}

export default App;
