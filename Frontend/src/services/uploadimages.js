import axios from "axios";
import { url } from "./url";

export const attachImages = (file, feedbackTrackingNumber) => {
    const maxSize = 5 * 1024 * 1024;
    if (!file) {
        return Promise.resolve(false);
    } 
    else if (!file.type.startsWith("image/") || file.size > maxSize) {
        alert("Only image file below 5Mb is allowed");
        return Promise.resolve(false);
    } 
    else {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("id", feedbackTrackingNumber);
        return axios
            .post(`${url}uploadimg`, formData)
            .then((response) => {
                if(response.status === 200){
                    return true;
                }else{
                    return false;
                }
            })
            .catch((error) => {
                return false;
            });
    }
}