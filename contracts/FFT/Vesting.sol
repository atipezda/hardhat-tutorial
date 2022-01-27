pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract VestingContract is Ownable {

    uint256 public testValue = 0;

    struct beneficiary {
        uint256 vestEnd;
        uint256 vested;
    }

    mapping(address => beneficiary) public beneficiaries;

    function vest(address addr, uint256 amount) public onlyOwner{
        require(beneficiaries[addr].vestEnd == 0, "Beneficiary already registered");

        beneficiary storage newBeneficiary = beneficiaries[addr];
        newBeneficiary.vested = amount;
        newBeneficiary.vestEnd = block.timestamp + 30 days;
    }

}
