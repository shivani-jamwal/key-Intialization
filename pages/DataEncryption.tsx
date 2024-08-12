import React, { useState, useEffect } from 'react';
import init, { encrypt } from '../keygen_server/pkg'; // Ensure the correct import path

const DataEncryption: React.FC = () => {
    const [publicKey, setPublicKey] = useState<string | null>(null); // For storing the public key
    const [policy, setPolicy] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [ciphertext, setCiphertext] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [wasmLoaded, setWasmLoaded] = useState<boolean>(false);

    useEffect(() => {
        const loadWasm = async () => {
            try {
                await init(); // Initialize WASM module
                setWasmLoaded(true); // Mark WASM as loaded
            } catch (err) {
                console.error("Failed to load WASM module:", err);
                setError("Failed to initialize encryption module");
            }
        };
        loadWasm();
    }, []);

    const handleEncrypt = async () => {
        setError(null);

        if (!wasmLoaded) {
            setError("WASM module is not loaded yet.");
            return;
        }

        if (!publicKey) {
            setError("Public key is required.");
            return;
        }

        try {
            const encodedMessage = new TextEncoder().encode(message);
            const result = await encrypt(publicKey, policy, encodedMessage); // Await the Promise
            console.log("Encryption successful, ciphertext:", result);
            setCiphertext(result); // Set the actual ciphertext
        } catch (err) {
            const errorMessage = (err as Error).message || "Encryption failed";
            setError(errorMessage);
            console.error("Encryption error details:", err); 
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const jsonContent = event.target?.result as string;
                    console.log("Loaded Public Key:", jsonContent);
                    setPublicKey(jsonContent); // Set the public key
                    setError(null);
                } catch (err) {
                    console.error("Error parsing public key:", err);
                    setError("Failed to load public key file");
                }
            };
            reader.onerror = () => {
                setError("Failed to read the file");
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="p-5">
            <h1>Data Encryption</h1>

            <div>
                <label>Upload Public Key (.txt):</label>
                <input
                    type="file"
                    accept=".txt"
                    onChange={handleFileUpload}
                />
            </div>
            
            <div>
                <label>Policy:</label>
                <input
                    type="text"
                    value={policy}
                    onChange={(e) => setPolicy(e.target.value)}
                />
            </div>
            
            <div>
                <label>Message:</label>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </div>
            
            <button onClick={handleEncrypt} disabled={!wasmLoaded}>Encrypt</button>
            
            {ciphertext && (
                <div>
                    <h2>Ciphertext:</h2>
                    <textarea rows={10} readOnly value={ciphertext}></textarea>
                </div>
            )}
            
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
    );
};

export default DataEncryption;
