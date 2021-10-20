const main = async () => {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying contracts with account: ', deployer.address);

  const movieContractFactory = await hre.ethers.getContractFactory('ScaryMovie');
  const movieContract = await movieContractFactory.deploy();
  
  await movieContract.deployed();
  console.log('Contract address:', movieContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();