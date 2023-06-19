const { run } = require("hardhat")

async function main() {
    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log(
            `Verifying contract @ ${process.env.ADDRESS_LAST_DEPLOYED_CONTRACT} ...`
        )
        await verify(process.env.ADDRESS_LAST_DEPLOYED_CONTRACT, [])
    } else {
        console.log("skipping verification ...")
    }
}

async function verify(contractAddress, args) {
    console.log("Verifying contract ...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified ...")
        } else {
            console.log(e)
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
