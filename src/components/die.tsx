interface DieProps {
    key: string;
    value: number;
    isHeld: boolean;
    style: number;
    holdDice: () => void;
}

export default function Die(props: DieProps) {
    const styles_1 = {
        backgroundColor: props.isHeld ? "#0090f0" : "white",
        color: props.isHeld ? "white" : "black",
    };

    const styles_2 = (value: number) => {
        const imgUrl = `url(${
            props.isHeld
                ? require(`../images/die_face_${value}_held.png`)
                : require(`../images/die_face_${value}.png`)
        })`;

        return {
            boxShadow: "none",
            backgroundImage: `${imgUrl}`,
            backgroundSize: "cover",
            backgroundPosition: "center",
        };
    };

    return (
        <div
            className="die-face"
            style={props.style ? styles_2(props.value) : styles_1}
            onClick={props.holdDice}
        >
            {!props.style && <h2 className="die-num">{props.value}</h2>}
        </div>
    );
}
