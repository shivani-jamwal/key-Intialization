extern crate rabe;
use crate::rabe::schemes::*;
use rabe::schemes::bsw::{CpAbeCiphertext, CpAbePublicKey, CpAbeSecretKey, CpAbeMasterKey};
use rabe::utils::policy::pest::PolicyLanguage;
use serde_json;
use wasm_bindgen::prelude::*;
use js_sys::Uint8Array;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}
#[wasm_bindgen]
pub fn setup() -> Result<JsValue, JsValue> {
    let (pk, msk) = bsw::setup();
    let pk_json = serde_json::to_string(&pk).unwrap_or_else(|_| "Failed to serialize public key".to_string());
    let msk_json = serde_json::to_string(&msk).unwrap_or_else(|_| "Failed to serialize master secret key".to_string());

    let result = (pk_json, msk_json);

    serde_wasm_bindgen::to_value(&result)
        .map_err(|e| e.into())
}

#[wasm_bindgen]
pub fn encrypt(pk_json: &str, policy: &str, plaintext: Vec<u8>) -> Result<String, JsValue> {
    let pk: CpAbePublicKey = serde_json::from_str(pk_json)
        .map_err(|e| JsValue::from_str(&e.to_string()))?;

    let policy_string = policy.to_string();
    
    let ct_cp: CpAbeCiphertext = bsw::encrypt(&pk, &policy_string, PolicyLanguage::HumanPolicy, &plaintext)
        .map_err(|e| JsValue::from_str(&e.to_string()))?;
    
    serde_json::to_string(&ct_cp)
        .map_err(|e| JsValue::from_str(&e.to_string()))
}



