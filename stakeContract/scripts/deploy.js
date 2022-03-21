const main = async () => {
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log("Deploying contracts with account: ", deployer.address);
  console.log("Account balance: ", accountBalance.toString());

  const StakeContractFactory = await hre.ethers.getContractFactory(
    "StakeContract"
  );
  const stakeContract = await StakeContractFactory.deploy(
    "Z-Stake Token",
    "ZST"
  );
  await stakeContract.deployed();

  console.log("stakeContract address: ", stakeContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

runMain();
