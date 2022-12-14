// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const { artifacts } = require('hardhat');

async function main() {

  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  const [deployer] = await hre.ethers.getSigners();

  console.log(
    "Deployer:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Lottery = await hre.ethers.getContractFactory("Lottery");
  const lottery = await Lottery.deploy();

  lottery.deployed();

  if (network.name !== "hardhat") {
    await hre.run("verify:verify", {
      address: lottery.address
    });
  }
 
  console.log("Contract address:", lottery.address);

  saveFrontendFiles(lottery);
}

function saveFrontendFiles(lottery) {
  
  const contractsDir = path.join(__dirname, "..", "front", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ Lottery: lottery.address }, undefined, 2)
  );

  const LotteryArtifact = artifacts.readArtifactSync("Lottery");

  fs.writeFileSync(
    path.join(contractsDir, "Lottery.json"),
    JSON.stringify(LotteryArtifact, null, 2)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });