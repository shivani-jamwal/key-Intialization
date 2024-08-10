import { useEffect, useState } from "react";
import { generate_key } from "@public/pkg/keygen_server";

const KeyGenComponent = () => {
    const [keys, setKeys] = useState<string | null>(null);

    useEffect(() => {
        const keyResult = generate_key();
        setKeys(keyResult);
    }, []);

    return (
        <div>
            <h1>Generated Keys</h1>
            <pre>{keys}</pre>
        </div>
    );
};

export default KeyGenComponent;
