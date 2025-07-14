import axios from "axios";
import { userstatus } from "./userstatus";
import { url } from "./url";
const baseurl = url

axios.defaults.withCredentials = true
export const authenticate = async(username, password)=> {
    const response = await axios.post(`${baseurl}authenticate`,{
      'username': username,
      'password': password  
    })
    if (response.status===200){
        const token = response.data.token; // Assuming token is returned from the API
        localStorage.setItem('authToken', token); // Store token in local storage
        return true
    }else {
        return false
    }
}