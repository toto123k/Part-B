import { Popup } from "react-leaflet";
import { calculateAge } from "../../utils/employeeUtils";
import type { Employee } from "../../modules/types";

interface EmployeeLocationPopupProps {
  employees: Employee[];
}

export const EmployeeLocationPopup = ({
  employees,
}: EmployeeLocationPopupProps) => {
  return (
    <Popup>
      <strong>
        {employees[0].city}, {employees[0].country}
      </strong>
      <br />
      Employees:
      <ul>
        {employees.map((employee) => (
          <li key={employee.id}>
            {employee.firstName} {employee.lastName} (Age:{" "}
            {calculateAge(new Date(employee.birthDate))})
          </li>
        ))}
      </ul>
    </Popup>
  );
};
