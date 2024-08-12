extern crate rabe;
use rabe::schemes::bsw::{self, CpAbeCiphertext, CpAbePublicKey};
use rabe::utils::policy::pest::PolicyLanguage;
use serde_json;

pub fn setup() -> Result<String, String> {
    let (pk, msk) = bsw::setup();
    let pk_json = serde_json::to_string(&pk).map_err(|_| "Failed to serialize public key".to_string())?;
    let msk_json = serde_json::to_string(&msk).map_err(|_| "Failed to serialize master secret key".to_string())?;
    
    let result = serde_json::to_string(&(pk_json, msk_json)).map_err(|e| format!("Serialization error: {:?}", e))?;
    
    Ok(result)
}


pub fn encrypt_with_setup(policy: &str, plaintext: Vec<u8>) -> Result<String, String> {

    let (pk, _msk) = bsw::setup();
    let policy_string = policy.to_string();
    let ct_cp: CpAbeCiphertext = bsw::encrypt(&pk, &policy_string, PolicyLanguage::HumanPolicy, &plaintext)
        .map_err(|e| format!("Encryption error: {:?}", e))?;
    let ciphertext_json = serde_json::to_string(&ct_cp)
        .map_err(|e| format!("Serialization error: {:?}", e))?;

    Ok(ciphertext_json)
}
