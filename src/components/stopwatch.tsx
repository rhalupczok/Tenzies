import { useState, useEffect, FC } from "react";
import style from "../styles/partials/StopWatch.module.scss";
import usePlayerInfo from "../hooks/usePlayerInfo";

interface Props {
    running: boolean;
}

const StopWatch: FC<Props> = ({ running }) => {
    const [time, setTime] = useState(0);
    const { player, setPlayer } = usePlayerInfo();

    const scoreUpdate = (time: number) => {
        setPlayer((prevState) => ({
            ...prevState,
            score: {
                ...prevState.score,
                time: time,
            },
        }));
    };

    //StopWatch logic & if player win -> score update
    useEffect(() => {
        if (player.win) scoreUpdate(time);
        setTime(0);
        let interval: NodeJS.Timeout | undefined;
        if (running) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 10);
            }, 10);
        } else if (!running) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [running]);

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
        <time className={style.stopWatch}>
            <span>Your time is: </span>
            <span>{timeFormatter(time)}</span>
        </time>
    );
};

export default StopWatch;
