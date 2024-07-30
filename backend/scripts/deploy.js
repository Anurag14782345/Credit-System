const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const Agung = await hre.ethers.getContractFactory("Agung"); // Update to Agung
    const agung = await Agung.deploy(ethers.utils.parseUnits("1000", 18)); // Example initial supply

    console.log("Agung contract deployed to:", agung.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
