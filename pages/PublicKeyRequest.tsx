import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function PublicKeyRequest() {
    const [publicKey, setPublicKey] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleRequestPublicKey = async () => {
        try {
            // Fetch the public key from Supabase
            const { data, error } = await supabase
                .from('keys')
                .select('public_key')
                .single();

            if (error) {
                throw new Error(error.message);
            }

            if (data && data.public_key) {
                setPublicKey(data.public_key);
                setError(null);
            } else {
                throw new Error('Public key not found');
            }
        } catch (err) {
            console.error('Supabase error:', err);
            setError('Failed to retrieve the public key from Supabase.');
            setPublicKey(null);
        }
    };

    return (
        <div>
            <h1>Request Public Key</h1>
            <button onClick={handleRequestPublicKey}>Request Public Key</button>
            {publicKey && (
                <div>
                    <h2>Public Key:</h2>
                    <pre>{publicKey}</pre>
                </div>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}
