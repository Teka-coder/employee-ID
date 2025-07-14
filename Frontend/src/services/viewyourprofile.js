import axios from "axios";
import { url } from "./url"; // base API URL

const baseUrl = url;

export const viewYourProfile = async (employeeid) => {
  try {
    const response = await axios.get(`${baseUrl}employee/${employeeid}`, {
      withCredentials: false,  // Ensure the session ID or any cookies are sent along with the request
    });

    if (response.status === 200) {
      return {
        success: true,
        employee: response.data.employee,
      };
    }

    return {
      success: false,
      message: "Employee not found.",
    };
  } catch (error) {
    console.error("Error fetching employee profile:", error);
    return {
      success: false,
      message: "An error occurred while fetching the employee profile.",
    };
  }
};
