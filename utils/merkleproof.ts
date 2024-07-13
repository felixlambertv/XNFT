import { whitelistUsers } from "../constants/data";
import { SimpleMerkleTree } from "@openzeppelin/merkle-tree";
import { keccak256 } from "ethers";

export function getMerkleTree(): SimpleMerkleTree {
  const whitelistUserInByte = whitelistUsers.map((address) =>
    keccak256(address)
  );
  const tree = SimpleMerkleTree.of(whitelistUserInByte);
  return tree;
}
