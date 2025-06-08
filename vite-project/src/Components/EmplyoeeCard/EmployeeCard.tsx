import "./EmployeeCard.css";
import { Box, Typography, Button } from "@mui/material";

interface EmployeeCardProps {
  imageUrl: string;
  firstName: string;
  lastName: string;
  title: string;
  city: string;
  country: string;
  onAboutMeClick: () => void;
}

function EmployeeCard({
  imageUrl,
  firstName,
  lastName,
  title,
  city,
  country,
  onAboutMeClick,
}: EmployeeCardProps) {
  return (
    <>
      <div className="card">
        <div className="logo">
          <img
            src={imageUrl}
            className="logo"
            alt={`${firstName} ${lastName}'s profile`}
          />
        </div>
        <h3>{`${firstName} ${lastName}`}</h3>
        <Typography sx={{ color: "gray" }}>{title}</Typography>
        <Typography sx={{ color: "gray" }}>{`${city}, ${country}`}</Typography>
        <Button
          variant="contained"
          sx={{ margin: "2rem" }}
          onClick={onAboutMeClick}
        >
          About Me
        </Button>
      </div>
    </>
  );
}

export default EmployeeCard;
