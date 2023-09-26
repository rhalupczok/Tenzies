interface DieProps {
    key: string;
    value: number | string;
    isHeld: boolean;
    holdDice: () => void;
}

export default function Die(props: DieProps) {
    const styles = {
        backgroundColor: props.isHeld ? "#0090f0" : "white",
        color: props.isHeld ? "white" : "black",
    };
    return (
        <div className="die-face" style={styles} onClick={props.holdDice}>
            <h2 className="die-num">{props.value}</h2>
        </div>
    );
}
