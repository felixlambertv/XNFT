import { task } from "hardhat/config";
import { readContractInfo } from "../utils/contractReader";
import { isAddress, AddressLike, BigNumberish } from "ethers";

task("transfer", "Admin transfer NFT")
  .addParam<string>("nftId", "NFT ID")
  .addParam<string>("transferTo", "Transfer to address")
  .setAction(async (taskArgs, hre) => {
    const transferTo = taskArgs.transferTo;
    const nftId = taskArgs.nftId;

    if (!isAddress(transferTo)) {
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
    const trx = await nftContract.connect(admin).transfer(transferTo, nftId);
    console.log(`Transaction Hash: ${trx.hash}`);
  });
