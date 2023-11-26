import { useLocation, Navigate, Outlet } from "react-router-dom";
import { FC } from "react";
import useAuth from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "../data/interfaces";

interface Props {
    allowedRoles: number[];
}

const RequireAuth: FC<Props> = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();

    const decoded: JwtPayload | undefined = auth?.accessToken
        ? jwtDecode(auth.accessToken)
        : undefined;

    const roles = decoded?.UserInfo.roles || auth.roles; //or dependency given to get possibility play demo (demo player roles: 2000)

    return roles.find((role) => allowedRoles?.includes(role)) ? (
        <Outlet />
    ) : auth?.user ? (
        <Navigate to="/unauthorized" state={{ from: location }} replace />
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    );
};

export default RequireAuth;
