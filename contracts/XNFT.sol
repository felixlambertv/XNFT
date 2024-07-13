// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract XNFT is ERC721, Ownable {
    error InvalidProof();
    error WhitelistMintAlreadyUser();

    mapping(address => bool) public isWhitelistMintUsed;
    uint256 private _tokenIdCounter;
    bytes32 public merkleRoot;

    constructor(
        bytes32 _merkleRoot
    ) ERC721("XNFT", "XNFT") Ownable(msg.sender) {
        merkleRoot = _merkleRoot;
    }

    function mint(address to) public onlyOwner {
        _tokenIdCounter++;
        _safeMint(to, _tokenIdCounter);
    }

    function transfer(address to, uint256 tokenId) public {
        _safeTransfer(msg.sender, to, tokenId);
    }

    function totalMinted() public view returns (uint256) {
        return _tokenIdCounter;
    }

    function whitelistMint(
        address to,
        bytes32[] calldata merkleProof
    ) external {
        if (isWhitelistMintUsed[to]) {
            revert WhitelistMintAlreadyUser();
        }

        bytes32 leaf = keccak256(abi.encodePacked(to));
        if (!MerkleProof.verify(merkleProof, merkleRoot, leaf)) {
            revert InvalidProof();
        }
        _tokenIdCounter++;
        isWhitelistMintUsed[to] = true;
        _safeMint(to, _tokenIdCounter);
    }
}
