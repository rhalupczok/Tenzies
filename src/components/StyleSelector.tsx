import { FC } from "react";
import usePlayerInfo from "../hooks/usePlayerInfo";
import style from "../styles/partials/StyleSelector.module.scss";

const StyleSelector: FC = () => {
    const { player, setPlayer } = usePlayerInfo();

    const setDiceStyle = (style: number) => {
        setPlayer((prevState) => ({
            ...prevState,
            selectedDiceStyle: style, //selectedDiceStyle: 0 -> numbers, selectedDiceStyle: 1 -> dots
        }));
    };
    const chosenStyle = {
        transform: "scale(1.2)",
        opacity: "1",
        border: "2px solid #480064",
    };

    return (
        <section className={style.styleSelector}>
            <header className={style.styleSelector__header}>
                <h3>Select dice style:</h3>
            </header>
            <p className={style.styleSelector__buttonsContainer}>
                <img
                    src={require("../images/dice_numbers.png")}
                    alt="dice_numbers"
                    className={style.styleSelector__button}
                    style={!player.selectedDiceStyle ? chosenStyle : undefined}
                    onClick={() => setDiceStyle(0)}
                />
                <img
                    src={require("../images/dice_symbols.png")}
                    alt="dice_symbols"
                    className={style.styleSelector__button}
                    style={player.selectedDiceStyle ? chosenStyle : undefined}
                    onClick={() => setDiceStyle(1)}
                />
            </p>
        </section>
    );
};

export default StyleSelector;
