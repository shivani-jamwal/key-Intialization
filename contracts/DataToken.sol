// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DataStorageToken is ERC1155, Ownable {
    uint256 public tokenCounter;
    mapping(uint256 => string) private _tokenCIDs;  
    mapping(uint256 => address) private _dataOwners;  

    constructor(string memory uri) ERC1155(uri) Ownable(msg.sender) {
        tokenCounter = 0;
    }

    function createToken(address owner, string memory ipfsHash, uint256 amount) public onlyOwner returns (uint256) {
        uint256 newTokenId = tokenCounter;
        _mint(owner, newTokenId, amount, "");
        _tokenCIDs[newTokenId] = ipfsHash;
        _dataOwners[newTokenId] = owner;
        tokenCounter += 1;
        return newTokenId;
    }

    function tokenCID(uint256 tokenId) public view returns (string memory) {
        return _tokenCIDs[tokenId];
    }

    function dataOwner(uint256 tokenId) public view returns (address) {
        return _dataOwners[tokenId];
    }
}
