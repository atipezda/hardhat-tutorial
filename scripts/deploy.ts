import {ethers} from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying  contracts with account:", deployer.address);
    console.log("Deployer balance", await deployer.getBalance())

    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy();

    console.log("Token address:", token.address);

}

main().then(() => process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
})
