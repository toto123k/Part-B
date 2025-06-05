import axios from "axios";
import type { Employee } from "../../modules/types";
import axiosInstance from "../axiosInstance";

export const fetchAllEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await axiosInstance.get<Employee[]>("/employees");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error fetching employees:", error.message);
    }
    throw error;
  }
};
