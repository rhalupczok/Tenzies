import React from "react";

interface DieProps {
    key: string;
    value: number;
    isHeld: boolean;
    holdDice: () => void;
}

export default function Die(props: DieProps) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white",
    };
    return (
        <div className="die-face" style={styles} onClick={props.holdDice}>
            <h2 className="die-num">{props.value}</h2>
        </div>
    );
}
