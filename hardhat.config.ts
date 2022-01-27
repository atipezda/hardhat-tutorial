/**
 * @type import('hardhat/config').HardhatUserConfig
 */

import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import "@typechain/hardhat";
import "@openzeppelin/hardhat-upgrades"
import "hardhat-gas-reporter"

require('dotenv').config()

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY
const ROPSTEN_PRIVATE_KEY = process.env.ROPSTEN_PRIVATE_KEY


module.exports = {
    solidity: "0.8.11",
    networks: {
        ropsten: {
            url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
            accounts: [`${ROPSTEN_PRIVATE_KEY}`]
        }
    },
    gasReporter: {
        currency: "USD",
        enabled: false,
        excludeContracts: [],
        src: "./contracts",
        noColors: true
    },
};
