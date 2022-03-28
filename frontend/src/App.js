import { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "./ERC20abi.json";
import ErrorMessage from "./ErrorMessage";
import TxList from "./TxList";

export default function App() {
  const erc20abi = abi.abi;
  const [txs, setTxs] = useState([]);
  const [contractListened, setContractListened] = useState();
  // const [error, setError] = useState();
  const [introMessage, setintroMessage] = useState(
    "Click The GET TOKEN INFO Button Below To Connect Rinkeby Account And Load Smart Contract"
  );
  const [contractInfo, setContractInfo] = useState({
    address: "-",
    tokenName: "-",
    tokenSymbol: "-",
    totalSupply: "-",
  });
  const [balanceInfo, setBalanceInfo] = useState({
    address: "-",
    balance: "-",
  });
  const [userStakeInfo, setuserStakeInfo] = useState({
    address: "-",
    balance: "-",
  });

  useEffect(() => {
    if (contractInfo.address !== "-") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const erc20 = new ethers.Contract(
        contractInfo.address,
        erc20abi,
        provider
      );

      erc20.on("Transfer", (from, to, amount, event) => {
        console.log({ from, to, amount, event });

        setTxs((currentTxs) => [
          ...currentTxs,
          {
            txHash: event.transactionHash,
            from,
            to,
            amount: String(amount),
          },
        ]);
      });
      setContractListened(erc20);

      return () => {
        contractListened.removeAllListeners();
      };
    }
  }, [contractInfo.address]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const data = new FormData(e.target);
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const erc20 = new ethers.Contract(
      "0xF38AbbDE9ffC9e6178CedC38be273ee531abAf4a",
      erc20abi,
      provider
    );

    const tokenName = await erc20.name();
    const tokenSymbol = await erc20.symbol();
    const totalSupply = await erc20.totalSupply();

    setContractInfo({
      address: "0xF38AbbDE9ffC9e6178CedC38be273ee531abAf4a",
      tokenName,
      tokenSymbol,
      totalSupply,
    });
    setintroMessage("");
  };

  const getMyBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const erc20 = new ethers.Contract(contractInfo.address, erc20abi, provider);
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();
    const balance = await erc20.balanceOf(signerAddress);

    setBalanceInfo({
      address: signerAddress,
      balance: String(balance),
    });
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const erc20 = new ethers.Contract(contractInfo.address, erc20abi, signer);
    await erc20.transfer(data.get("recipient"), data.get("amount"));
  };

  const stakeToken = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    // const signerAddress = await signer.getAddress();
    const erc20 = new ethers.Contract(contractInfo.address, erc20abi, signer);
    await erc20.stakeToken(data.get("amount"));
  };

  const unstakeToken = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const erc20 = new ethers.Contract(contractInfo.address, erc20abi, signer);
    await erc20.unstakeToken(data.get("amount"));
  };

  const buyToken = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();
    const erc20 = new ethers.Contract(contractInfo.address, erc20abi, signer);
    const options = { value: ethers.utils.parseEther(data.get("amount")) };
    await erc20.buyToken(options);
  };

  const claimReward = async (e) => {
    e.preventDefault();
    // const data = new FormData(e.target);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const erc20 = new ethers.Contract(contractInfo.address, erc20abi, signer);
    const status = await erc20.claimReward();
  };

  const getMyStakeBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const erc20 = new ethers.Contract(contractInfo.address, erc20abi, provider);
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();
    const balance = await erc20.stakeBalance(signerAddress);

    setuserStakeInfo({
      address: signerAddress,
      balance: String(balance),
    });
  };

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 ">
      <div>
        <form className="m-4" onSubmit={handleSubmit}>
          <div className="credit-card w-full lg:w-4/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
            <main className="mt-4 p-4">
              {introMessage === "" && (
                <h1 className="text-xl font-semibold text-gray-700 text-center">
                  Read From Smart Contract
                </h1>
              )}
              <p className="text-xl font-semibold text-gray-700 text-center">
                {introMessage}
              </p>
              {/* <div className="">
                <div className="my-3">
                  <input
                    type="text"
                    name="addr"
                    className="input input-bordered block w-full focus:ring focus:outline-none"
                    placeholder="ERC20 contract address"
                  />
                </div>
              </div> */}
            </main>
            <footer className="p-4">
              <button
                type="submit"
                className="btn btn-success submit-button focus:ring focus:outline-none w-full"
              >
                Get token info
              </button>
            </footer>
            <div className="px-4">
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Symbol</th>
                      <th>Total supply</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>{contractInfo.tokenName}</th>
                      <td>{contractInfo.tokenSymbol}</td>
                      <td>{String(contractInfo.totalSupply)}</td>
                      <td>{contractInfo.deployedAt}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="p-4">
              <button
                onClick={getMyBalance}
                type="submit"
                className="btn btn-success submit-button focus:ring focus:outline-none w-full"
              >
                Get my balance
              </button>
            </div>
            <div className="px-4">
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Address</th>
                      <th>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>{balanceInfo.address}</th>
                      <td>{balanceInfo.balance}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="p-4">
              <button
                onClick={getMyStakeBalance}
                type="submit"
                className="btn btn-success submit-button focus:ring focus:outline-none w-full"
              >
                Get Stake balance
              </button>
            </div>
            <div className="px-4">
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Address</th>
                      <th>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>{userStakeInfo.address}</th>
                      <td>{userStakeInfo.balance}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="p-4">
              <button
                onClick={claimReward}
                type="submit"
                className="btn btn-success submit-button focus:ring focus:outline-none w-full"
              >
                Claim reward
              </button>
            </div>
          </div>
        </form>
      </div>
      <div>
        <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
          <div className="mt-4 p-4">
            <h1 className="text-xl font-semibold text-gray-700 text-center">
              Write to Smart Contract
            </h1>

            <form onSubmit={stakeToken}>
              <div className="my-3">
                <input
                  type="text"
                  name="amount"
                  className="input input-bordered block w-full focus:ring focus:outline-none"
                  placeholder="Amount to Tokens to Stake"
                />
              </div>
              <footer className="p-4">
                <button
                  type="submit"
                  className="btn btn-success submit-button focus:ring focus:outline-none w-full"
                >
                  Stake Tokens
                </button>
              </footer>
            </form>
            <form onSubmit={unstakeToken}>
              <div className="my-3">
                <input
                  type="text"
                  name="amount"
                  className="input input-bordered block w-full focus:ring focus:outline-none"
                  placeholder="Amount to Tokens to Unstake"
                />
              </div>
              <footer className="p-4">
                <button
                  type="submit"
                  className="btn btn-success submit-button focus:ring focus:outline-none w-full"
                >
                  UnStake Tokens
                </button>
              </footer>
            </form>
            <form onSubmit={buyToken}>
              <div className="my-3">
                <input
                  type="text"
                  name="amount"
                  className="input input-bordered block w-full focus:ring focus:outline-none"
                  placeholder="Amount of ethers"
                />
              </div>
              <footer className="p-4">
                <button
                  type="submit"
                  className="btn btn-success submit-button focus:ring focus:outline-none w-full"
                >
                  Buy Tokens
                </button>
              </footer>
            </form>

            <form onSubmit={handleTransfer}>
              <div className="my-3">
                <input
                  type="text"
                  name="recipient"
                  className="input input-bordered block w-full focus:ring focus:outline-none"
                  placeholder="Recipient address"
                />
              </div>
              <div className="my-3">
                <input
                  type="text"
                  name="amount"
                  className="input input-bordered block w-full focus:ring focus:outline-none"
                  placeholder="Amount to transfer"
                />
              </div>
              <footer className="p-4">
                <button
                  type="submit"
                  className="btn btn-success submit-button focus:ring focus:outline-none w-full"
                >
                  Transfer Tokens
                </button>
              </footer>
            </form>
          </div>
        </div>
      </div>

      {/* <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
        <div className="mt-4 p-4">
          <h1 className="text-xl font-semibold text-gray-700 text-center">
            Recent transactions
          </h1>
          <p>
            <TxList txs={txs} />
          </p>
        </div>
      </div> */}
    </div>
  );
}
