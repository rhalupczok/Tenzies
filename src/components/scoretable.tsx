import React from "react";
import { setDoc, doc, onSnapshot } from "firebase/firestore";
import { globalScores, db } from "../firebase";

interface Props {
    result: {
        name: string;
        score: { time: number; fouls: number };
        win: boolean;
    };
}
const Scoretable: React.FC<Props> = (props) => {
    const [localScoresArr, setLocalScoresArr] = React.useState<
        { name: string; time: number; fouls: number }[]
    >([]);
    const [globalScoresArr, setGlobalScoresArr] = React.useState<
        { name: string; time: number; fouls: number }[]
    >([]);

    React.useEffect(() => {
        const unsubscribe = onSnapshot(globalScores, (snapshot) => {
            const globalScores = snapshot.docs.map((score) => ({
                ...score.data(),
            }));
            const globalScoresArr = Object.values(globalScores[0]);
            setGlobalScoresArr(globalScoresArr[0]);
        });
        return unsubscribe; //avoid memory leak
    }, []);

    //download results from local storage (if any) and update the score array
    React.useEffect(() => {
        const storedData:
            | { name: string; time: number; fouls: number }[]
            | null =
            localStorage.getItem("tenziesScores") !== null
                ? JSON.parse(localStorage.getItem("tenziesScores") as string)
                : null;
        setLocalScoresArr((prevState) => (storedData ? storedData : prevState));
    }, []);

    //update the score array and localstorage item when player win. The score array is always cut to 5 best scores
    React.useEffect(() => {
        if (props.result.win === true && props.result.score.time !== 0) {
            const newLocalScoresArr = [
                ...localScoresArr,
                {
                    name: props.result.name,
                    time: props.result.score.time,
                    fouls: props.result.score.fouls,
                },
            ];
            const sortedLocalScores = newLocalScoresArr
                .sort((a, b) => a.time - b.time)
                .slice(0, 5);
            setLocalScoresArr(sortedLocalScores);
            localStorage.setItem(
                "tenziesScores",
                JSON.stringify(sortedLocalScores)
            );

            if (globalScoresArr) {
                const newGlobalScoresArr = [
                    ...globalScoresArr,
                    {
                        name: props.result.name,
                        time: props.result.score.time,
                        fouls: props.result.score.fouls,
                    },
                ];

                const sortedGlobalScores = newGlobalScoresArr
                    .sort((a, b) => a.time - b.time)
                    .slice(0, 30);
                const updateGlobalResults = async () => {
                    const resultsRef = doc(db, "tenzi-scores", "tableID");
                    await setDoc(
                        resultsRef,
                        { sortedGlobalScores },
                        { merge: false }
                    );
                };
                updateGlobalResults();
            }
        }
    }, [props.result.score.time]);

    //JSX array of results
    const localScoresElements = localScoresArr.map((singleScore, index) => {
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

    const globalScoresElements = globalScoresArr.map((singleScore, index) => {
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
        <div className="scoreTablesContainer">
            <div className="scoretable">
                <h2 className="scoretable--header">Local best scores</h2>
                <div className="scoretable--scores-container">
                    {localScoresElements}
                </div>
            </div>
            <div className="scoretable">
                <h2 className="scoretable--header">Global best scores</h2>
                <div className="scoretable--scores-container">
                    {globalScoresElements}
                </div>
            </div>
        </div>
    );
};

export default Scoretable;
