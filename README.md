# Blockchain Simulation Explorer

A decentralized blockchain simulation dApp that allows users to:
- Add transactions to pending pool
- Mine blocks to the chain
- View complete blockchain with transaction history
- Connect with MetaMask wallet

 ## Tech Stack

**Frontend:**
- Next.js (React)
- Ethers.js
- Tailwind CSS

**Smart Contracts:**
- Solidity
- Hardhat
- Sepolia Testnet

**Deployment:**
- Vercel (Frontend)
- Alchemy/Infura (Blockchain Connection)
- Sepolia Ethereum Testnet

## Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) (v9+)
- [MetaMask](https://metamask.io/) Browser Extension
- Testnet ETH (Sepolia recommended)
- Basic understanding of blockchain concepts

## Preview Url - [ https://blockchain-simulation.vercel.app/ ] 
(Go and Explore Basic Blockchain simulation)

## Project Structure

* `Blockchain Simulation`
    * `Contract`
       * `Contracts` : contain BlockChainSimulation.sol (Adding, Mining and more functions)
       * `scripts` : contain deploy.ts deployment script
       * `.env ` : Api and private keys
    * `frontend`: Contains UI.
       * `pages` : contain index.ts with ui and smart contract interaction
       * `utils` : contain blockchain.ts and BlockChainSimulation.json(ABI file)
       * `.env ` : contract address
   
## Installation
1. Clone the repository:
```bash
git clone https://github.com/iShinzoo/QuadB
cd QuadB
```
1. For Smart contract
```
cd Contract
npm install
```
* Create .env file add the value of keys used by hardhat.config.ts (Alchemy Sepolia URL and private address)
* compile and deploy the smart contract and get contract address
```
npx hardhar compile
npx hardhat run scripts/deploy.ts --network sepolia
```
2. Frontend
```
cd frontend
npm install
```
* Create .env file add the contract address of deploy smart contract and in frontend/utils/BlockChainSimulation.json paste the code generate in QuadB/Contract/artifacts/BlockChainSimulation.json on success comiplation of code
```
npm run dev

```
## Usage Guide
1. Connect Wallet
* Click "Connect Wallet" button
* Authorize MetaMask connection
* Approve network switch if prompted
2. Add Transaction
* Enter transaction data in input field
* Click "Add Transaction"
* Confirm MetaMask transaction
3. Mine Block
* Click "Mine Block" when transactions are pending
* Confirm mining transaction in MetaMask
* Wait for block confirmation (≈15-30 secs)
4. View Blockchain
* Scroll through blocks
* Expand transactions in each block
* Verify hash integrity

## Contributing
* Fork the repository
* Create your feature branch (git checkout -b feature/amazing-feature)
* Commit your changes (git commit -m 'Add some amazing feature')
* Push to the branch (git push origin feature/amazing-feature)
* Open a Pull Request

## Acknowledgements
* ethers.js for blockchain interactions
* Metamask for wallet
* Ethereum Foundation for Sepolia testnet
* Hardhat documentation
* Vercel for deployment hosting


## `Make sure to Star the Repository`
