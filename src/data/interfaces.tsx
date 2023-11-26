import { Dispatch, SetStateAction } from "react";

export interface dice {
    value: number;
    isHeld: boolean;
    id: string;
}

export interface scoresArr {
    username: string;
    time: number;
    fouls: number;
}

export interface JwtPayload {
    UserInfo: {
        username: string;
        roles: number[];
    };
}

export interface PlayerContextProps {
    player: {
        name: string;
        refreshTableFlag: boolean;
        score: { time: number; fouls: number };
        saveScore: boolean;
        win: boolean;
        selectedDiceStyle: number;
    };
    setPlayer: Dispatch<
        SetStateAction<{
            name: string;
            refreshTableFlag: boolean;
            score: { time: number; fouls: number };
            saveScore: boolean;
            win: boolean;
            selectedDiceStyle: number;
        }>
    >;
}

export interface AuthContextProps {
    auth: { user: string; roles: number[]; accessToken: string };
    setAuth: Dispatch<
        SetStateAction<{ user: string; roles: number[]; accessToken: string }>
    >;
}
