pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";
import "./Token.sol";

contract VestingContract is Ownable {
    using SafeMath for uint;

    uint256 public vestingPeriodDays = 30;
    uint256 totalVested = 0;
    ERC20 public token;

    struct beneficiary {
        uint256 vestStart;
        uint256 claimed;
        uint256 vested;
    }

    mapping(address => beneficiary) public beneficiaries;

    constructor(address _token){
        token = ERC20(_token);
    }

    function vest(address addr, uint256 amount) public onlyOwner {
        require(beneficiaries[addr].vestStart == 0, "Beneficiary already registered");
        require(token.allowance(msg.sender, address(this)) >= amount, "not enough coins allowed");

        token.transferFrom(msg.sender, address(this), amount);

        beneficiary storage newBeneficiary = beneficiaries[addr];
        newBeneficiary.vested = amount;
        newBeneficiary.claimed = 0;
        newBeneficiary.vestStart = block.timestamp;
    }

    function claim(uint256 amount) public {
        beneficiary storage beneficiary = beneficiaries[msg.sender];

        uint256 daysFromStart = (block.timestamp - beneficiary.vestStart) / 86400;
        console.log("Days From Start %s", daysFromStart);
        uint256 availableToClaim = (beneficiary.vested * 10000 / vestingPeriodDays * 10000 * daysFromStart - beneficiary.claimed * 10000) / 100000000;

        if (daysFromStart == vestingPeriodDays) {
            availableToClaim = beneficiary.vested - beneficiary.claimed;
        }

        console.log("Available to claim: %s", availableToClaim);

        require(amount <= availableToClaim, "Not enough coins to claim");
        token.transfer(msg.sender, amount);
    }

}
