use dotenv::dotenv;
use rabe::schemes::bsw::*;
use reqwest::Client;
use serde::Serialize;
use std::env;
use warp::Filter;

#[derive(Serialize)]
struct KeyData {
    public_key: String,
    master_secret_key: String,
}

#[derive(Serialize)]
struct PublicKeyResponse {
    public_key: String,
}

#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
    dotenv().ok();

    // Generate the keys
    let (pk, msk) = setup();
    let pk_str = format!("{:?}", pk);
    let msk_str = format!("{:?}", msk);

    println!("Public Key (PK): {}", pk_str);
    println!("Master Secret Key (MSK): {}", msk_str);

    // Store keys in Supabase
    let key_data = KeyData {
        public_key: pk_str.clone(),
        master_secret_key: msk_str,
    };

    let supabase_url = env::var("SUPABASE_URL").expect("SUPABASE_URL not set");
    let supabase_key = env::var("SUPABASE_KEY").expect("SUPABASE_KEY not set");

    let client = Client::new();

    let response = client
        .post(format!("{}/rest/v1/keys", supabase_url))
        .header("apikey", supabase_key.clone())
        .header("Authorization", format!("Bearer {}", supabase_key))
        .header("Content-Type", "application/json")
        .json(&key_data)
        .send()
        .await?;

    if response.status().is_success() {
        println!("Keys successfully stored in Supabase.");
    } else {
        println!(
            "Failed to store keys in Supabase: {:?}",
            response.text().await?
        );
    }

    let pk_route = warp::path("request-pk").map(move || {
        warp::reply::json(&PublicKeyResponse {
            public_key: pk_str.clone(),
        })
    });

    warp::serve(pk_route).run(([127, 0, 0, 1], 3030)).await;

    Ok(())
}
