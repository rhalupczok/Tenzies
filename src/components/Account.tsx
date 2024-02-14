import { FC, useEffect } from "react";
import style from "../styles/partials/Account.module.scss";
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

    const displayUserMenu: () => void = () => {
        const menu = document.querySelector(`.${style.menuItems}`);
        menu?.classList.toggle("jsHide");
    };
    return (
        <aside className={style.account}>
            {auth?.roles?.includes(2001) ? (
                <>
                    <span className={style.account__userName}>
                        {`Hello, ${auth.user} `}
                        <FontAwesomeIcon
                            className={style.account__gearIcon}
                            onClick={displayUserMenu}
                            icon={faGear}
                        />
                    </span>
                    <ul className={`${style.menuItems} jsHide`}>
                        <li className={style.menuItems__item}>
                            <input
                                className={style.menuItems__item_checkbox}
                                type="checkbox"
                                id="saveScores"
                                onChange={saveScoreCheck}
                                checked={player.saveScore}
                            />
                            <label
                                htmlFor="saveScores"
                                className={style.menuItems__item_label}
                            >
                                Remember my scores
                            </label>
                        </li>
                        <li
                            className={style.menuItems__item}
                            onClick={deleteUserScores}
                        >
                            Clear all my scores
                        </li>
                        <li className={style.menuItems__item}>
                            <button
                                disabled={auth.user === "demo" ? true : false}
                                className={style.menuItems__item_button}
                                onClick={deleteAccount}
                            >
                                Delete account
                            </button>
                            <button
                                className={style.menuItems__item_button}
                                onClick={logout}
                            >
                                LogOut
                            </button>
                        </li>
                    </ul>
                </>
            ) : (
                <span className={style.account__userName}>
                    <Link className={style.account__loginButton} to="/login">
                        No account, <i>Sign In</i>
                    </Link>
                </span>
            )}
        </aside>
    );
};

export default Account;
