import React from "react";
import { player } from "../data/interfaces";

interface Props {
    result: player;
}
const WinPopup: React.FC<Props> = (props) => {
    return (
        <div className="winpopup--content">
            <h1 className="winpopup--text">SUCCESS {props.result.name}!</h1>
            <h2 className="winpopup--time">
                Your time is:{" "}
                <span>
                    {(
                        "0" + Math.floor((props.result.score.time / 60000) % 60)
                    ).slice(-2)}
                    :
                </span>
                <span>
                    {(
                        "0" + Math.floor((props.result.score.time / 1000) % 60)
                    ).slice(-2)}
                    :
                </span>
                <span>
                    {("0" + ((props.result.score.time / 10) % 100)).slice(-2)}
                </span>{" "}
            </h2>
            <h2 className="winpopup--fouls">
                Missed dices:{" "}
                <span>
                    {props.result.score.fouls === 0
                        ? "Any! You're smart!"
                        : props.result.score.fouls}
                </span>
            </h2>
        </div>
    );
};

export default WinPopup;
