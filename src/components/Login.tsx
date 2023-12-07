import { useRef, useState, useEffect, FC, FormEvent } from "react";
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
                setErrMsg("No Server Response");
            } else if (err.response?.status === 400) {
                setErrMsg("Missing Username or Password");
            } else if (err.response?.status === 401) {
                setErrMsg("Unauthorized");
            } else {
                setErrMsg("Login Failed");
            }
            if (errRef.current) errRef.current.focus();
        }
    };

    const handleDemo: () => void = () => {
        setAuth({
            user: "demo",
            roles: [2000],
            accessToken: "",
        });
        console.log(auth);
        navigate("/");
    };

    return (
        <main>
            <h1 className="title">Tenzi</h1>
            <p
                ref={errRef}
                className={errMsg ? "errmsg" : "offscreen"}
                aria-live="assertive"
            >
                {errMsg}
            </p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    ref={userRef}
                    autoComplete="off"
                    {...userAttribs} //value: value, setValue(e.target.value) from useInputHook
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                />
                <button>Sign In</button>
                <div className="persistCheck">
                    <input
                        type="checkbox"
                        id="persist"
                        onChange={toggleCheck}
                        checked={check}
                    />
                    <label htmlFor="persist">Trust this device</label>
                </div>
            </form>
            <p>
                <span className="line ">
                    <Link className="txtBtn" to="/register">
                        Cereate Account
                    </Link>
                </span>
            </p>
            <span className="line txtBtn">
                <span onClick={handleDemo}>Play without account</span>
            </span>
        </main>
    );
};

export default Login;
