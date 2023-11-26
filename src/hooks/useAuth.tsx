import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import { AuthContextProps } from "../data/interfaces";

const useAuth: () => AuthContextProps = () => {
    return useContext(AuthContext);
};

export default useAuth;
