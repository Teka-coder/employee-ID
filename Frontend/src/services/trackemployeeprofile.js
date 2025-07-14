import axios from 'axios';
import { url } from "./url"; // base API URL

const baseUrl = url;


// Define the API URL (change this to your actual API endpoint)
const API_URL = `${baseUrl}`; // Replace with your API URL

// Function to track employee profile by their unique employee ID
export const trackEmployeeProfile = async (employeeid) => {
  try {
    // Make an API call to get the employee profile data by the employee ID
    const response = await axios.get(`${API_URL}trackemployeeprofile/${employeeid}`);

    // Check if the response has the expected data
    if (response.data && response.data.success) {
      // Return the employee data in the success case
      return {
        success: true,
        employee: response.data.employee,
      };
    } else {
      // Return failure case if the employee is not found
      return {
        success: false,
        message: response.data.message || 'Employee not found',
      };
    }
  } catch (error) {
    console.error('Error fetching employee profile:', error);

    // Return error response if there was a problem with the API call
    return {
      success: false,
      message: 'An error occurred while fetching the employee profile',
    };
  }
};
