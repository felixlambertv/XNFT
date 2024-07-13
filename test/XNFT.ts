import { keccak256 } from "ethers";
import { XNFT } from "./../typechain-types/contracts/XNFT";
import { ignition, ethers } from "hardhat";
import XNFTModule from "../ignition/modules/XNFT";
import { expect } from "chai";
import { getMerkleTree } from "../utils/merkleproof";
import { whitelistUsers } from "../constants/data";

describe("XNFT contract", function () {
  let nftContract: XNFT;

  before(async () => {
    //@ts-ignore: Suppress type conversion
    ({ xnftToken: nftContract } = (await ignition.deploy(XNFTModule)) as {
      xnftToken: XNFT;
    });
  });

  describe("Deployment", function () {
    it("Should have correct deployer or admin", async function () {
      const [deployer] = await ethers.getSigners();
      const deployerAddress = await nftContract.owner();
      expect(deployer.address).to.equal(deployerAddress);
    });
  });

  describe("Mint function", function () {
    it("Should mint a new token", async function () {
      const [, user1] = await ethers.getSigners();
      await nftContract.mint(user1.address);

      const balance = await nftContract.balanceOf(user1.address);
      expect(balance).to.equal(1);

      const tokenIdCounter = await nftContract.totalMinted();
      expect(tokenIdCounter).to.equal(1);
    });

    it("Should only the owner to mint", async function () {
      const [, user1] = await ethers.getSigners();
      await expect(nftContract.connect(user1).mint(user1.address))
        .to.be.revertedWithCustomError(
          nftContract,
          "OwnableUnauthorizedAccount"
        )
        .withArgs(user1.address);
    });
  });

  describe("Whitelist mint function", function () {
    it("Should mint a new token", async function () {
      const merkleTree = getMerkleTree();
      const [, user1] = await ethers.getSigners();
      await nftContract
        .connect(user1)
        .whitelistMint(
          whitelistUsers[1],
          merkleTree.getProof(keccak256(whitelistUsers[1]))
        );

      const balance = await nftContract.balanceOf(user1.address);
      expect(balance).to.equal(1);

      const tokenIdCounter = await nftContract.totalMinted();
      expect(tokenIdCounter).to.equal(2);
    });

    it("Should revert when use invalid proof", async function () {
      const [, user1] = await ethers.getSigners();
      const randomAddress = ethers.Wallet.createRandom();

      await expect(
        nftContract
          .connect(user1)
          .whitelistMint(randomAddress.address, [
            keccak256(randomAddress.address),
          ])
      ).to.be.revertedWithCustomError(nftContract, "InvalidProof");
    });
  });

  describe("Transfer function", function () {
    it("Should success transfer token", async () => {
      const [, user1, user2] = await ethers.getSigners();
      const user1BalanceBefore = await nftContract.balanceOf(user1.address);
      await nftContract.connect(user1).transfer(user2.address, 1);
      const user1BalanceAfter = await nftContract.balanceOf(user1.address);
      expect(user1BalanceAfter).to.equal(user1BalanceBefore - BigInt(1));
      expect(await nftContract.ownerOf(1)).to.equal(user2.address);
    });

    it("Should fail when transfer unowned token", async () => {
      const [, user1, user2] = await ethers.getSigners();
      await expect(nftContract.connect(user1).transfer(user2.address, 1))
        .to.be.revertedWithCustomError(nftContract, "ERC721IncorrectOwner")
        .withArgs(user1.address, 1, user2.address);
    });

    it("Should fail when transfer unminted token", async () => {
      const [, user1, user2] = await ethers.getSigners();
      await expect(nftContract.connect(user1).transfer(user2.address, 9999))
        .to.be.revertedWithCustomError(nftContract, "ERC721NonexistentToken")
        .withArgs(9999);
    });
  });
});
