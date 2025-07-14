import axios from "axios";
import { url } from "./url"; // Base API URL

const baseUrl = url; // Assuming `url` is exported from another file

export const addEmployee = async (data) => {
  try {
    const response = await axios.post(`${baseUrl}addemp`, data, {
      withCredentials: true, // Ensures that cookies (session ID) are sent with the request
      headers: {
        "Content-Type": "multipart/form-data", // Ensure the correct content type is set for file uploads
      },
    });

    if (response.status === 200) {
      return {
        success: true,
        message: "Employee added successfully!",
      };
    }

    return {
      success: false,
      message: "Failed to add employee.",
    };
  } catch (error) {
    console.error("Error adding employee:", error);
    return {
      success: false,
      message: "An error occurred while adding the employee.",
    };
  }
};
