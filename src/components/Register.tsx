import { useRef, useState, useEffect, FC } from "react";
import style from "../styles/partials/Authorization.module.scss";
import {
    faCheck,
    faTimes,
    faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";

const USER_REGEX: RegExp = /^[A-z][A-z0-9-_]{3,10}$/;
const PWD_REGEX: RegExp =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{5,15}$/;
const REGISTER_URL: string = "/register";

const Register: FC = () => {
    const userRef = useRef<HTMLInputElement | null>(null);
    const errRef = useRef<HTMLParagraphElement | null>(null);

    const [user, setUser] = useState<string>("");
    const [validName, setValidName] = useState<boolean>(false);
    const [userFocus, setUserFocus] = useState<boolean>(false);

    const [pwd, setPwd] = useState<string>("");
    const [validPwd, setValidPwd] = useState<boolean>(false);
    const [pwdFocus, setPwdFocus] = useState<boolean>(false);

    const [matchPwd, setMatchPwd] = useState<string>("");
    const [validMatch, setValidMatch] = useState<boolean>(false);
    const [matchFocus, setMatchFocus] = useState<boolean>(false);

    const [errMsg, setErrMsg] = useState<string>("");
    const [success, setSuccess] = useState<boolean>(false);

    useEffect(() => {
        userRef.current?.focus();
    }, []); // focus on user imput when comp loads

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user]);

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd]);

    useEffect(() => {
        setErrMsg("");
    }, [user, pwd, matchPwd]);

    const handleSubmit: (e: React.FormEvent) => Promise<void> = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post(
                REGISTER_URL,
                JSON.stringify({ user, pwd }),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            setSuccess(true);
            //clear state and controlled inputs
            //need value attrib on inputs for this
            setUser("");
            setPwd("");
            setMatchPwd("");
        } catch (err: AxiosError | any) {
            if (!err?.response) {
                setErrMsg("No Server Response");
            } else if (err.response?.status === 409) {
                setErrMsg("Username is already used");
            } else {
                console.log(err?.response);
                setErrMsg("Registration Failed");
            }
            if (errRef.current) errRef.current.focus();
        }
    };

    return (
        <section className={style.authorization}>
            <header className={style.authorization__header}>
                <h1>Tenzi</h1>
            </header>
            {success ? (
                <article className={style.authorization__authStatus}>
                    <FontAwesomeIcon icon={faCheck} />
                    <h2>Success!</h2>
                    <p>Your account has been successfully created.</p>

                    <p>
                        <Link
                            className={style.authorization__txtBtn}
                            to="/login"
                        >
                            Login
                        </Link>
                    </p>
                </article>
            ) : (
                <>
                    <p
                        ref={errRef}
                        className={
                            errMsg ? `${style.authorization__errMsg}` : "jsHide"
                        }
                        aria-live="assertive"
                    >
                        {errMsg}
                    </p>
                    <form onSubmit={handleSubmit} className={style.form}>
                        <label className={style.form__label} htmlFor="username">
                            Username:
                            <FontAwesomeIcon
                                icon={faCheck}
                                className={
                                    validName
                                        ? `${style.form__icon_valid}`
                                        : "jsHide"
                                }
                            />
                            <FontAwesomeIcon
                                icon={faTimes}
                                className={
                                    validName || !user
                                        ? "jsHide"
                                        : `${style.form__icon_invalid}`
                                }
                            />
                        </label>
                        <input
                            className={style.form__input}
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />
                        <p
                            id="uidnote"
                            className={
                                userFocus && user && !validName
                                    ? `${style.form__instruction}`
                                    : "jsHide"
                            }
                        >
                            <FontAwesomeIcon icon={faInfoCircle} /> 3 to 10
                            characters.
                            <br />
                            Must begin with a letter.
                            <br />
                            Letters, numbers, underscores, hyphens allowed.
                        </p>

                        <label className={style.form__label} htmlFor="password">
                            Password:
                            <FontAwesomeIcon
                                icon={faCheck}
                                className={
                                    validPwd
                                        ? `${style.form__icon_valid}`
                                        : "jsHide"
                                }
                            />
                            <FontAwesomeIcon
                                icon={faTimes}
                                className={
                                    validPwd || !pwd
                                        ? "jsHide"
                                        : `${style.form__icon_invalid}`
                                }
                            />
                        </label>
                        <input
                            className={style.form__input}
                            type="password"
                            autoComplete="off"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                        <p
                            id="pwdnote"
                            className={
                                pwdFocus && !validPwd
                                    ? `${style.form__instruction}`
                                    : "jsHide"
                            }
                        >
                            <FontAwesomeIcon icon={faInfoCircle} /> 5 to 15
                            characters.
                            <br />
                            Must include uppercase and lowercase letters, a
                            number and a special character.
                            <br />
                            Allowed special characters:{" "}
                            <span aria-label="exclamation mark">!</span>{" "}
                            <span aria-label="at symbol">@</span>{" "}
                            <span aria-label="hashtag">#</span>{" "}
                            <span aria-label="dollar sign">$</span>{" "}
                            <span aria-label="percent">%</span>
                        </p>

                        <label
                            className={style.form__label}
                            htmlFor="confirm_pwd"
                        >
                            Confirm Password:
                            <FontAwesomeIcon
                                icon={faCheck}
                                className={
                                    validMatch && matchPwd
                                        ? `${style.form__icon_valid}`
                                        : "jsHide"
                                }
                            />
                            <FontAwesomeIcon
                                icon={faTimes}
                                className={
                                    validMatch || !matchPwd
                                        ? "jsHide"
                                        : `${style.form__icon_invalid}`
                                }
                            />
                        </label>
                        <input
                            className={style.form__input}
                            type="password"
                            autoComplete="off"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <button
                            className={style.form__button}
                            disabled={
                                !validName || !validPwd || !validMatch
                                    ? true
                                    : false
                            }
                        >
                            Sign Up
                        </button>
                    </form>
                    <p>Already registered?</p>
                    <Link className={style.authorization__txtBtn} to="/login">
                        Login
                    </Link>
                </>
            )}
        </section>
    );
};

export default Register;
