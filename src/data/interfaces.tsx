export interface dice {
    value: number;
    isHeld: boolean;
    id: string;
}
export interface player {
    name: string;
    changeName: boolean;
    score: { time: number; fouls: number };
    win: boolean;
    selectedDiceStyle: number;
}

export interface scoresArr {
    name: string;
    time: number;
    fouls: number;
}
