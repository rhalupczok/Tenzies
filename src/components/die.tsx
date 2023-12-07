import { DieProps } from "../data/interfaces";

export default function Die(props: DieProps) {
    const styles = {
        numbers: {
            backgroundColor: props.isHeld ? "#0090f0" : "white",
            color: props.isHeld ? "white" : "black",
        },
        symbols: (value: number) => {
            //this function returns a style of dice. img source based on props value (1,2, ..., 6) and isHeld value(true,false)
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
        },
    };

    return (
        <div
            className="die-face"
            style={props.style ? styles.symbols(props.value) : styles.numbers} //dependly of chosen style the dices are numeric(style === 0) or symbolic(style === 1)
            onClick={props.holdDice}
        >
            {!props.style && <h2 className="die-num">{props.value}</h2>}
        </div>
    );
}
