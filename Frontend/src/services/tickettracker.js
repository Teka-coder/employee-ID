import axios from "axios";
import { url } from "./url";
const baseUrl = url;

export const checkTicket = (id) => {
  return axios
    .post(`${baseUrl}trackticket`, { tktid: id })
    .then((result) => {
      if (result.data !== false) {
        return result.data;
      } else {
        return false;
      }
    })
    .catch((error) => {
      return false;
    });
};

export const sendMessage = (request_id, usertype, message) => {
  return axios
    .post(`${baseUrl}insertmessage`, {
      requestId: request_id,
      message: message,
      userType: usertype,
    })
    .then((result) => {
      if(result.status === 200){
        return true
      }else{
        return false
      }
    }).catch(error => false);
};

export const getConversation = (request_id) => {
  return axios
    .post(`${baseUrl}getconvo`, {
      id: request_id,
    })
    .then((result) => {
      if (result) {
        return result.data;
      } else {
        return false;
      }
    })
    .catch((error) => false);
};
