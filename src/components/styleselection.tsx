import React from "react";

interface Props {
    selectedDiceStyle: number;
    setDiceStyle: (style: number) => void;
}
const StyleSelection: React.FC<Props> = (props) => {
    const chosenStyle = {
        transform: "scale(1.2)",
        opacity: "1",
        border: "2px solid #0090f0",
    };

    return (
        <div className="style-selection">
            <h3 className="style-selection--header">Select dice style:</h3>
            <div className="style-selection--buttons">
                <img
                    src={require("../images/dice_numbers.png")}
                    alt="dice_numbers"
                    className="style-selection--imgBtn"
                    style={!props.selectedDiceStyle ? chosenStyle : undefined}
                    onClick={() => props.setDiceStyle(0)}
                />
                <img
                    src={require("../images/dice_symbols.png")}
                    alt="dice_symbols"
                    className="style-selection--imgBtn"
                    style={props.selectedDiceStyle ? chosenStyle : undefined}
                    onClick={() => props.setDiceStyle(1)}
                />
            </div>
        </div>
    );
};

export default StyleSelection;
