import { Outlet } from "react-router-dom";
import { useState, useEffect, FC } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";
import useLocalStorage from "../hooks/useLocalStorage";

const PersistLogin: FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const refresh = useRefreshToken();
    const { auth } = useAuth();
    const [persist] = useLocalStorage("persist", false);

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (err) {
                console.error(err);
            } finally {
                isMounted && setIsLoading(false);
            }
        };

        // Avoids unwanted call to verifyRefreshToken
        !auth?.accessToken && persist
            ? verifyRefreshToken()
            : setIsLoading(false);

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        console.log(`isLoading: ${isLoading}`);
        console.log(`aT: ${JSON.stringify(auth?.accessToken)}`);
    }, [isLoading]);

    return (
        <>
            {!persist ? <Outlet /> : isLoading ? <p>Loading...</p> : <Outlet />}
        </>
    );
};

export default PersistLogin;
