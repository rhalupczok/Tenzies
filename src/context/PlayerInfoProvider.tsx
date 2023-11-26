import { createContext, useState, FC, ReactNode } from "react";
import { PlayerContextProps } from "../data/interfaces";

const PlayerContext = createContext<PlayerContextProps>(
    {} as PlayerContextProps
);

export const PlayerInfoProvider: FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [player, setPlayer] = useState({
        name: "",
        refreshTableFlag: false,
        score: { time: 0, fouls: 0 },
        saveScore: true,
        win: false,
        selectedDiceStyle: 0, //style: 0 -> numbers, style: 1 -> dots
    });

    return (
        <PlayerContext.Provider value={{ player, setPlayer }}>
            {children}
        </PlayerContext.Provider>
    );
};

export default PlayerContext;
