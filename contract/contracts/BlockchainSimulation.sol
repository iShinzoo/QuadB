// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

// contract address 0xfEE13f5a75FD878b5A1a5E8e766eC087466c2ccC

contract BlockchainSimulation {
    struct Block {
        uint256 index;
        uint256 timestamp;
        string[] transactions;
        bytes32 previousHash;
        bytes32 hash;
        uint256 nonce;
    }

    Block[] public chain;
    uint256 public difficulty = 2;
    string[] pendingTransactions;

    constructor() {
        OriginBlock();
    }

    function OriginBlock() private {
        string[] memory originBlock = new string[](1);
        originBlock[0] = "Origin Block";
        chain.push(Block({
            index: 0,
            timestamp: block.timestamp,
            transactions: originBlock,
            previousHash: 0,
            hash: 0,
            nonce: 0
        }));
    }

    function addTransaction(string memory _transaction) public {
        pendingTransactions.push(_transaction);
    }

    function mineBlock() public {
        require(pendingTransactions.length > 0, "No transactions to mine");
        
        Block memory lastBlock = chain[chain.length - 1];
        
        Block memory newBlock = Block({
            index: chain.length,
            timestamp: block.timestamp,
            transactions: pendingTransactions,
            previousHash: lastBlock.hash,
            hash: 0,
            nonce: 0
        });

        // Proof-of-Work
        bytes32 hash = calculateHash(newBlock);
        while(uint256(hash) >> (256 - difficulty * 4) != 0) {
            newBlock.nonce++;
            hash = calculateHash(newBlock);
        }

        newBlock.hash = hash;
        chain.push(newBlock);
        delete pendingTransactions;
    }

    function calculateHash(Block memory _block) internal pure returns (bytes32) {
    // Pack each transaction into a single bytes variable
    bytes memory packedTransactions;
    for (uint256 i = 0; i < _block.transactions.length; i++) {
        packedTransactions = abi.encodePacked(
            packedTransactions,
            _block.transactions[i]
        );
    }
    
    // Include the packed transactions in the block hash calculation
    return keccak256(abi.encodePacked(
        _block.index,
        _block.timestamp,
        packedTransactions,
        _block.previousHash,
        _block.nonce
    ));
}

    function validateChain() public view returns (bool) {
        for(uint256 i = 1; i < chain.length; i++) {
            Block memory current = chain[i];
            Block memory previous = chain[i-1];

            if(current.previousHash != previous.hash) return false;
            if(current.hash != calculateHash(current)) return false;
        }
        return true;
    }

    function getChainLength() public view returns (uint256) {
        return chain.length;
    }
}