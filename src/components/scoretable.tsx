import React from "react";

interface Props {
    scores: number[];
}

const Scoretable: React.FC<Props> = (props) => {
    function compareNumbers(a: number, b: number) {
        return a - b;
    }
    const scoreSort = props.scores.sort(compareNumbers);
    if (scoreSort.length > 10) scoreSort.pop();
    const scoreElements = scoreSort.map((score, index) => {
        return (
            <div key={score} className="scoretable--score">
                {index + 1}.{" "}
                <span>
                    {("0" + Math.floor((score / 60000) % 60)).slice(-2)}:
                </span>
                <span>
                    {("0" + Math.floor((score / 1000) % 60)).slice(-2)}:
                </span>
                <span>{("0" + ((score / 10) % 100)).slice(-2)}</span>
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
