import {ethers} from "hardhat";
import {expect} from "chai";
import {Contract} from "ethers";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";

describe("Token contract", () => {

    let Token;
    let hardhatToken: Contract;
    let owner: SignerWithAddress
    let addr1: SignerWithAddress

    beforeEach(async () => {
        Token = await ethers.getContractFactory("Token");
        [owner, addr1] = await ethers.getSigners();
        hardhatToken = await Token.deploy();
    })


    it("Deployment should assign all tokens to owner", async () => {
        const ownerBalance = await hardhatToken.balanceOf(owner.address);
        expect(await hardhatToken.totalSupply()).to.equal(ownerBalance)
    })

    it("Should transfer tokens between accounts", async () => {
        const TRANSACTION_AMOUNT = 50;

        const ownerBalance = await hardhatToken.balanceOf(owner.address);

        await hardhatToken.transfer(addr1.address, TRANSACTION_AMOUNT);

        expect(await hardhatToken.balanceOf(addr1.address)).to.equal(TRANSACTION_AMOUNT);
        expect(await hardhatToken.balanceOf(owner.address)).to.equal(ownerBalance - TRANSACTION_AMOUNT);
    })
})
