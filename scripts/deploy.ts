import {ethers} from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    const tokenFactory = await ethers.getContractFactory("FFToken");

    const token = await tokenFactory.deploy();


    const VestingFactory = await ethers.getContractFactory("VestingContract");

    const vesting = await VestingFactory.deploy(token.address);


    console.log("Token address:", token.address);
    console.log("Vesting contract address:", vesting.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
