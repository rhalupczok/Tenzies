import { useRef, useState, useEffect, FC, FormEvent } from "react";
import style from "../styles/partials/Authorization.module.scss";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useInput from "../hooks/useInput";
import useToggle from "../hooks/useToggle";
import { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "../data/interfaces";
import axios from "../api/axios";
const LOGIN_URL = "/auth";

const Login: FC = () => {
    const { auth, setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef<HTMLInputElement | null>(null);
    const errRef = useRef<HTMLParagraphElement | null>(null);

    const [user, resetUser, userAttribs] = useInput("user", ""); //useState("");
    const [pwd, setPwd] = useState<string>("");
    const [errMsg, setErrMsg] = useState<string>("");
    const [check, toggleCheck] = useToggle("persist", false);

    useEffect(() => {
        userRef.current?.focus();
    }, []);

    useEffect(() => {
        setErrMsg("");
    }, [user, pwd]);

    const handleSubmit: (e: FormEvent) => Promise<void> = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                LOGIN_URL,
                JSON.stringify({ user, pwd }),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            const accessToken: string = response?.data?.accessToken;
            const decoded: JwtPayload | undefined = accessToken
                ? jwtDecode(accessToken)
                : undefined;

            const roles: number[] = decoded?.UserInfo.roles || [];
            setAuth({ user, roles, accessToken });
            resetUser();
            setPwd("");
            navigate(from, { replace: true });
        } catch (err: AxiosError | any) {
            if (!err?.response) {
                setErrMsg("Server is down");
            } else if (err.response?.status === 400) {
                setErrMsg("Missing Username or Password");
            } else if (err.response?.status === 401) {
                setErrMsg("Unauthorized - check Username and Password");
            } else {
                setErrMsg("Login Failed");
            }
            if (errRef.current) errRef.current.focus();
        }
    };

    const handleDemo: () => void = () => {
        setAuth({
            user: "",
            roles: [2000],
            accessToken: "",
        });
        navigate("/");
    };

    return (
        <section className={style.authorization}>
            <aside className={style.authorization__demoData}>
                <p>DEMO User</p>
                <p>
                    U: <i>demo</i>
                </p>
                <p>
                    P: <i>Demo1!</i>
                </p>
            </aside>
            <header className={style.authorization__header}>
                <h1>Tenzi</h1>
            </header>
            <h2>Login</h2>
            <p
                ref={errRef}
                className={errMsg ? `${style.authorization__errMsg}` : "jsHide"}
                aria-live="assertive"
            >
                {errMsg}
            </p>

            <form onSubmit={handleSubmit} className={style.form}>
                <label className={style.form__label} htmlFor="username">
                    Username:
                </label>
                <input
                    className={style.form__input}
                    type="text"
                    id="username"
                    ref={userRef}
                    autoComplete="off"
                    {...userAttribs} //value: value, setValue(e.target.value) from useInputHook
                    required
                />

                <label className={style.form__label} htmlFor="password">
                    Password:
                </label>
                <input
                    className={style.form__input}
                    type="password"
                    autoComplete="off"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                />
                <button className={style.form__button}>Login</button>
                <p className={style.form__persistCheck}>
                    <input
                        type="checkbox"
                        id="persist"
                        onChange={toggleCheck}
                        checked={check}
                    />
                    <label className={style.form__label} htmlFor="persist">
                        Trust this device
                    </label>
                </p>
            </form>
            <p>
                <Link className={style.authorization__txtBtn} to="/register">
                    Cereate Account
                </Link>
            </p>
            <p className={style.authorization__txtBtn} onClick={handleDemo}>
                Play without account
            </p>
        </section>
    );
};

export default Login;
