import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const logoLinkSx = {
  textDecoration: "none",
};

const logoTextSx = {
  color: "#333",
  fontWeight: 500,
  fontSize: "1rem",
  padding: "0.25rem 0.75rem",
  borderRadius: "1em",
  backgroundColor: "transparent",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
};

const navLinkContainerSx = {
  display: "flex",
  gap: 2,
};

const navbarColoringSx = {
  backgroundColor: "#ffffff",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
};

const ToolBarDisplaySpacingSx = { justifyContent: "space-between" };
export const Navbar = () => {
  return (
    <AppBar position="static" sx={navbarColoringSx}>
      <Toolbar sx={ToolBarDisplaySpacingSx}>
        <Box>
          <Link to="/employees" style={logoLinkSx}>
            {" "}
            <Typography variant="subtitle1" sx={logoTextSx}>
              Meet The Team
            </Typography>
          </Link>
        </Box>

        <Box sx={navLinkContainerSx}>
          <Button color="primary" component={Link} to="/employees">
            Employees
          </Button>
          <Button color="primary" component={Link} to="/map">
            Map
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
