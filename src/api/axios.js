import axios from "axios";

const BASE_URL = "http://localhost:3500"; //LOCAL
// const BASE_URL = "https://tenziserver-sl6h2q42.b4a.run/"; //back4app

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
