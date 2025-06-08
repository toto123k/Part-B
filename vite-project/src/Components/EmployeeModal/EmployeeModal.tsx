import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import type { Employee } from "../../modules/types";
import ProfilePicture from "../ProfilePicture/ProfilePicture";
import popupImage from "../../assets/popup.jpg";
import { Stack } from "@mui/material";

function calculateAge(birthdate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  if (
    today.getMonth() < birthdate.getMonth() ||
    (today.getMonth() === birthdate.getMonth() &&
      today.getDate() < birthdate.getDate())
  ) {
    age--;
  }
  return age;
}

const style = {
  position: "absolute",
  left: "50%",
  transform: "translate(-50%, 0%)",
  width: "85%", 
  maxWidth: "50rem",
  height: "auto",
  maxHeight: "90vh",
  overflowY: "auto", 
  overflowX: "hidden", 
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundImage: `url(${popupImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: "white",
  textAlign: "center",
  boxSizing: "border-box",
};

interface EmployeeModalProps {
  employeeToShow: Employee;
  open: boolean;
  handleClose: () => void;
}

function EmployeeModal({
  employeeToShow,
  open,
  handleClose,
}: EmployeeModalProps) {
  const age = calculateAge(new Date(employeeToShow.birthDate));

  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <ProfilePicture
            imageUrl={employeeToShow.imageUrl || "assets/jake.jpg"}
          />

          <Typography
            id="employee-modal-title"
            variant="h4"
            component="h2"
            sx={{ mt: 2 }}
          >
            {employeeToShow.firstName} {employeeToShow.lastName}
          </Typography>

          <Typography variant="h6" sx={{ mt: 1 }}>
            {employeeToShow.title}
          </Typography>

          {age !== null && (
            <Typography variant="h6" sx={{ mt: 1 }}>
              {age} years old
            </Typography>
          )}

          <hr
            style={{
              borderTop: "1px solid #eee",
              width: "100%",
              margin: "16px 0",
            }}
          />

          <Typography variant="body1" sx={{ mt: 1 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            vel vehicula nisl. Ut mauris metus, fermentum nec orci nec, sagittis
            laoreet eros. Nam porta luctus mi, sodales aliquam nibh convallis
            ac. Nunc tempor malesuada lobortis. Pellentesque habitant morbi
            tristique senectus et netus et malesuada fames ac turpis egestas.
            Phasellus eu tristique enim. Sed id malesuada velit. Suspendisse ut
            nisi quis neque venenatis vestibulum id non ipsum. Aliquam aliquet
            dapibus nisi, ut tempor massa hendrerit ut. Sed efficitur ex
            posuere, interdum turpis a, maximus urna. Aenean sed sapien nec erat
            viverra lobortis cursus sit amet ex. Maecenas vel tempus mi,
            volutpat maximus tortor. Suspendisse tempus eget ligula id mattis.
            Nam porttitor mauris a accumsan convallis.
          </Typography>

          <Stack direction="row" spacing={3} sx={{ pt: 5, pb: 0 }}>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={
                  "https://cdn2.downdetector.com/static/uploads/c/300/f0d8e/FB-f-Logo__blue_512.png"
                }
                alt="Facebook"
                style={{ width: "40px", height: "40px" }}
              />
            </a>
            <a
              href="https://www.linkedin.com/in/example"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/480px-LinkedIn_logo_initials.png"
                }
                alt="LinkedIn"
                style={{ width: "40px", height: "40px" }}
              />
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={"https://m.media-amazon.com/images/I/31AGs2bX7mL.png"}
                alt="Twitter"
                style={{ width: "40px", height: "40px" }}
              />
            </a>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}

export default EmployeeModal;
