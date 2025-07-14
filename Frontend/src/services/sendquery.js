import axios from "axios"
import { url } from "./url";
const baseUrl = url
const sendQuery = async (endPoint, data) => {
    try {
        const response = await axios.post(`${baseUrl}${endPoint}`, data);
        if (response.status === 200) {
            return response.data.id
        } else {
            return false
        }
    } catch (error) {
        return false;
    }
}

export default sendQuery