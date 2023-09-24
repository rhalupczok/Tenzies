import React from "react";
import Die from "./components/die";
import Stopwatch from "./components/stopwatch";
import Scoretable from "./components/scoretable";
import WinPopup from "./components/winpopup";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
    const [dice, setDice] = React.useState(allNewDice());
    const [play, setPlay] = React.useState(false);
    const [running, setRunning] = React.useState(false);
    const [player, setPlayer] = React.useState<{
        name: string;
        changeName: boolean;
        score: { time: number; fouls: number };
        win: boolean;
    }>({
        name: "Player",
        changeName: false,
        score: { time: 0, fouls: 0 },
        win: false,
    });

    React.useEffect(() => {
        const allHeld: Boolean = dice.every((die) => die.isHeld);
        const firstValue: number | string = dice[0].value;
        const allValues = dice.every((die) => die.value === firstValue);
        if (allHeld && allValues) {
            console.log("YOU WON");
            setPlayer((prevState) => ({ ...prevState, win: true }));
            setRunning(false);
            setPlay(false);
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
        const heldNumber = dice.find((die) => die.isHeld === true);
        dice.forEach((die) => {
            if (die.isHeld === false && die.value === heldNumber?.value) {
                setPlayer((prevState) => ({
                    ...prevState,
                    score: {
                        ...prevState.score,
                        fouls: prevState.score.fouls + 1,
                    },
                }));
                missedDice();
            }
        });

        if (!player.win) {
            setDice((oldDice) =>
                oldDice.map((die) => {
                    return die.isHeld ? die : generateNewDie();
                })
            );
        } else {
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

    const scoreUpdate = (time: number) => {
        // console.log("scoreUpdate 2");
        setPlayer((prevState) => ({
            ...prevState,
            score: {
                ...prevState.score,
                time: time,
            },
        }));
    };
    console.log(player.score);

    const missedDice = () => {
        const text = document.querySelector(".missed-dice");
        if (text) text.classList.toggle("show");
        setTimeout(() => {
            if (text) text.classList.toggle("show");
        }, 1000);
    };

    const onChange = (event: { target: { value: string } }) => {
        setPlayer((prevState) => ({
            ...prevState,
            name: event.target.value,
        }));
    };

    return (
        <main>
            {player.changeName && (
                <div className="user-name--container">
                    <input
                        type="text"
                        id="user"
                        placeholder={player.name}
                        className="user-name--input"
                        value={player.name}
                        onChange={onChange}
                    />
                    <button
                        className="roll-dice"
                        onClick={() => {
                            setPlayer((prevState) => ({
                                ...prevState,
                                changeName: false,
                            }));
                        }}
                    >
                        Apply
                    </button>
                </div>
            )}
            <div className="missed-dice">MISSED!!!</div>
            {player.win && <Confetti />}
            {player.win && (
                <div className="winPopup">
                    <WinPopup result={player} />
                    <button
                        className="roll-dice"
                        onClick={() => {
                            setDice(allNewDice);
                            setPlayer((prevState) => ({
                                ...prevState,
                                score: {
                                    time: 0,
                                    fouls: 0,
                                },
                                win: false,
                            }));
                        }}
                    >
                        Play Again
                    </button>
                </div>
            )}
            <h1 className="title">Tenzi</h1>
            <Stopwatch
                scoreUpdate={(time: number) => scoreUpdate(time)}
                running={running}
                tenzies={player.win}
            />

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
                <div className="start-buttons">
                    <button
                        className="roll-dice"
                        onClick={() => {
                            setPlayer((prevState) => ({
                                ...prevState,
                                changeName: true,
                            }));
                        }}
                    >
                        Enter Name
                    </button>
                    <button
                        className="roll-dice"
                        onClick={() => {
                            allNewDice();
                            setPlay(true);
                            if (!running) setRunning(true);
                        }}
                    >
                        Play
                    </button>
                </div>
            )}
            <Scoretable result={player} />
        </main>
    );
}
