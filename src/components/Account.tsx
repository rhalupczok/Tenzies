import { FC, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import usePlayerInfo from "../hooks/usePlayerInfo";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Account: FC = () => {
    const axiosPrivate = useAxiosPrivate();
    const SCORES_URL = "/tenziuserscores";
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
                        <li onClick={logout}>LogOut</li>
                    </ul>
                </>
            ) : (
                <span className="account--info">
                    <Link to="/login">{auth.user}, Login</Link>
                </span>
            )}
        </div>
    );
};

export default Account;
