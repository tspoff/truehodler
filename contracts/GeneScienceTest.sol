pragma solidity ^0.4.20;

contract GeneScienceTest {
    function isGeneScience() public pure returns (bool) {
        return true;   
    }
    
    function mixGenes(uint256 genes1, uint256 genes2, uint256 targetBlock) public returns (uint256) {
        return uint256(keccak256(genes1 + genes2 + targetBlock));
    }
}