import React from "react";
import Die from "./components/die";
import Stopwatch from "./components/stopwatch";
import StyleSelection from "./components/styleselection";
import Scoretable from "./components/scoretable";
import WinPopup from "./components/winpopup";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
    const [dice, setDice] = React.useState<
        {
            value: number;
            isHeld: boolean;
            id: string;
        }[]
    >(allNewDice());
    const [play, setPlay] = React.useState<boolean>(false);
    const [running, setRunning] = React.useState<boolean>(false);
    const [player, setPlayer] = React.useState<{
        name: string;
        changeName: boolean;
        score: { time: number; fouls: number };
        win: boolean;
        selectedDiceStyle: number;
    }>({
        name: "Player",
        changeName: false,
        score: { time: 0, fouls: 0 },
        win: false,
        selectedDiceStyle: 0, //style: 0 -> numbers, style: 1 -> dots
    });

    //checking results after each change in dice object & win conditions
    React.useEffect(() => {
        const allHeld: Boolean = dice.every((die) => die.isHeld);
        const firstValue: number | string = dice[0].value;
        const allValues = dice.every((die) => die.value === firstValue);
        if (allHeld && allValues) {
            setPlayer((prevState) => ({ ...prevState, win: true }));
            setRunning(false);
            setPlay(false);
        }
    }, [dice]);

    //download user name from localstorage (if any)
    React.useEffect(() => {
        const userName: string | null =
            localStorage.getItem("tenziesUserName") !== null
                ? JSON.parse(localStorage.getItem("tenziesUserName") as string)
                : null;
        setPlayer((prevState) =>
            userName ? { ...prevState, name: userName } : prevState
        );
    }, []);

    //create new single die
    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid(),
        };
    }

    //create all new dice arrray
    function allNewDice() {
        const newDice = [];
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie());
        }
        return newDice;
    }

    //rolldice button effect - create new die which are not held by player, checking if any die is missed and adding possibly foul to player score
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

    //setting hold property in die object
    function holdDice(id: string) {
        setDice((oldDice) =>
            oldDice.map((die) => {
                return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
            })
        );
    }

    //creating single Die by passing props to Die component - the diceElements Arr is displayed
    const diceElements = dice.map((die) => (
        <Die
            key={die.id}
            value={die.value}
            isHeld={die.isHeld}
            style={player.selectedDiceStyle}
            holdDice={() => holdDice(die.id)}
        />
    ));

    //when finish the score (time) is updated by passing value from stopWatch component
    const scoreUpdate = (time: number) => {
        setPlayer((prevState) => ({
            ...prevState,
            score: {
                ...prevState.score,
                time: time,
            },
        }));
    };

    //visual effect when player miss the dice - red background and change title word for a 0,5s
    const missedDice = () => {
        const text = document.querySelector(".title");
        const body = document.querySelector("body");

        if (text && body) {
            text.innerHTML = "MISS!!";
            text.classList.add("missed-dice-text");
            body.classList.add("missed-dice-bg");
        }
        setTimeout(() => {
            if (text && body) {
                text.innerHTML = "TENZI";
                text.classList.remove("missed-dice-text");
                body.classList.remove("missed-dice-bg");
            }
        }, 500);
    };

    //catching player name from input area
    const onChange = (event: { target: { value: string } }) => {
        setPlayer((prevState) => ({
            ...prevState,
            name: event.target.value,
        }));
    };

    // setting the dice style - passed as props to StyleSelection component
    const setDiceStyle = (style: number) => {
        setPlayer((prevState) => ({
            ...prevState,
            selectedDiceStyle: style,
        }));
    };

    return (
        <main>
            {
                //user name container display when changeName property of player object is true - state is changed by "Enter name" and apply buttons
                player.changeName && (
                    <div className="user-name--container">
                        <input
                            type="text"
                            id="user"
                            placeholder={player.name}
                            className="user-name--input"
                            value={player.name}
                            onChange={onChange}
                            maxLength={10}
                        />
                        <button
                            className="btn"
                            onClick={() => {
                                setPlayer((prevState) => ({
                                    ...prevState,
                                    changeName: false,
                                }));
                                //passing user name to localStorage
                                localStorage.setItem(
                                    "tenziesUserName",
                                    JSON.stringify(player.name)
                                );
                            }}
                        >
                            Apply
                        </button>
                    </div>
                )
            }

            {player.win && (
                //display confetti and winPopup container when player win (property win is changed in first useEffect on the top of App.tsx)
                <div className="winPopup">
                    <Confetti />
                    <WinPopup result={player} />
                    <button
                        className="btn"
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
                winFlag={player.win}
            />
            <p className="instructions">
                Roll until all dice are the same. Hurry up, the time is being
                counted!
            </p>
            {play ? (
                <div className="gameWindow">
                    <div className="dice-container">{diceElements}</div>
                    <button className="btn" onClick={rollDice}>
                        Roll
                    </button>
                </div>
            ) : (
                <div className="menuWindow">
                    <StyleSelection
                        selectedDiceStyle={player.selectedDiceStyle}
                        setDiceStyle={(style: number) => setDiceStyle(style)}
                    />
                    <button
                        className="btn"
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
                        className="btn"
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
