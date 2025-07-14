// import axios from 'axios';
// import { url } from "./url";

// const baseurl = url;

// export const getUserProfile = async (userId) => {
//   try {
//     const response = await axios.get(`${baseurl}profile/${userId}`);
//     return response.data;
//   } catch (error) {
//     throw new Error(userId+' Oops, failed to fetch user profile'); //Userid and userId work
//   }
// };

// import axios from 'axios';
// import { url } from "./url";

// const baseurl = url;

// export const getUserProfile = async (userId) => {
//   try {
//     console.log(`Making API call to: ${baseurl}profile/${userId}`);
//     const response = await axios.get(`${baseurl}profile/${userId}`);
//     console.log('API Response:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching user profile:', error);
//     throw new Error(userId+' Oops, failed to fetch user profile'); //Userid and userId work
//   }
// };


import axios from 'axios';
import { url } from "./url";

const baseurl = url;

export const getUserProfile = async (userId) => {
  try {
    const token = localStorage.getItem('authToken'); // Assuming token is stored in localStorage

    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log(`Making API call to: ${baseurl}profile/${userId}`);
    
    const response = await axios.get(`${baseurl}profile/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error(userId + ' Oops, failed to fetch user profile, It might be due to forbidden profile request'); //Userid and userId work
  }
};
