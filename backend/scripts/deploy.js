const hre = require("hardhat");

async function main() {
  // Deploy REC Contract
  const REC = await hre.ethers.getContractFactory("REC");
  const initialSupply = hre.ethers.utils.parseUnits("1000000", 18); // Adjust the initial supply if needed
  const rec = await REC.deploy(initialSupply);
  await rec.deployed();

  console.log("REC deployed to:", rec.address);

  // Deploy Migrations Contract
  const Migrations = await hre.ethers.getContractFactory("Migrations");
  const migrations = await Migrations.deploy();
  await migrations.deployed();

  console.log("Migrations deployed to:", migrations.address);
}

// Execute the deployment script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
