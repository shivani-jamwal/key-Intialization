require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
require("dotenv").config(); 

module.exports = {
    solidity: "0.8.20",
    networks: {
        sepolia: {
            url: `https://eth-sepolia.g.alchemy.com/v2/rRHXwhjv6pPpekhTqlwlsr_4Z2JnU1S1`,
            accounts: [`0x${process.env.PRIVATE_KEY}`] 
        }
    }
};
