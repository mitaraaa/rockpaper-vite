export enum Moves {
    None = "",
    Rock = "rock",
    Paper = "paper",
    Scissors = "scissors",
}

export enum Outcomes {
    None = "None",
    Win = "Win",
    Lose = "Lose",
    Draw = "Draw",
}

export interface ITransaction {
    hash?: string;
    outcome: Outcomes;
    userMove: Moves;
    randomMove: Moves;
    bet: string;
}

export interface Result {
    outcome: number;
    userMove: number;
    randomMove: number;
    amount: number;
}
