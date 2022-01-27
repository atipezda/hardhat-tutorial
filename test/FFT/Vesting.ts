import {ethers} from "hardhat";
import {expect} from "chai";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {VestingContract, VestingContract__factory} from "../../typechain-types";

describe.only("Vesting contract", () => {

    let Token: VestingContract__factory;
    let vestingContract: VestingContract;
    let owner: SignerWithAddress
    let addr1: SignerWithAddress
    let addr2: SignerWithAddress

    beforeEach(async () => {
        Token = <VestingContract__factory>await ethers.getContractFactory("VestingContract");
        [owner, addr1, addr2] = await ethers.getSigners();
        vestingContract = await Token.deploy();
    });

    describe("Deploy", () => {
        it("should deploy", async () => {
            expect(vestingContract.address);
        })
    })

    describe("Vesting", () => {
        const VESTED_COINS = 100;

        let ben1: Awaited<ReturnType<typeof vestingContract.beneficiaries>>

        beforeEach(async () => {
            await vestingContract.vest(addr1.address, VESTED_COINS);
            ben1 = await vestingContract.beneficiaries(addr1.address)
        });


        it("should register and store new beneficiary", async () => {
            expect(ben1.addr).to.not.equal(ethers.constants.AddressZero);
        })

        it("Should save vesting amount", async () => {
            expect(ben1.vested).to.equal(VESTED_COINS);
        })

        it("Should save vesting end date a month from now", async () => {
            const monthInSeconds = 60 * 60 * 24 * 30;

            const vestingEnd = ben1.vestEnd;
            const timeStamp = (await ethers.provider.getBlock("latest")).timestamp;
            const monthFromTimeStamp = timeStamp + monthInSeconds;

            expect(vestingEnd).to.equal(monthFromTimeStamp);
        })

        it("Should fail register same beneficiary", async () => {
            await expect(vestingContract.vest(addr1.address, 10000)).to.be.revertedWith("Beneficiary already registered");
        })

        it("Should fail if called by no-owner", async () => {
            await expect(vestingContract.connect(addr1).vest(addr2.address, 1000)).to.be.revertedWith("Ownable: caller is not the owner");
        });

    })
})

