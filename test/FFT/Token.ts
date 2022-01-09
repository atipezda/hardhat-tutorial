import {ethers} from "hardhat";
import {expect} from "chai";
import {Contract} from "ethers";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";

describe("FFTToken Token contract", () => {

    let Token;
    let hardhatToken: Contract;
    let owner: SignerWithAddress
    let addr1: SignerWithAddress

    beforeEach(async () => {
        Token = await ethers.getContractFactory("FFToken");
        [owner, addr1] = await ethers.getSigners();
        hardhatToken = await Token.deploy();
    })

    describe("Deployment", () => {
        it("Deployment should assign all tokens to owner", async () => {
            const ownerBalance = await hardhatToken.balanceOf(owner.address);
            expect(await hardhatToken.totalSupply()).to.equal(ownerBalance)
        })
    })

    describe("Transfer", () => {
        it("Should transfer tokens between accounts", async () => {
            const TRANSACTION_AMOUNT = 50;

            const ownerBalance = await hardhatToken.balanceOf(owner.address);

            await hardhatToken.transfer(addr1.address, TRANSACTION_AMOUNT);

            expect(await hardhatToken.balanceOf(addr1.address)).to.equal(TRANSACTION_AMOUNT);
            expect(await hardhatToken.balanceOf(owner.address)).to.equal(ownerBalance - TRANSACTION_AMOUNT);
        })

        it("Should fail if insufficient balance", async () => {
            const initialOwnerBalance = await hardhatToken.balanceOf(owner.address)
            const initialAddr1Balance = await hardhatToken.balanceOf(addr1.address)

            await expect(hardhatToken.connect(addr1).transfer(owner.address, 1)).to.be.revertedWith("ERC20: transfer amount exceeds balance")
            expect(await hardhatToken.balanceOf(owner.address)).to.equal(initialOwnerBalance)
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal(initialAddr1Balance)
        })

    })


    describe("Mint", () => {
        it("Owner should be able to mint", async () => {
            const TOKENS_TO_MINT = 10;
            const ownerBalance = await hardhatToken.balanceOf(owner.address);
            hardhatToken.createTokens(TOKENS_TO_MINT);
            expect(await hardhatToken.balanceOf(owner.address)).to.equal(Number(ownerBalance) + TOKENS_TO_MINT);
        })

        it("Should fail to mint from non-owner address", async () => {
            const TOKENS_TO_MINT = 10;

            const addr1InitialBalance = await hardhatToken.balanceOf(addr1.address);
            await expect(hardhatToken.connect(addr1).createTokens(TOKENS_TO_MINT)).to.be.revertedWith("Ownable: caller is not the owner")
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal(addr1InitialBalance);
        })
    })
})

