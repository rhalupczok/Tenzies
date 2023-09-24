import React from "react";

interface Props {
    result: {
        name: string;
        score: { time: number; fouls: number };
        win: boolean;
    };
}
const Scoretable: React.FC<Props> = (props) => {
    const [scores, setScores] = React.useState<
        { name: string; time: number; fouls: number }[]
    >([]);
    React.useEffect(() => {
        if (props.result.win === true && props.result.score.time !== 0) {
            setScores((prevState) => [
                ...prevState,
                {
                    name: props.result.name,
                    time: props.result.score.time,
                    fouls: props.result.score.fouls,
                },
            ]);
        }
    }, [props.result.score.time]);

    const sortedScore = scores.sort((a, b) => a.time - b.time);

    if (sortedScore.length > 5) sortedScore.pop();
    const scoreElements = sortedScore.map((singleScore, index) => {
        return (
            <div key={singleScore.time} className="scoretable--score">
                <span>
                    {index + 1}. {singleScore.name}{" "}
                </span>
                <span>
                    {("0" + Math.floor((singleScore.time / 60000) % 60)).slice(
                        -2
                    )}
                    :
                </span>
                <span>
                    {("0" + Math.floor((singleScore.time / 1000) % 60)).slice(
                        -2
                    )}
                    :
                </span>
                <span>{("0" + ((singleScore.time / 10) % 100)).slice(-2)}</span>{" "}
                <span>{`Miss: ${singleScore.fouls}`}</span>
            </div>
        );
    });
    return (
        <div className="scoretable">
            <h2 className="scoretable--header">Best scores</h2>
            {scoreElements}
        </div>
    );
};

export default Scoretable;
