import { useState, useEffect } from "react";
import { getContract } from "../utils/blockchain";

declare global {
  interface Window {
    ethereum: any;
  }
}

export default function Home() {
  const [contract, setContract] = useState<any>(null);
  const [transaction, setTransaction] = useState("");
  const [chain, setChain] = useState<any[]>([]);

  useEffect(() => {
    const init = async () => {
      const contract = await getContract();
      setContract(contract);
      updateChain(contract);
    };

    if (window.ethereum) {
      window.ethereum.on("chainChanged", init);
      init();
    }
  }, []);

  const updateChain = async (contract: any) => {
    try {
      const chainLength = await contract.getChainLength();
      const newChain = [];

      for (let i = 0; i < chainLength; i++) {
        const block = await contract.chain(i);
        newChain.push({
          index: block.index.toString(),
          transactions: block.transactions || [], // Ensure array fallback
          hash: block.hash,
          previousHash: block.previousHash,
        });
      }

      setChain(newChain);
    } catch (error) {
      console.error("Error fetching chain:", error);
    }
  };

  const handleAddTransaction = async () => {
    await contract.addTransaction(transaction);
    setTransaction("");
  };

  const handleMineBlock = async () => {
    await contract.mineBlock();
    await updateChain(contract);
  };

  return (
    <div className="container mx-auto p-4">
      {/* UI Elements */}
      <div className="mb-4">
        <input
          className="border p-2 mr-2"
          value={transaction}
          onChange={(e) => setTransaction(e.target.value)}
          placeholder="Enter transaction"
        />
        <button
          className="bg-blue-500 text-white p-2 rounded mr-2"
          onClick={handleAddTransaction}
        >
          Add Transaction
        </button>
        <button
          className="bg-green-500 text-white p-2 rounded"
          onClick={handleMineBlock}
        >
          Mine Block
        </button>
      </div>

      {/* Blockchain Display */}
      <div className="space-y-4">
        {chain.map((block) => (
          <div key={block.index} className="border p-4 rounded">
            <h3 className="font-bold">Block #{block.index}</h3>
            <p className="text-sm break-words">Hash: {block.hash}</p>
            <p className="text-sm break-words">
              Previous Hash: {block.previousHash}
            </p>
            <div className="mt-2">
              {(block.transactions || []).map((tx: string, i: number) => (
                <div key={i} className="text-gray-600">
                  • {tx}
                </div>
              ))}
            </div>
          </div>
        ))}
        l̥
      </div>
    </div>
  );
}
