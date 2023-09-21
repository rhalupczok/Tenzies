import React from "react";
import Die from "./components/die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
    const [dice, setDice] = React.useState(allNewDice());

    const [tenzies, setTenzies] = React.useState(false);

    const [clock, setClock] = React.useState(0);

    React.useEffect(() => {
        const allHeld = dice.every((die) => die.isHeld);
        const firstValue = dice[0].value;
        const allValues = dice.every((die) => die.value === firstValue);
        if (allHeld && allValues) {
            console.log("YOU WON");
            setTenzies(true);
        }

        // for (let i = 0; i < dice.length - 1; i++) {
        //     if (dice[i].isHeld === false || dice[i].value !== dice[i + 1].value)
        //         return;
        // }
        // setTenzies(true);
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

    // const timeCounter = (time) => {
    //     let lastTime = this.gameTime - time / 1000;
    //     let min = Math.floor((lastTime % (60 * 60)) / 60);
    //     let sec = Math.floor(lastTime % 60);
    //     let timer = document.getElementById("timer");

    //     if (min + sec >= 0) {
    //         timer.innerHTML = `TIME: ${min}min ${sec}sec`;
    //     } else {
    //         timer.innerHTML = `TIME'S UP !!!`;
    //         this.circleBall.vel.multBy(960 / 1000); //increasing the table friction when times up
    //     }
    // };

    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzi</h1>
            <p className="instructions">
                Roll until all dice are the same. Hurry up, the time is being
                counted!
            </p>
            <div className="dice-container">{diceElements}</div>
            <button className="roll-dice" onClick={rollDice}>
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    );
}
