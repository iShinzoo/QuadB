import { useState, useEffect } from "react";
import { getContract } from "../utils/blockchain";
import { BeakerIcon, CubeTransparentIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

declare global {
  interface Window {
    ethereum: any;
  }
}

export default function Home() {
  const [contract, setContract] = useState<any>(null);
  const [transaction, setTransaction] = useState("");
  const [chain, setChain] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [isMining, setIsMining] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {

    // Connection 
    const checkConnection = async () => {
      if (window.ethereum?.selectedAddress) {
        try {
          await initBlockchain();
          setIsConnected(true);
        } catch (err) {
          setError("Connection lost. Please reconnect");
        }
      }
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", checkConnection);
      window.ethereum.on("chainChanged", checkConnection);
      checkConnection();
    }

    return () => {
      window.ethereum?.removeListener("accountsChanged", checkConnection);
      window.ethereum?.removeListener("chainChanged", checkConnection);
    };
  }, []);

  const initBlockchain = async () => {
    try {
      const contract = await getContract();
      setContract(contract);
      await updateChain(contract);
    } catch (err: any) {
      setError(err.message || "Failed to connect to blockchain");
      throw err;
    }
  };

  const updateChain = async (contract: any) => {
    try {
      const chainLength = await contract.getChainLength();
      const newChain = [];

      for (let i = 0; i < chainLength; i++) {
        const block = await contract.chain(i);
        newChain.push({
          index: block.index.toString(),
          transactions: block.transactions || [],
          hash: block.hash,
          previousHash: block.previousHash,
        });
      }

      setChain(newChain);
    } catch (err) {
      setError("Failed to update blockchain data");
    }
  };

  // connect Wallet to metamask
  const connectWallet = async () => {
    try {
      setError("");
      if (!window.ethereum) throw new Error("Please install MetaMask");
      
      await window.ethereum.request({ method: "eth_requestAccounts" });
      await initBlockchain();
      setIsConnected(true);
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet");
    }
  };

  // Adding transaction to blockchain
  const handleAddTransaction = async () => {
    if (!transaction.trim()) {
      setError("Transaction cannot be empty");
      return;
    }
    
    try {
      setError("");
      const tx = await contract.addTransaction(transaction);
      await tx.wait();
      setTransaction("");
      await updateChain(contract);
    } catch (err: any) {
      setError(err.message || "Transaction failed");
    }
  };

  // Mining block 
  const handleMineBlock = async () => {
    try {
      setIsMining(true);
      setError("");
      const tx = await contract.mineBlock();
      await tx.wait();
      await updateChain(contract);
    } catch (err: any) {
      setError(err.message || "Block mining failed");
    } finally {
      setIsMining(false);
    }
  };


  // UI 
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <CubeTransparentIcon className="h-8 w-8 text-cyan-400" />
            <h1 className="text-2xl font-bold">Blockchain Simulation Explorer</h1>
          </div>
          {!isConnected && (
            <button
              className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-lg font-medium
                       flex items-center gap-2 transition-colors"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          )}
        </div>

        {isConnected ? (
          <>
            {/* Transaction Form */}
            <div className="bg-slate-800 rounded-xl p-6 mb-8 shadow-xl">
              <div className="flex gap-4 mb-4">
                <input
                  className="flex-1 bg-slate-700 rounded-lg px-4 py-3 text-slate-100 
                           focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={transaction}
                  onChange={(e) => {
                    setTransaction(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter transaction data"
                />
                <button
                  className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-lg font-medium
                           flex items-center gap-2 transition-colors disabled:opacity-50"
                  onClick={handleAddTransaction}
                  disabled={!transaction.trim()}
                >
                  <BeakerIcon className="h-5 w-5" />
                  Add Transaction
                </button>
              </div>

              <button
                className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-lg
                         font-medium flex items-center justify-center gap-2 transition-colors
                         disabled:opacity-50"
                onClick={handleMineBlock}
                disabled={isMining}
              >
                {isMining ? (
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                ) : (
                  <CubeTransparentIcon className="h-5 w-5" />
                )}
                {isMining ? "Mining..." : "Mine Block"}
              </button>

              {error && (
                <div className="mt-4 p-3 bg-red-800/30 text-red-400 rounded-lg">
                  {error}
                </div>
              )}
            </div>

            {/* Blockchain Display */}
            <div className="space-y-4">
              {chain.map((block) => (
                <div
                  key={block.index}
                  className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-cyan-500/20 p-2 rounded-lg">
                      <CubeTransparentIcon className="h-6 w-6 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-semibold">Block #{block.index}</h3>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex gap-2">
                      <span className="text-slate-400">Hash:</span>
                      <span className="font-mono text-cyan-400 break-all">
                        {block.hash || "Pending..."}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-slate-400">Previous Hash:</span>
                      <span className="font-mono text-purple-400 break-all">
                        {block.previousHash || "Genesis Block"}
                      </span>
                    </div>

                    {block.transactions.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-700">
                        <h4 className="text-slate-400 mb-2">Transactions:</h4>
                        <div className="space-y-2">
                          {(block.transactions || []).map((tx: string, i: number) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 p-3 bg-slate-700/50 rounded-lg"
                            >
                              <div className="h-2 w-2 bg-cyan-400 rounded-full" />
                              <span className="font-mono break-all">{tx}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <button
              className="bg-cyan-600 hover:bg-cyan-700 px-8 py-4 rounded-xl font-medium
                       text-lg flex items-center gap-2 mx-auto transition-colors"
              onClick={connectWallet}
            >
              Connect Wallet to Continue
            </button>
            {error && (
              <div className="mt-4 p-3 bg-red-800/30 text-red-400 rounded-lg">
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}