/**
 * @type import('hardhat/config').HardhatUserConfig
 */

import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import "@typechain/hardhat";
require('dotenv').config()

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY
const ROPSTEN_PRIVATE_KEY = process.env.ROPSTEN_PRIVATE_KEY


module.exports = {
    solidity: "0.7.3",
    networks: {
        ropsten: {
            url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
            accounts: [`${ROPSTEN_PRIVATE_KEY}`]
        }
    }
};
