import { useState, useEffect, FC } from "react";
import style from "../styles/partials/ScoreTable.module.scss";
import { nanoid } from "nanoid";
import { scoresArr } from "../data/interfaces";
import usePlayerInfo from "../hooks/usePlayerInfo";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const SCORES_URL = "/tenziGame";
const inlineStyle = {
    //dynamic styling for each score row
    style1: { backgroundColor: "rgba(0, 0, 0, 0.2)" },
    style2: { backgroundColor: "rgba(0, 0, 0, 0.4)" },
};

const Scoretable: FC = () => {
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const { player } = usePlayerInfo();
    const [userScoresArr, setUserScoresArr] = useState<scoresArr[]>([]);
    const [scoresArr, setScoresArr] = useState<scoresArr[]>([]);

    useEffect(() => {
        if (
            !auth.user ||
            !player.win ||
            !player.saveScore ||
            player.score.time === 0
        )
            return;
        let isMounted = true;
        const controller = new AbortController();
        const updateDataBase = async () => {
            try {
                const response = await axiosPrivate.post(SCORES_URL, {
                    signal: controller.signal,
                    user: player.name,
                    time: player.score.time,
                    fouls: player.score.fouls,
                });
            } catch (err) {
                console.error(err);
            }
        };
        updateDataBase();
        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [player.score.time]);

    useEffect(() => {
        if (!auth.user) return;
        let isMounted = true;
        const controller = new AbortController();

        const getScores = async () => {
            //getting scores from DB (response: sorted 50 best scores arr)
            try {
                const response = await axiosPrivate.get(SCORES_URL, {
                    signal: controller.signal,
                });
                setScoresArr(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        getScores();

        const getUserScores = async () => {
            //getting user scores from DB (response: sorted 10 best scores arr)
            try {
                const response = await axiosPrivate.get(
                    `${SCORES_URL}/${auth.user}`,
                    {
                        signal: controller.signal,
                    }
                );
                setUserScoresArr(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        getUserScores();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [player.win, player.refreshTableFlag]); //refreshTableFlag is called when player clear own results

    function timeFormatter(time: number) {
        const timeFormat =
            ("0" + Math.floor((time / 60000) % 60)).slice(-2) +
            ":" +
            ("0" + Math.floor((time / 1000) % 60)).slice(-2) +
            ":" +
            ("0" + ((time / 10) % 100)).slice(-2);
        return timeFormat;
    }

    //JSX array of results
    const localScoresElements = userScoresArr.map((singleScore, index) => {
        return (
            <figure
                key={nanoid()}
                className={style.table__score}
                style={
                    index % 2 === 0 ? inlineStyle.style1 : inlineStyle.style2
                } //particular row backround
            >
                <span>{index + 1}. </span>
                <span className={style.table__name}>
                    {singleScore.username}{" "}
                </span>
                <span>{timeFormatter(singleScore.time)}</span>
                <span>{`Miss: ${singleScore.fouls}`}</span>
            </figure>
        );
    });

    const globalScoresElements = scoresArr.map((singleScore, index) => {
        return (
            <figure
                key={nanoid()}
                className={style.table__score}
                style={
                    index % 2 === 0 ? inlineStyle.style1 : inlineStyle.style2
                }
            >
                <span>{index + 1}. </span>
                <span className={style.table__name}>
                    {singleScore.username}{" "}
                </span>
                <span>{timeFormatter(singleScore.time)}</span>
                <span>{`Miss: ${singleScore.fouls}`}</span>
            </figure>
        );
    });

    return (
        <section className={style.tablesContainer}>
            <section className={style.table}>
                <h2 className={style.table__header}>Personal best scores</h2>
                <section className={style.table__scoresContainer}>
                    {auth.accessToken
                        ? localScoresElements.length === 0
                            ? "No scores saved"
                            : localScoresElements
                        : "Only for registered users"}
                </section>
            </section>
            <section className={style.table}>
                <h2 className={style.table__header}>Global best scores</h2>
                <section className={style.table__scoresContainer}>
                    {auth.accessToken
                        ? globalScoresElements
                        : "Only for registered users"}
                </section>
            </section>
        </section>
    );
};

export default Scoretable;
