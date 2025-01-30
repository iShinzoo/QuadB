import { ethers } from "hardhat";

async function main() {
  const BlockchainSimulation = await ethers.getContractFactory("BlockchainSimulation");
  const blockchain = await BlockchainSimulation.deploy();

  await blockchain.waitForDeployment();

  console.log("Contract deployed to:", await blockchain.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});