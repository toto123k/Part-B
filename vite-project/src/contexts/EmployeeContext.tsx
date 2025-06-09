// src/context/EmployeeContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
} from "react";
import { fetchAllEmployees } from "../axios/api/employeeService"; // Adjust path as needed
import type { Employee } from "../modules/types"; // Adjust path as needed

interface EmployeeContextType {
  employees: Employee[];
  loading: boolean;
  errorMessage: string | null;
  refreshEmployees: () => void; // Optional: A function to re-fetch employees
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(
  undefined
);

interface EmployeeProviderProps {
  children: ReactNode;
}

export const EmployeeProvider = ({ children }: EmployeeProviderProps) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getEmployees = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchAllEmployees();
      setEmployees(data);
    } catch (err: any) {
      setErrorMessage(
        err.message ?? "An unknown error occurred while fetching employees."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmployees();
  }, []);

  const refreshEmployees = () => {
    getEmployees();
  };

  const contextValue: EmployeeContextType = {
    employees,
    loading,
    errorMessage,
    refreshEmployees,
  };

  return (
    <EmployeeContext.Provider value={contextValue}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error("useEmployees must be used within an EmployeeProvider");
  }
  return context;
};
