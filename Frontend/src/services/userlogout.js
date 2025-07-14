import axios from "axios";
import { url } from "./url";

axios.defaults.withCredentials = true;

export const userlogout = async () => {
  try {
    const response = await axios.get(`${url}userlogout`);
    // Check if the response status is OK and send the message back
    if (response.status === 200 && response.data.message === 'logged out') {
      return { success: true, message: response.data.message }; // Return success and message
    } else {
      return { success: false, message: 'Logout failed' }; // Handle failed response
    }
  } catch (error) {
    console.error("Error logging out:", error);
    return { success: false, message: 'Error during logout' }; // Handle errors
  }
};



// import axios from "axios";
// import { url } from "./url";

// axios.defaults.withCredentials = true;

// export const userlogout = async () => {
//   try {
//     const response = await axios.get(`${url}userlogout`);
//     if (response.status === 200) {
//       // Successfully logged out
//       return true;
//     } else {
//       // Logout failed
//       return false;
//     }
//   } catch (error) {
//     console.error('Error during logout:', error);
//     return false;
//   }
// };


// import axios from 'axios';
// import { url } from './url'; // Adjust the import path according to your project structure

// axios.defaults.withCredentials = true;

// export const userLogout = async () => {
//   try {
//     const response = await axios.get(`${url}userlogout`);
//     return response.status === 200;
//   } catch (error) {
//     console.error('Error during logout:', error);
//     return false;
//   }
// };
