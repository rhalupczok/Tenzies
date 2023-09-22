import React from "react";
interface Props {
    score: number[];
}
const WinPopup: React.FC<Props> = (props) => {
    console.log(props.score);
    return (
        <div className="winpopup--content">
            <h1 className="winpopup--text">SUCCESS!</h1>
            <h2 className="winpopup--time">
                Your time is:{" "}
                <span>
                    {(
                        "0" +
                        Math.floor(
                            (props.score[props.score.length - 1] / 60000) % 60
                        )
                    ).slice(-2)}
                    :
                </span>
                <span>
                    {(
                        "0" +
                        Math.floor(
                            (props.score[props.score.length - 1] / 1000) % 60
                        )
                    ).slice(-2)}
                    :
                </span>
                <span>
                    {(
                        "0" +
                        ((props.score[props.score.length - 1] / 10) % 100)
                    ).slice(-2)}
                </span>{" "}
            </h2>
        </div>
    );
};

export default WinPopup;
