const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("Token contract", function () {
	it("Deployment should assign all tokens to owner", async function () {
		const [owner] = await ethers.getSigners();

		const Token = await ethers.getContractFactory("Token");

		const hardhatToken = await Token.deploy();

		const ownerBalance = await hardhatToken.balanceOf(owner.address);
		expect(await hardhatToken.totalSupply()).to.equal(ownerBalance)

	})

	it("Should transfer tokens between accounts", async function () {
		const TRANSACTION_AMOUNT = 50;

		const [owner, user1] = await ethers.getSigners();
		const Token = await ethers.getContractFactory("Token");
		const hardhatToken = await Token.deploy();

		const ownerBalance = await hardhatToken.balanceOf(owner.address);

		await hardhatToken.transfer(user1.address, TRANSACTION_AMOUNT);
		const ownerAfterTransferBalance = ownerBalance - TRANSACTION_AMOUNT;

		expect(await hardhatToken.balanceOf(user1.address)).to.equal(TRANSACTION_AMOUNT);
		expect(await hardhatToken.balanceOf(owner.address)).to.equal(ownerAfterTransferBalance);
	})
})
