import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "./tasks";

const SEPOLIA_API_KEY = vars.get("SEPOLIA_API_KEY");
const ETHERS_API_KEY = vars.get("ETHERS_API_KEY");
const DEPLOYER_PRIVATE_KEY = vars.get("DEPLOYER_PRIVATE_KEY");

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${SEPOLIA_API_KEY}`,
      accounts: [
        DEPLOYER_PRIVATE_KEY, //deployer
      ],
    },
  },
  etherscan: {
    apiKey: ETHERS_API_KEY,
  },
};

export default config;
