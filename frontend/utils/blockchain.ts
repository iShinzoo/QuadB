import { ethers } from 'ethers';
import BlockchainSimulation from './BlockchainSimulation.json';

export const getContract = async () => {
  if (!window.ethereum) throw new Error("No Ethereum provider found");
  
  // Check contract address
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error("Blockchain contract not configured");
  }

  // Check network (example for Goerli testnet)
  const provider = new ethers.BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();
  if (network.chainId !== BigInt(5)) { // Update with your chain ID
    throw new Error("Please connect to the Goerli Testnet");
  }

  const signer = await provider.getSigner();
  
  return new ethers.Contract(
    contractAddress,
    BlockchainSimulation.abi,
    signer
  );
};