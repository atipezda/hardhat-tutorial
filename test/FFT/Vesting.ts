import {ethers} from "hardhat";
import {expect} from "chai";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {FFToken, FFToken__factory, VestingContract, VestingContract__factory} from "../../typechain-types";
import TimeTraveller from "../_helpers/TimeTraveller";
import {Calc} from "../_helpers/Calc";

import {BigNumber} from "ethers";

const {TIME} = TimeTraveller
const {roundDown, roundUp} = Calc

describe.only("Vesting contract", () => {

    let vestingContractFactory: VestingContract__factory;
    let vestingContract: VestingContract;
    let token: FFToken;
    let owner: SignerWithAddress
    let addr1: SignerWithAddress
    let addr2: SignerWithAddress
    let timeTraveller: TimeTraveller

    before(async () => {
        timeTraveller = new TimeTraveller(ethers.provider);
    })

    beforeEach(async () => {
        vestingContractFactory = <VestingContract__factory>await ethers.getContractFactory("VestingContract");
        const tokenFactory = <FFToken__factory>await ethers.getContractFactory("FFToken");
        [owner, addr1, addr2] = await ethers.getSigners();
        token = await tokenFactory.deploy();
        vestingContract = await vestingContractFactory.deploy(token.address);
    });

    describe("Deploy", () => {
        it("should deploy", async () => {
            expect(vestingContract.address);
        })

        it("should create FFToken", async () => {
            expect(await vestingContract.token()).to.not.equal(ethers.constants.AddressZero);
        })


    })

    describe("Vesting", () => {
        const VESTED_COINS = 100;

        let ben1: Awaited<ReturnType<typeof vestingContract.beneficiaries>>

        beforeEach(async () => {
            await token.approve(vestingContract.address, VESTED_COINS);
            await vestingContract.vest(addr1.address, VESTED_COINS);
            ben1 = await vestingContract.beneficiaries(addr1.address)
        });

        it("should claim vesting coins from owner", async () => {
            const TO_VEST = 10;

            const ownerBalance = Number(await token.balanceOf(owner.address));

            await token.approve(vestingContract.address, TO_VEST);
            await vestingContract.vest(addr2.address, TO_VEST);

            const newOwnerBalance = Number(await token.balanceOf(owner.address));

            expect(newOwnerBalance).to.equal(ownerBalance - TO_VEST);
        })

        it("should register and store new beneficiary", async () => {
            expect(ben1).to.not.equal(ethers.constants.AddressZero);
        })

        it("Should save vesting amount", async () => {
            expect(ben1.vested).to.equal(VESTED_COINS);
        })

        it("Should save vesting start date", async () => {
            const timeStamp = (await ethers.provider.getBlock("latest")).timestamp;
            expect(ben1.vestStart).to.equal(timeStamp);
        })

        it("Should fail register same beneficiary", async () => {
            const ownerBalance = await token.balanceOf(owner.address);
            await expect(vestingContract.vest(addr1.address, 10000)).to.be.revertedWith("Beneficiary already registered");
            const newOwnerBalance = await token.balanceOf(owner.address);
            expect(ownerBalance).to.equal(newOwnerBalance);
        })

        it("Should fail if called by no-owner", async () => {
            await expect(vestingContract.connect(addr1).vest(addr2.address, 1000)).to.be.revertedWith("Ownable: caller is not the owner");
        });

    })

    describe("Claim", () => {
        const VESTED_COINS = 77;

        const vestDurationDays = 30;
        const tokensByDay = VESTED_COINS / vestDurationDays;


        let ben1: Awaited<ReturnType<typeof vestingContract.beneficiaries>>
        let ben1initBalance = 0;

        beforeEach(async () => {
            await token.approve(vestingContract.address, VESTED_COINS);
            await vestingContract.vest(addr1.address, VESTED_COINS);
            ben1 = await vestingContract.beneficiaries(addr1.address)
            vestingContract = vestingContract.connect(addr1);
            ben1initBalance = Number(await token.balanceOf(addr1.address));
        });

        it("initial balance of beneficiary is 0", async () => {
            expect(ben1initBalance).to.equal(0);
            expect(await token.balanceOf(addr1.address)).to.equal(0);
        })

        it("allows to claim due part of tokens", async () => {
            const daysFromStart = 2;

            await timeTraveller.increaseTime(daysFromStart * TIME.DAY);
            const toClaim = roundDown(daysFromStart * tokensByDay);
            await vestingContract.claim(toClaim)
            const balance = await token.balanceOf(addr1.address);

            expect(balance).to.equal(toClaim);
        });

        it("Should allow partial-claim coins", async () => {
            const daysFromStart = 5;
            const partialClaim = 2;
            const fullClaim = 5;

            await timeTraveller.increaseTime(daysFromStart * TIME.DAY);
            await vestingContract.claim(partialClaim);
            expect(await token.balanceOf(addr1.address)).to.equal(partialClaim);

            await vestingContract.claim(fullClaim - partialClaim);
            expect(await token.balanceOf(addr1.address)).to.equal(fullClaim);

        })

        it("Should release amount proportional to time passed", async () => {
            const firstClaimDays = 4;
            const firstClaimMax = roundDown(firstClaimDays * VESTED_COINS / vestDurationDays);
            const nextClaimAfterDays = 4;
            const secondClaimMax = roundDown((firstClaimDays + nextClaimAfterDays) * VESTED_COINS / vestDurationDays)
            const availableToSecondClaim = secondClaimMax - firstClaimMax;

            await timeTraveller.increaseTime(firstClaimDays * TIME.DAY);
            await vestingContract.claim(firstClaimMax);
            expect(await token.balanceOf(addr1.address)).to.equal(firstClaimMax);

            await timeTraveller.increaseTime(nextClaimAfterDays * TIME.DAY);
            await vestingContract.claim(availableToSecondClaim);
            expect(await token.balanceOf(addr1.address)).to.equal(firstClaimMax + availableToSecondClaim);
        })


        it("should release all tokens at the end of vest", async () => {
            const daysFromStart = 30;
            await timeTraveller.increaseTime(daysFromStart * TIME.DAY);
            await vestingContract.claim(VESTED_COINS);
            expect(await token.balanceOf(addr1.address)).to.equal(VESTED_COINS);
        })

    });
})

