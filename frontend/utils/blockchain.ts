import { ethers } from 'ethers';
import BlockchainSimulation from './BlockchainSimulation.json';

export const getContract = async () => {
  if (!window.ethereum) throw new Error("No Ethereum provider found");
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  return new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
    BlockchainSimulation.abi,
    signer
  );
};