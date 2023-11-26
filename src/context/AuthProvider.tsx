import { createContext, useState, FC, ReactNode } from "react";
import { AuthContextProps } from "../data/interfaces";

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [auth, setAuth] = useState({
        user: "",
        roles: [0],
        accessToken: "",
    });

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
