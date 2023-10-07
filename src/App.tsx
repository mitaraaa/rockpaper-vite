import { ethers } from "ethers";
import { useState } from "react";

import "./App.scss";
import Account from "./components/Account";
import Transaction from "./components/Transaction";
import { ITransaction, Moves, Outcomes } from "./interfaces";

import abi from "./assets/RockPaperScissors.json";

import rock from "./assets/rock.png";
import paper from "./assets/paper.png";
import scissors from "./assets/scissors.png";

declare global {
    interface Window {
        ethereum?: any;
    }
}

const validateBet = (value: string): boolean => {
    if (value.length > 0) {
        const regex = /(?<=^| )\d+(\.\d+)?(?=$| )/;
        if (regex.test(value)) {
            return true;
        }
    }

    return false;
};

const getRandomMove = (): string => {
    const moves = ["rock", "paper", "scissors"];
    return moves[Math.floor(Math.random() * moves.length)];
};

const getContract = (
    address: string,
    provider: ethers.providers.Web3Provider
) => {
    const signer = provider.getSigner();
    return new ethers.Contract(address, abi.abi, signer);
};

const getProvider = () => {
    return new ethers.providers.Web3Provider(window.ethereum);
};

const getBalance = async (provider: ethers.providers.Web3Provider) => {
    const signer = provider.getSigner();
    let _balance = ethers.utils.formatEther(await signer.getBalance());
    return parseFloat(_balance).toFixed(4).toString();
};

const App = () => {
    const address = import.meta.env.VITE_CONTRACT_ADDRESS || "";

    const [contractBalance, setContractBalance] = useState<string>("");
    const [balance, setBalance] = useState<string>("");
    const [move, setMove] = useState<Moves>(Moves.None);
    const [bet, setBet] = useState<string>("0.0001");
    const [transactions, setTransactions] = useState<ITransaction[]>([]);

    const provider = getProvider();

    provider?.send("eth_requestAccounts", []).then(async () => {
        setBalance(await getBalance(provider));
        await getContractBalance().then((balance) => {
            setContractBalance(balance);
        });
    });

    const getContractBalance = async () => {
        const contract = getContract(address, provider);
        const _balance = await contract.getBalance();
        return ethers.utils.formatEther(_balance).toString();
    };

    const play = async () => {
        if (!validateBet(bet)) {
            return;
        }

        const contract = getContract(address, provider);

        const result = await contract.play(move, getRandomMove(), {
            value: ethers.utils.parseEther(bet),
        });

        await result.wait();

        const hash = result.hash;
        console.log(hash);
        contract.once("Result", (outcome, userMove, randomMove, amount) => {
            console.log(outcome, userMove, randomMove, amount);
            setTransactions([
                ...transactions,
                {
                    hash: hash,
                    outcome: Object.values(Outcomes)[outcome],
                    userMove: Object.values(Moves)[userMove],
                    randomMove: Object.values(Moves)[randomMove],
                    bet: ethers.utils.formatUnits(amount, "ether").toString(),
                },
            ]);
        });

        setBalance(await getBalance(provider));
        await getContractBalance().then((balance) => {
            setContractBalance(balance);
        });
    };

    return (
        <div className="container">
            <div className="contract">
                <span>Rock Paper Scissors</span>
                <span className="address">{address}</span>
                <span className="contract-balance">{contractBalance} tBNB</span>
                <a href="https://github.com/mitaraaa">
                    Made by <u>@mitaraaa</u>
                </a>
            </div>
            <Account balance={balance} />
            <section className="moves">
                <button
                    className={"move " + (move == Moves.Rock ? "selected" : "")}
                    onClick={() => setMove(Moves.Rock)}
                >
                    <img src={rock} alt="rock" /> Rock
                </button>
                <button
                    className={
                        "move " + (move == Moves.Paper ? "selected" : "")
                    }
                    onClick={() => setMove(Moves.Paper)}
                >
                    <img src={paper} alt="paper" /> Paper
                </button>
                <button
                    className={
                        "move " + (move == Moves.Scissors ? "selected" : "")
                    }
                    onClick={() => setMove(Moves.Scissors)}
                >
                    <img src={scissors} alt="scissors" /> Scissors
                </button>
            </section>
            <form className="bet">
                <span>Your bet: </span>
                <input
                    type="text"
                    placeholder="0.0001"
                    value={bet}
                    onChange={(event) => setBet(event.target.value)}
                />
                <span>tBNB</span>
                <button type="button" onClick={play}>
                    Bet
                </button>
            </form>
            <div className="transactions">
                {transactions
                    .slice(0)
                    .reverse()
                    .map((transaction, key) => (
                        <Transaction key={key} {...transaction} />
                    ))}
            </div>
        </div>
    );
};

export default App;
