import axios from "axios";

// const BASE_URL = "http://localhost:3500"; //LOCAL
const BASE_URL = "https://plum-enthusiastic-hatchling.cyclic.app"; //https://app.cyclic.sh/

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
