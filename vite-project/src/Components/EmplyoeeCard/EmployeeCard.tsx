import type { Employee } from "../../modules/types";
import { ProfilePicture } from "../ProfilePicture/ProfilePicture";
import "./EmployeeCard.css";
import { Typography, Button } from "@mui/material";

interface EmployeeCardProps {
  employee: Employee;
  onAboutMeClick: () => void;
}

export const EmployeeCard = ({
  employee,
  onAboutMeClick,
}: EmployeeCardProps) => {
  const EmployeeDetailsSx = { color: "gray" };
  return (
    <>
      <div className="card">
        <ProfilePicture imageUrl={employee.imageUrl} />
        <h3>{`${employee.firstName} ${employee.lastName}`}</h3>
        <Typography sx={EmployeeDetailsSx}>{employee.title}</Typography>
        <Typography
          sx={EmployeeDetailsSx}
        >{`${employee.city}, ${employee.country}`}</Typography>
        <Button variant="contained" onClick={onAboutMeClick}>
          About Me
        </Button>
      </div>
    </>
  );
};
