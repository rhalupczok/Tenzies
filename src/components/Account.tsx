import { FC, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import usePlayerInfo from "../hooks/usePlayerInfo";
import { Link } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Account: FC = () => {
    const axiosPrivate = useAxiosPrivate();
    const SCORES_URL = "/tenziGame";
    const { auth, setAuth } = useAuth();
    const { player, setPlayer } = usePlayerInfo();
    const logout = useLogout();

    const saveScoreCheck = () => {
        setPlayer((prevState) => {
            return {
                ...prevState,
                saveScore: !prevState.saveScore,
            };
        });
    };

    const deleteAccount = async () => {
        try {
            const response = await axiosPrivate.delete(
                `${SCORES_URL}/deleteUser/${auth.user}`
            );
            setAuth({ user: "", roles: [0], accessToken: "" });
        } catch (err) {
            console.error(err);
        }
    };

    const deleteUserScores = async () => {
        try {
            const response = await axiosPrivate.delete(
                `${SCORES_URL}/${auth.user}`
            );
        } catch (err) {
            console.error(err);
        }
        setPlayer((prevState) => {
            return {
                ...prevState,
                refreshTableFlag: !prevState.refreshTableFlag,
            };
        });
    };

    useEffect(() => {
        const menu = document.querySelector(".account--menu");
        const menuBtn = document.querySelector(".account--info");
        document.addEventListener("click", (event: MouseEvent) => {
            if (
                event.target instanceof Node &&
                menu &&
                menuBtn &&
                !menu.contains(event.target) &&
                !menuBtn.contains(event.target)
            ) {
                menu.classList.add("hide");
            }
        });
        return document.removeEventListener("click", (event: MouseEvent) => {
            if (
                event.target instanceof Node &&
                menu &&
                menuBtn &&
                !menu.contains(event.target) &&
                !menuBtn.contains(event.target)
            ) {
                menu.classList.add("hide");
            }
        });
    }, []);

    const displayUserMenu: () => void = () => {
        const menu = document.querySelector(".account--menu");
        menu?.classList.toggle("hide");
    };
    return (
        <div className="account">
            {auth?.roles?.includes(2001) ? (
                <>
                    <span className="account--info">
                        {`Hello, ${auth.user} `}
                        <span
                            className="account--display-btn"
                            onClick={displayUserMenu}
                        >
                            <FontAwesomeIcon icon={faGear} />
                        </span>
                    </span>
                    <ul className="account--menu hide">
                        <li className="account--li-checkbox">
                            <input
                                className="check"
                                type="checkbox"
                                id="saveScores"
                                onChange={saveScoreCheck}
                                checked={player.saveScore}
                            />
                            <label htmlFor="saveScores">
                                Remember my scores
                            </label>
                        </li>
                        <li onClick={deleteUserScores}>Clear all my scores</li>
                        <div className="account--li-btns">
                            <button
                                disabled={auth.user === "demo" ? true : false}
                                className="account--li-btn"
                                onClick={deleteAccount}
                            >
                                Delete account
                            </button>
                            <button
                                className="account--li-btn"
                                onClick={logout}
                            >
                                LogOut
                            </button>
                        </div>
                    </ul>
                </>
            ) : (
                <span className="account--info">
                    <Link className="txtBtn" to="/login">
                        No account, <i>Sign In</i>
                    </Link>
                </span>
            )}
        </div>
    );
};

export default Account;
