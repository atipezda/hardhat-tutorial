import {ethers} from "hardhat";
import {expect} from "chai";
import {Contract} from "ethers";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";

describe("ATP Token contract", () => {

    let Token;
    let hardhatToken: Contract;
    let owner: SignerWithAddress
    let addr1: SignerWithAddress

    beforeEach(async () => {
        Token = await ethers.getContractFactory("Token");
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

        it("Should fail if insufficient balance", async ()=>{
            const initialOwnerBalance = await hardhatToken.balanceOf(owner.address)
            const initialAddr1Balance = await hardhatToken.balanceOf(addr1.address)

            await expect(hardhatToken.connect(addr1).transfer(owner.address,1)).to.be.revertedWith("Not enough tokens")
            expect (await hardhatToken.balanceOf(owner.address)).to.equal(initialOwnerBalance)
            expect (await hardhatToken.balanceOf(addr1.address)).to.equal(initialAddr1Balance)
        })

        it("Should fail if transfer amount is 0", async ()=>{
            await expect(hardhatToken.connect(addr1).transfer(owner.address,0)).to.be.revertedWith("Cannot transfer 0 coins")
        })


    })
})
