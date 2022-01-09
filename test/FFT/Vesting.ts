import {ethers} from "hardhat";
import {expect} from "chai";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {VestingContract, VestingContract__factory} from "../../typechain-types";


describe.only("Vesting contract", () => {

    let Token: VestingContract__factory;
    let vestingContract: VestingContract;
    let owner: SignerWithAddress
    let addr1: SignerWithAddress

    beforeEach(async () => {
        Token = <VestingContract__factory>await ethers.getContractFactory("VestingContract");
        [owner, addr1] = await ethers.getSigners();
        vestingContract = await Token.deploy();
    });

    describe("Deploy", () => {
        it("should deploy", async () => {
            expect(vestingContract.address);
        })
    })

    describe("Vesting", () => {
        it("should register and store new beneficiary name", async () => {
            const TEST_NAME = "Fred Flintstone";

            await vestingContract.registerBeneficiary(addr1.address, TEST_NAME)
            const name = await vestingContract.getBeneficiary(addr1.address);

            expect(name).to.equal(TEST_NAME);
        })
    })

})

