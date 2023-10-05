import React from "react";
import Die from "./components/die";
import Stopwatch from "./components/stopwatch";
import StyleSelection from "./components/styleselection";
import Scoretable from "./components/scoretable";
import WinPopup from "./components/winpopup";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import randomFirstNames from "./data/firstNamesData";
import { dice, player } from "./data/interfaces";

export default function App() {
    const [dice, setDice] = React.useState<dice[]>(allNewDice());
    const [play, setPlay] = React.useState<boolean>(false);
    const [running, setRunning] = React.useState<boolean>(false);
    const [player, setPlayer] = React.useState<player>({
        name: randomFirstNames[Math.floor(Math.random() * 25)],
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

    //download and applying user name from localstorage (if any)
    React.useEffect(() => {
        const userName: string | null =
            localStorage.getItem("tenziesUserName") !== null
                ? JSON.parse(localStorage.getItem("tenziesUserName") as string)
                : null;
        setPlayer((prevState) =>
            userName ? { ...prevState, name: userName } : prevState
        );
        window.addEventListener("keydown", handleKeyUp); //turns on listener for roll dice by key "space"
        return () => window.removeEventListener("keydown", handleKeyUp); //
    }, []);

    //create new single die
    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid(),
        };
    }

    //create new dice array
    function allNewDice() {
        const newDice = [];
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie());
        }
        return newDice;
    }

    //rolldice button effect - create new die which are not held by player, checking if any die is missed and adding possibly foul to player score
    const rollDice = () => {
        console.log("ddddddddddd");
        const heldNumber = dice.find((die) => die.isHeld === true);
        console.log(heldNumber, dice);
        dice.forEach((die) => {
            if (die.isHeld === false && die.value === heldNumber?.value) {
                console.log("blad");
                setPlayer((prevState) => ({
                    ...prevState,
                    score: {
                        ...prevState.score,
                        fouls: prevState.score.fouls + 1,
                    },
                }));
                missedDice(); //visual effect of missed dice
            }
        });

        if (!player.win) {
            //if winning condition is not met, generate new die if not held
            setDice((oldDice) =>
                oldDice.map((die) => {
                    return die.isHeld ? die : generateNewDie();
                })
            );
        } else {
            setDice(allNewDice);
        }
    };

    //roll the dice by space key
    const handleKeyUp = (e: KeyboardEvent) => {
        if (e.code === "Space") {
            e.stopPropagation();
            e.preventDefault();
            rollDice();
        }
    };

    //setting hold property in die object based on id of clicked dice
    function holdDice(id: string) {
        setDice((oldDice) =>
            oldDice.map((die) => {
                return die.id === id ? { ...die, isHeld: !die.isHeld } : die; //map by all dice, if id of clicked dice is matching then toogle the isHeld property, else do nothing.
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
            {play ? ( // the play boolean value toggle screen betwen main menu and game view.
                <div className="gameWindow">
                    <div className="dice-container">{diceElements}</div>
                    <button id="roll-btn" className="btn" onClick={rollDice}>
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
                        Change Name
                        <p className="current-name-btn">{`Your current name: ${player.name}`}</p>
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
