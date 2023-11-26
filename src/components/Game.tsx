import { useState, useEffect, FC } from "react";
import Account from "./Account";
import Die from "./die";
import Stopwatch from "./stopwatch";
import StyleSelection from "./styleselection";
import Scoretable from "./scoretable";
import WinPopup from "./winpopup";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import { dice } from "../data/interfaces";
import usePlayerInfo from "../hooks/usePlayerInfo";
import useAuth from "../hooks/useAuth";

const Game: FC = () => {
    const [dice, setDice] = useState<dice[]>(allNewDice());
    const [play, setPlay] = useState<boolean>(false);
    const { player, setPlayer } = usePlayerInfo();
    const { auth } = useAuth();

    //checking results after each change in dice object & win conditions
    useEffect(() => {
        const allHeld: Boolean = dice.every((die) => die.isHeld);
        const firstValue: number | string = dice[0].value;
        const allValues = dice.every((die) => die.value === firstValue);
        if (allHeld && allValues) {
            setPlayer((prevState) => ({ ...prevState, win: true }));
            setPlay(false);
        }
    }, [dice]);

    // applying user name
    useEffect(() => {
        setPlayer((prevState) => ({ ...prevState, name: auth.user }));
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

    const stopGame: () => void = () => {
        setPlayer((prevState) => ({
            ...prevState,
            win: false,
        }));
        setPlay(false);
    };

    const playGame: () => void = () => {
        setDice(allNewDice);
        setPlayer((prevState) => ({
            ...prevState,
            score: {
                time: 0,
                fouls: 0,
            },
            win: false,
        }));
        setPlay(true);
    };

    return (
        <main>
            <Account />
            {player.win && (
                //display confetti and winPopup container when player win (property win is changed in first useEffect on the top of App.tsx)
                <div className="winPopup">
                    <Confetti />
                    <WinPopup />
                    <button className="btn" onClick={playGame}>
                        Play Again
                    </button>
                    <button className="btn" onClick={stopGame}>
                        Menu
                    </button>
                </div>
            )}
            <h1 className="title">Tenzi</h1>
            <Stopwatch running={play} />
            <p className="howToPlay">
                Goal is to get all dice the same. Hold dice by click on it. Be
                careful to do not miss any! <br /> Hurry up, the time is being
                counted!
            </p>
            {play ? ( // the play boolean value toggle screen betwen main menu and game view.
                <div className="game-window">
                    <div className="dice-container">{diceElements}</div>
                    <button id="roll-btn" className="btn" onClick={rollDice}>
                        Roll
                    </button>

                    <button className="btn" onClick={stopGame}>
                        Stop
                    </button>
                </div>
            ) : (
                <div className="menuWindow">
                    <StyleSelection />
                    <button className="btn" onClick={playGame}>
                        Play
                    </button>
                </div>
            )}
            {!play && <Scoretable />}
        </main>
    );
};

export default Game;
