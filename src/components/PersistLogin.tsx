import { Outlet } from "react-router-dom";
import style from "../styles/partials/Authorization.module.scss";
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

    return (
        <>
            {!persist ? (
                <Outlet />
            ) : isLoading ? (
                <section className={style.authorization}>
                    <img
                        src={require("../images/persist_loading.gif")}
                        alt="loading-gif"
                        className={style.authorization__loadingIMG}
                    />
                </section>
            ) : (
                <Outlet />
            )}
        </>
    );
};

export default PersistLogin;
