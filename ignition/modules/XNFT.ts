import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { keccak256 } from "ethers";
import { getMerkleTree } from "../../utils/merkleproof";

export default buildModule("XNFTModule", (m) => {
  const merkleTree = getMerkleTree();
  // First account from hardhat config
  const deployer = m.getAccount(0);
  const xnftToken = m.contract("XNFT", [merkleTree.root], { from: deployer });
  return { xnftToken };
});
