use wasm_bindgen::prelude::*;
use rabe::schemes::bsw::{self, CpAbePublicKey, CpAbeCiphertext};
use rabe::utils::policy::pest::PolicyLanguage::JsonPolicy;
use serde_json;

#[wasm_bindgen]
pub fn generate_key() -> String {
    let (pk, msk) = bsw::setup();
    format!("PK: {:?}, MSK: {:?}", pk, msk)
}

#[wasm_bindgen]
pub fn encrypt_data(public_key_json: &str, policy: &str, plaintext: &str) -> String {

    let public_key: CpAbePublicKey = serde_json::from_str(public_key_json)
        .expect("Failed to deserialize public key");
    
    // let policy_value = parse(policy, JsonPolicy).unwrap();

    let ciphertext = bsw::encrypt(
        &public_key, 
        policy, 
        JsonPolicy, //JSON we go with this assumption --
        plaintext.as_bytes(),
    ).expect("Encryption failed");

    let serialized_ciphertext = serde_json::to_string(&ciphertext).expect("Serialization failed");
    let encrypted_str = base64::encode(&serialized_ciphertext);

    encrypted_str
}
