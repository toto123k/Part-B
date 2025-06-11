import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./pages/App/App.tsx";
import { ToastContainer } from "react-toastify";
import { EmployeeProvider } from "./contexts/EmployeeContext.tsx";

createRoot(document.getElementById("root")!).render(
  <>
    <EmployeeProvider>
      <App />
      <ToastContainer position="bottom-right" />
    </EmployeeProvider>
  </>
);
