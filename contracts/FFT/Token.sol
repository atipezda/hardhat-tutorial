pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FFToken is ERC20, Ownable {
    uint256 public totalCoinsSupply = 1000000;
    mapping(address => uint256) balances;

    constructor() public ERC20 ("Fred Flintstone Token", "FFT"){
        _mint(msg.sender, totalCoinsSupply);
    }

    function decimals() override public view returns (uint8) {
        return 0;
    }

    function createTokens(uint256 amount) public onlyOwner {
        _mint(msg.sender, amount);
    }
}
