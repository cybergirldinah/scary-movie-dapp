const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const movieContractFactory = await hre.ethers.getContractFactory("ScaryMovie");
  const movieContract = await movieContractFactory.deploy();
  await movieContract.deployed();
  console.log("Contract deployed to:", movieContract.address);

  let movieTxn = await movieContract.addMovie("Halloween");
  await movieTxn.wait();

  movieTxn = await movieContract.addMovie("Chucky");

  movieTxn = await movieContract.connect(randomPerson).addMovie("Friday the 13th");
  await movieTxn.wait();
  
  let allMovies = await movieContract.getAllMovies();
  console.log(allMovies)
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();