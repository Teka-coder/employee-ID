import axios from "axios";
import { url } from "./url";
const baseurl = url
export const userstatus = async() => {
    const response = await axios(`${baseurl}userstat`,{withCredentials:true})
    return response.data
}