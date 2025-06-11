import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import type { Employee } from "../../modules/types";
import { ProfilePicture } from "../ProfilePicture/ProfilePicture";
import popupImage from "../../assets/popup.jpg";
import "./EmployeeModal.css";
import { SocialMediaStack } from "../SocialMediaStack/SocialMediaStack";
import { calculateAge } from "../../utils/employeeUtils";

const ModalContentStyle = {
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

export const EmployeeModal = ({
  employeeToShow,
  open,
  handleClose,
}: EmployeeModalProps) => {
  const age = calculateAge(new Date(employeeToShow.birthDate));

  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={ModalContentStyle}>
          <ProfilePicture imageUrl={employeeToShow.imageUrl} />

          <Typography
            className="employee-modal-title"
            variant="h4"
            component="h2"
          >
            {employeeToShow.firstName} {employeeToShow.lastName}
          </Typography>

          <Typography variant="h6" className="employee-modal-title">
            {employeeToShow.title}
          </Typography>

          <Typography variant="h6" className="employee-modal-title">
            {age} years old
          </Typography>

          <hr className="employee-modal-content " />

          <Typography variant="body1">
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

          <SocialMediaStack />
        </Box>
      </Modal>
    </div>
  );
};
