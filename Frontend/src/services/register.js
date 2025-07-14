import axios from "axios"
import { url } from "./url";
const baseUrl = url
export const register = async (endPoint, data) => {
    try {
        const response = await axios.post(`${baseUrl}${endPoint}`, data);
        if (response.status === 200) {
        const token = response.data.accessToken; // Assuming token is returned from the API
        const id=response.data.RecentUser //both accessToken and RecentUser vars are set and sent from api
        localStorage.setItem('authToken', token); // Store token in local storage
       // return true   //better to respond this recent id because it needed for profile fetch
return response.data.RecentUser;
            // const { token } = response.data.accessToken; // Assuming token is returned upon registration
            // localStorage.setItem('token', token); // Store token in local storage
            // return response.data.accessToken;  //this RecentUser is json data set at backend api
        } else {
            return false
        }
    } catch (error) {
        return false;
    }
}

//export default register

// import axios from 'axios';
// import { url } from "./url";
// const baseurl = url
// export const register = async (userEmail, userPassword,userFirstName,userLastName,userPhone) => {
//     if(userEmail==='' || userPassword==='' || userFirstName==='' || userLastName===''){
//         const sentdata='Nothing to save, some fields are empty';
//         return sentdata;
//     }
//     try {
//         const response = await axios.post(`${baseurl}register`, {  //this is api calling
//             userEmail,
//             userPassword,
//            // createdby: useremail, // or any other user who is creating the account
//            // updatedby: useremail,
//             userFirstName,
//             userLastName,
//             userPhone
//         });
//         return response.data;
//     } catch (error) {
//         throw new Error('Registration failed'+error);
//     }
// };
