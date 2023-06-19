require("@nomicfoundation/hardhat-toolbox")

require("dotenv").config()

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "https://eth-sepolia"
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xkey"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "Key"
const LOCALHOST_RPC_URL = process.env.LOCALHOST_RPC_URL || "https://eth-sepolia"
const OINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "key"

const SANAA_PRIVATE_KEY = process.env.SANAA_PRIVATE_KEY
const MUSCAT_PRIVATE_KEY = process.env.MUSCAT_PRIVATE_KEY
const PARIS_PRIVATE_KEY = process.env.PARIS_PRIVATE_KEY
const ARAFAT_PRIVATE_KEY = process.env.ARAFAT_PRIVATE_KEY
const SHOUAIB_PRIVATE_KEY = process.env.SHOUAIB_PRIVATE_KEY
const REPORT_GAS = process.env.REPORT_GAS || false

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.18",
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            blockConfirmations: 1,
        },
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [SANAA_PRIVATE_KEY],
            saveDeployments: true,
            chainId: 11155111,
        },
        localhost: {
            url: LOCALHOST_RPC_URL,
            chainId: 31337,
            blockConfirmations: 1,
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
}
