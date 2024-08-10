import React, { useState } from 'react';
import init from '../keygen_server/pkg/keygen_server';
import encrypt_data from '../keygen_server/pkg/keygen_server'

const DataEncryption: React.FC = () => {
    const [plaintext, setPlaintext] = useState('');
    const [publicKey, setPublicKey] = useState('');
    const [policy, setPolicy] = useState('');
    const [encryptedData, setEncryptedData] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Initialize the WASM module
    React.useEffect(() => {
        init().then(() => console.log('WASM Module Initialized'));
    }, []);

    const handleEncryption = async () => {
        try {
            await init();  // Ensure the WASM module is initialized
            const encrypted = encrypt_data(plaintext, publicKey, policy);
            setEncryptedData(encrypted);
            setError(null);
        } catch (err) {
            setError('Encryption failed. Please check your inputs.');
            console.error(err);
        }
    };

    return (
        <div>
            <h1>Data Encryption</h1>
            <div>
                <label>
                    Plaintext:
                    <textarea
                        value={plaintext}
                        onChange={(e) => setPlaintext(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Public Key:
                    <textarea
                        value={publicKey}
                        onChange={(e) => setPublicKey(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Access Control Policy:
                    <textarea
                        value={policy}
                        onChange={(e) => setPolicy(e.target.value)}
                    />
                </label>
            </div>
            <button onClick={handleEncryption}>Encrypt Data</button>
            {encryptedData && (
                <div>
                    <h2>Encrypted Data:</h2>
                    <textarea readOnly value={encryptedData} />
                </div>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default DataEncryption;