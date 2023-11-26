import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogout: () => () => Promise<void> = () => {
    const { setAuth } = useAuth();

    const logout = async () => {
        setAuth({ user: "", roles: [0], accessToken: "" });
        try {
            const response = await axios("/logout", {
                withCredentials: true,
            });
        } catch (err) {
            console.error(err);
        }
    };

    return logout;
};

export default useLogout;
