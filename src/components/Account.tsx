const Account = (props: AccountProps) => {
    return (
        <div className="account">
            <h1 className="balance">{props.balance} tBNB</h1>
            <span className="about">Your account</span>
        </div>
    );
};

interface AccountProps {
    balance: string;
}

export default Account;
