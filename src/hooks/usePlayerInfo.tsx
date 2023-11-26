import { useContext } from "react";
import PlayerInfo from "../context/PlayerInfoProvider";
import { PlayerContextProps } from "../data/interfaces";

const usePlayerInfo: () => PlayerContextProps = () => {
    return useContext(PlayerInfo);
};

export default usePlayerInfo;
