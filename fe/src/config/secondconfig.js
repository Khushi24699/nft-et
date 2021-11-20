export const CONTRACT_ADDRESS = "0xF41ACFAbFA591927bcb0B2aadf706f08Fa27a9Aa";

export const ABI_ = [{
        "inputs": [{
            "internalType": "contract Token",
            "name": "_tokens",
            "type": "address"
        }],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": false,
                "internalType": "uint256",
                "name": "tokenid",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "issuer",
                "type": "address"
            }
        ],
        "name": "listedforsale",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            }
        ],
        "name": "tokensold",
        "type": "event"
    },
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "tokenid",
            "type": "uint256"
        }],
        "name": "buytoken",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "tokenid",
            "type": "uint256"
        }],
        "name": "cancelsell",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "tokenid",
                "type": "uint256"
            }
        ],
        "name": "listforsell",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
        }],
        "name": "tokendetails",
        "outputs": [{
                "internalType": "address",
                "name": "_owner",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "tokenuri",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
        }],
        "name": "tokenprice",
        "outputs": [{
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "tokens",
        "outputs": [{
            "internalType": "contract Token",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
        }],
        "name": "tokenstate",
        "outputs": [{
            "internalType": "uint256",
            "name": "forsale",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    }
]