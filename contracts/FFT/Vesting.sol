pragma solidity ^0.8.0;

contract VestingContract {

    uint256 public testValue = 0;

    struct beneficiary {
        address addr;
        uint256 vestEnd;
        uint256 vested;
    }

    mapping(address => beneficiary) public beneficiaries;

    function vest(address addr, uint256 amount) public {
        require(beneficiaries[addr].vested == 0, "Beneficiary already registered");

        beneficiary storage newBeneficiary = beneficiaries[addr];
        newBeneficiary.addr = addr;
        newBeneficiary.vested = amount;
        newBeneficiary.vestEnd = block.timestamp + 30 days;
    }

}
