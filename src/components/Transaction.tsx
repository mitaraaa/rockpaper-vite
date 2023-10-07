import { Moves, Outcomes } from "../interfaces";
import rock from "../assets/rock.png";
import paper from "../assets/paper.png";
import scissors from "../assets/scissors.png";

const getMoveImage = (move: Moves) => {
    switch (move) {
        case Moves.Rock:
            return rock;
        case Moves.Paper:
            return paper;
        case Moves.Scissors:
            return scissors;
        default:
            return rock;
    }
};

const Transaction = (props: TransactionProps) => {
    const userMove = getMoveImage(props.userMove);
    const randomMove = getMoveImage(props.randomMove);

    return (
        <div className="transaction">
            <div
                className={
                    "transaction-item outcome " +
                    (props.outcome == Outcomes.Win ? "win" : "")
                }
            >
                <span>{props.outcome}</span>
            </div>
            <div className="transaction-item move-small">
                <img src={userMove} />
            </div>
            <div className="transaction-item move-small">
                <img src={randomMove} />
            </div>
            <div className="transaction-item bet">
                <span>{props.bet} tBNB</span>
            </div>
        </div>
    );
};

interface TransactionProps {
    id?: string;
    outcome: Outcomes;
    userMove: Moves;
    randomMove: Moves;
    bet: string;
}

export default Transaction;
