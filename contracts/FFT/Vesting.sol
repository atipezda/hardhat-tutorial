pragma solidity ^0.8.0;

contract VestingContract {

    struct beneficiary {
        address addr;
        string name;
    }

    mapping(address => beneficiary) beneficiaries;

    function registerBeneficiary(address addr, string memory name) public {
        beneficiary storage newBeneficiary = beneficiaries[addr];
        newBeneficiary.addr = addr;
        newBeneficiary.name = name;
    }

    function getBeneficiary(address addr) public view returns (string memory){
        beneficiary storage ben = beneficiaries[addr];
        return (ben.name);
    }

    function getBeneficiariesCount() public view returns (uint){
        return 1;
    }
}
