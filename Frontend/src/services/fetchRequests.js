import axios from "axios";
import { url } from "./url";

const baseUrl = url;

export const getCategories = () => {
  return axios
    .get(`${baseUrl}getcategories`)
    .then((result) => result.data)
    .catch((error) => false);
};
export const getAttachedImages = (id) => {
    return axios.post(`${url}getattachements`, { id: id }).then((result) => {
      if (result.status === 200) {
        return result.data;
      } else {
        return false;
      }
    }).catch((error) => {
      return false;
    });
  };
