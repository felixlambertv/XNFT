import { task } from "hardhat/config";
import { readContractInfo } from "../utils/contractReader";
import { isAddress } from "ethers";

task("mint", "Admin mint NFT")
  .addParam<string>("mintTo", "Mint for user address")
  .setAction(async (taskArgs, hre) => {
    if (!isAddress(taskArgs.mintTo)) {
      console.log("Address args not valid");
      return;
    }

    const contractAddress = readContractInfo(
      "XNFTModule#XNFT",
      hre.network.name
    );

    if (!contractAddress) {
      console.log("Contract not found");
      return;
    }

    const [admin] = await hre.ethers.getSigners();
    const nftContract = await hre.ethers.getContractAt("XNFT", contractAddress);
    const trx = await nftContract.connect(admin).mint(taskArgs.mintTo);
    console.log(`Transaction Hash: ${trx.hash}`);
  });
