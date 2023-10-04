import React from "react";
import { setDoc, doc, onSnapshot } from "firebase/firestore";
import { globalScores, db } from "../firebase";
import { nanoid } from "nanoid";

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

    const style = {
        //dynamic styling for each score row
        style1: { backgroundColor: "rgba(0, 0, 0, 0.2)" },
        style2: { backgroundColor: "rgba(0, 0, 0, 0.4)" },
    };

    React.useEffect(() => {
        //this func enable  monitoring of changes in global database and update globalScoresArr object
        const unsubscribe = onSnapshot(globalScores, (snapshot) => {
            const globalScores = snapshot.docs.map((score) => ({
                ...score.data(),
            }));
            const globalScoresArr = Object.values(globalScores[0]);
            setGlobalScoresArr(globalScoresArr[0]);
        });
        return unsubscribe; //stop monitoring when object is closed (avoid memory leak)
    }, []);

    //download results from local storage (if any) and update the local score array
    React.useEffect(() => {
        const storedData:
            | { name: string; time: number; fouls: number }[]
            | null =
            localStorage.getItem("tenziesScores") !== null
                ? JSON.parse(localStorage.getItem("tenziesScores") as string)
                : null;
        setLocalScoresArr((prevState) => (storedData ? storedData : prevState));
    }, []);

    //update the global score database and localstorage item when player win. The local score array is always cut to 5 best scores
    //the useeffect is called when the stopWatch is getting result (in player object the current time is changed)
    React.useEffect(() => {
        if (props.result.win === true && props.result.score.time !== 0) {
            const newLocalScoresArr = [
                //getting all local result and add current result
                ...localScoresArr,
                {
                    name: props.result.name,
                    time: props.result.score.time,
                    fouls: props.result.score.fouls,
                },
            ];
            const sortedLocalScores = newLocalScoresArr //sort results array by time value and cut array to 5 scores
                .sort((a, b) => a.time - b.time)
                .slice(0, 5);
            setLocalScoresArr(sortedLocalScores);
            localStorage.setItem(
                //update localstorage
                "tenziesScores",
                JSON.stringify(sortedLocalScores)
            );

            if (globalScoresArr) {
                const newGlobalScoresArr = [
                    //getting all local result and add current result
                    ...globalScoresArr,
                    {
                        name: props.result.name,
                        time: props.result.score.time,
                        fouls: props.result.score.fouls,
                    },
                ];

                const sortedGlobalScores = newGlobalScoresArr //sort results array by time value and cut array to 50 scores
                    .sort((a, b) => a.time - b.time)
                    .slice(0, 50);
                const updateGlobalResults = async () => {
                    //update the globalscore database (firestore)
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
            <div
                key={nanoid()}
                className="scoretable--score"
                style={index % 2 === 0 ? style.style1 : style.style2} //particular row backround
            >
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
            <div
                key={nanoid()}
                className="scoretable--score"
                style={index % 2 === 0 ? style.style1 : style.style2}
            >
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
