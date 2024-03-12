import { FC } from "react";
import style from "../styles/partials/Game.module.scss";
import usePlayerInfo from "../hooks/usePlayerInfo";

const WinPopup: FC = () => {
    const { player } = usePlayerInfo();

    function timeFormatter(time: number) {
        const timeFormat =
            ("0" + Math.floor((time / 60000) % 60)).slice(-2) +
            ":" +
            ("0" + Math.floor((time / 1000) % 60)).slice(-2) +
            ":" +
            ("0" + ((time / 10) % 100)).slice(-2);
        return timeFormat;
    }

    return (
        <section>
            <h1 className={style.winPopup__header}>SUCCESS {player.name}!</h1>
            <p className={style.winPopup__paragraph}>
                Your time is:{" "}
                <span className={style.winPopup__score}>
                    {timeFormatter(player.score.time)}
                </span>
            </p>
            <p className={style.winPopup__paragraph}>
                Missed dices:{" "}
                <span className={style.winPopup__score}>
                    {player.score.fouls === 0
                        ? "Any! You're smart!"
                        : player.score.fouls}
                </span>
            </p>
        </section>
    );
};

export default WinPopup;
