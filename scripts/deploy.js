const hre = require("hardhat");

async function main() {
    const DataStorageToken = await hre.ethers.getContractFactory("DataStorageToken");
    const dataStorageToken = await DataStorageToken.deploy("");

    // Wait for the contract to be deployed
    const deployedContract = await dataStorageToken.waitForDeployment();
    
    console.log("DataStorageToken deployed to:", deployedContract.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
