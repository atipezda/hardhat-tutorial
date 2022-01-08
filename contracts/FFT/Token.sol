pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    uint256 public totalCoinsSupply = 1000000;
    mapping(address => uint256) balances;

    constructor() public ERC20 ("Fred Flintstone Token", "FFT"){
        balances[msg.sender] = totalCoinsSupply;
        owner = msg.sender;
    }

    function decimals() override public view returns (uint8) {
        return 0;
    }

    address public owner;

}
