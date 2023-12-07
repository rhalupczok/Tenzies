import axios from "axios";
const BASE_URL = "https://shielded-cove-16467-80de1c68a131.herokuapp.com/";

export default axios.create({
    //standard req
    baseURL: BASE_URL,
});
export const axiosPrivate = axios.create({
    //for react interceptors req
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});
