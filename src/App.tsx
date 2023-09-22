import React from "react";
import Die from "./components/die";
import Stopwatch from "./components/stopwatch";
import Scoretable from "./components/scoretable";
import WinPopup from "./components/winpopup";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
    const [dice, setDice] = React.useState(allNewDice());
    const [tenzies, setTenzies] = React.useState(false);
    const [play, setPlay] = React.useState(false);
    const [score, setScore] = React.useState<number[]>([]);
    const [running, setRunning] = React.useState(false);

    React.useEffect(() => {
        const allHeld: Boolean = dice.every((die) => die.isHeld);
        const firstValue: number | string = dice[0].value;
        const allValues = dice.every((die) => die.value === firstValue);
        if (allHeld && allValues) {
            console.log("YOU WON");
            setTenzies(true);
            setRunning(false);
        }
    }, [dice]);

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid(),
        };
    }

    function allNewDice() {
        const newDice = [];
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie());
        }
        return newDice;
    }

    function rollDice() {
        if (!tenzies) {
            setDice((oldDice) =>
                oldDice.map((die) => {
                    return die.isHeld ? die : generateNewDie();
                })
            );
        } else {
            setTenzies(false);
            setDice(allNewDice);
        }
    }

    function holdDice(id: string) {
        setDice((oldDice) =>
            oldDice.map((die) => {
                return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
            })
        );
    }

    const diceElements = dice.map((die) => (
        <Die
            key={die.id}
            value={die.value}
            isHeld={die.isHeld}
            holdDice={() => holdDice(die.id)}
        />
    ));

    const scores = (time: number) => {
        console.log("scoreUpdate 2");
        setScore((prevScore) => [...prevScore, time]);
    };

    return (
        <main>
            {tenzies && <Confetti />}
            {tenzies && (
                <div className="winPopup">
                    <WinPopup score={score} />
                    <button
                        className="roll-dice"
                        onClick={() => {
                            setPlay(true);
                            if (!running) setRunning(true);
                            rollDice();
                        }}
                    >
                        Play Again
                    </button>
                </div>
            )}
            <h1 className="title">Tenzi</h1>
            <Stopwatch
                score={(time) => scores(time)}
                running={running}
                tenzies={tenzies}
            />
            <Scoretable scores={score} />

            <p className="instructions">
                Roll until all dice are the same. Hurry up, the time is being
                counted!
            </p>
            {play && <div className="dice-container">{diceElements}</div>}
            {play ? (
                <button className="roll-dice" onClick={rollDice}>
                    Roll
                </button>
            ) : (
                <button
                    className="roll-dice"
                    onClick={() => {
                        setPlay(true);
                        if (!running) setRunning(true);
                        setTenzies(false);
                    }}
                >
                    Play
                </button>
            )}
        </main>
    );
}
