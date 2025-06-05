import jakeLogo from "../../assets/jake.jpg";
import "./App.css";
import { Box, Typography } from "@mui/material";
import EmployeeCard from "../../Components/EmplyoeeCard/EmployeeCard";
function App() {
  return (
    <>
      <EmployeeCard
        city="Chicken Island"
        country="Kuntacy"
        firstName="Colonel"
        lastName="Sanders"
        title="Minister of K.F.C"
        imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX5-kfcVbxe7o2Ejs_fvl_JB4NXSQUCiLaQw&s"
      ></EmployeeCard>
    </>
  );
}

export default App;
