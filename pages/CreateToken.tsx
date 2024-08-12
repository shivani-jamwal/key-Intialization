import React, { useState } from 'react';
import { JsonRpcProvider, Contract } from 'ethers';

const CreateTokenPage: React.FC = () => {
    const [dataOwner, setDataOwner] = useState<string>('');
    const [ipfsHash, setIpfsHash] = useState<string>('');
    const [amount, setAmount] = useState<number>(1);
    const [transactionHash, setTransactionHash] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCreateToken = async () => {
        try {
            setError(null);


            const provider = new JsonRpcProvider((window as any).ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner(); 

            // Replace with your contract's deployed address and ABI
            const contractAddress = "Your_Contract_Address";
            const contractABI = [
                "function createToken(address dataOwner, string memory ipfsHash, uint256 amount) public returns (uint256)"
            ];

            // Create an instance of the contract with the resolved signer
            const dataStorageToken = new Contract(contractAddress, contractABI, signer);

            // Call the createToken function
            const tx = await dataStorageToken.createToken(dataOwner, ipfsHash, amount);
            setTransactionHash(tx.hash);

            console.log("Transaction Hash:", tx.hash);
        } catch (error) {
            console.error("Error creating token:", error);
            setError("Failed to create token. Please ensure the details are correct and try again.");
        }
    };

    return (
        <div>
            <h2>Create Data Storage Token</h2>
            <div>
                <label>Data Owner Address:</label>
                <input
                    type="text"
                    value={dataOwner}
                    onChange={(e) => setDataOwner(e.target.value)}
                />
            </div>
            <div>
                <label>IPFS CID:</label>
                <input
                    type="text"
                    value={ipfsHash}
                    onChange={(e) => setIpfsHash(e.target.value)}
                />
            </div>
            <div>
                <label>Amount:</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                />
            </div>
            <button onClick={handleCreateToken}>Create Token</button>
            {transactionHash && (
                <div>
                    <h3>Token Created!</h3>
                    <p>Transaction Hash: {transactionHash}</p>
                </div>
            )}
            {error && (
                <div style={{ color: 'red' }}>{error}</div>
            )}
        </div>
    );
};

export default CreateTokenPage;
