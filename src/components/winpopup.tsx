import { FC } from "react";
import usePlayerInfo from "../hooks/usePlayerInfo";

const WinPopup: FC = () => {
    const { player } = usePlayerInfo();
    return (
        <div className="winpopup--content">
            <h1 className="winpopup--text">SUCCESS {player.name}!</h1>
            <h2 className="winpopup--time">
                Your time is:{" "}
                <span>
                    {("0" + Math.floor((player.score.time / 60000) % 60)).slice(
                        -2
                    )}
                    :
                </span>
                <span>
                    {("0" + Math.floor((player.score.time / 1000) % 60)).slice(
                        -2
                    )}
                    :
                </span>
                <span>
                    {("0" + ((player.score.time / 10) % 100)).slice(-2)}
                </span>{" "}
            </h2>
            <h2 className="winpopup--fouls">
                Missed dices:{" "}
                <span>
                    {player.score.fouls === 0
                        ? "Any! You're smart!"
                        : player.score.fouls}
                </span>
            </h2>
        </div>
    );
};

export default WinPopup;
