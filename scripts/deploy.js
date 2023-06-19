const { ethers } = require("hardhat")

async function main() {
    console.log("Deploying ConsumerShop ...")
    const deployedContract = await ethers.deployContract("ConsumerShop", [])
    const deployementReceipt = await deployedContract.waitForDeployment()
    const deployedContractAddress = await deployedContract.getAddress()

    console.log(`ConsumerShop Contract Address: ${deployedContractAddress} `)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
