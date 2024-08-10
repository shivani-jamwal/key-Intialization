use wasm_bindgen::prelude::*;
use rabe::schemes::bsw::*;

#[wasm_bindgen]
pub fn generate_key() -> String {
    let (pk, msk) = setup();
    format!("PK: {:?}, MSK: {:?}", pk, msk)
}
