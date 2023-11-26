import axios from "../api/axios";
import useAuth from "./useAuth";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "../data/interfaces";

const useRefreshToken: () => () => Promise<any> = () => {
    const { auth, setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get("/refresh", {
            withCredentials: true,
        });
        setAuth((prev) => {
            const decoded: JwtPayload | undefined = response.data?.accessToken
                ? jwtDecode(response.data.accessToken)
                : undefined;
            return {
                ...prev,
                user: decoded?.UserInfo.username || auth.user,
                roles: decoded?.UserInfo.roles || auth.roles,
                accessToken: response.data.accessToken,
            };
        });
        return response.data.accessToken; //
    };
    return refresh;
};

export default useRefreshToken;
