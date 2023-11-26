import axios from "axios";
const BASE_URL = "http://localhost:3500";

export default axios.create({
    baseURL: BASE_URL,
});
export const axiosPrivate = axios.create({
    //interceptors ?
    baseURL: BASE_URL, // it is needed for refresh token when initial refresh is denied
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});
