import React from "react";

interface Props {
    scoreUpdate: (time: number) => void;
    running: boolean;
    winFlag: boolean;
}

const Stopwatch: React.FC<Props> = ({ scoreUpdate, running, winFlag }) => {
    const [time, setTime] = React.useState(0);

    //stopWatch logic
    React.useEffect(() => {
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

    //passing the time to result object in App.tsx as argument in props scoreUpdate function.
    React.useEffect(() => {
        if (winFlag) scoreUpdate(time);
        setTime(0);
    }, [winFlag]);

    return (
        <div className="stopwatch">
            {running && (
                <div className="numbers">
                    <span>Your time is: </span>
                    <span>
                        {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
                    </span>
                    <span>
                        {("0" + Math.floor((time / 1000) % 60)).slice(-2)}:
                    </span>
                    <span>{("0" + ((time / 10) % 100)).slice(-2)}</span>
                </div>
            )}
        </div>
    );
};

export default Stopwatch;
