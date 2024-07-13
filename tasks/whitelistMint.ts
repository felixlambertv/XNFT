import { task } from "hardhat/config";
import { readContractInfo } from "../utils/contractReader";
import { isAddress, keccak256 } from "ethers";
import { getMerkleTree } from "../utils/merkleproof";

task("whitelistMint", "Whitelist mint")
  .addParam<string>("userAddress", "NFT ID")
  .setAction(async (taskArgs, hre) => {
    const userAddress = taskArgs.userAddress;

    if (!isAddress(userAddress)) {
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

    const merkleTree = getMerkleTree();
    const [admin] = await hre.ethers.getSigners();
    const nftContract = await hre.ethers.getContractAt("XNFT", contractAddress);
    const trx = await nftContract
      .connect(admin)
      .whitelistMint(userAddress, merkleTree.getProof(keccak256(userAddress)));
    console.log(`Transaction Hash: ${trx.hash}`);
  });
