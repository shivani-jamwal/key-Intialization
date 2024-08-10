import React, { useState } from 'react';
import init, { encrypt } from '../keygen_server/pkg'; 

const DataEncryption: React.FC = () => {
    const [publicKey, setPublicKey] = useState<string | null>(null);
    const [policy, setPolicy] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [ciphertext, setCiphertext] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleEncrypt = async () => {
        setError(null);
        if (!publicKey) {
            setError("Public key is required");
            return;
        }
        try {
            await init(); // Initialize the WASM module
            const encodedMessage = new TextEncoder().encode(message);
            const result = encrypt(publicKey, policy, encodedMessage);
            setCiphertext(result);
        } catch (err) {
            const errorMessage = (err as Error).message || "Encryption failed";
            setError(errorMessage);
            console.error("Encryption failed:", err); // Log the full error to the console
        }
    };
    
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const jsonContent = event.target?.result as string;
                    setPublicKey(jsonContent);
                    setError(null);
                } catch (err) {
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
                <label>Upload Public Key (.json):</label>
                <input
                    type="file"
                    accept=".json"
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
            
            <button onClick={handleEncrypt}>Encrypt</button>
            
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
