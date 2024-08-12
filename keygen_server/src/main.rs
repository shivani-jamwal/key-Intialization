use keygen_server::encrypt_with_setup;
use ipfs_api::{IpfsClient, IpfsApi};
use std::fs::File;
use std::io::{self, Write};
use tokio;

async fn store_on_ipfs(data: &str) -> Result<String, Box<dyn std::error::Error>> {
    let client = IpfsClient::default();

    let mut tmpfile = File::create("/tmp/ipfs_data.txt")?;
    write!(tmpfile, "{}", data)?;
    tmpfile.sync_all()?;

    let file = File::open("/tmp/ipfs_data.txt")?;
    let res = client.add(file).await?;
    
    Ok(res.hash)
}

#[tokio::main]
async fn main() {
    let policy = r#"
    "attr1" and ("attr2" or "attr3") and ("attr4" or ("attr5" and "attr6"))
    "#;
    
    let plaintext = b"Hello, World!";

    match encrypt_with_setup(policy, plaintext.to_vec()) {
        Ok(ciphertext_json) => {
            println!("Encrypted ciphertext: {}", ciphertext_json);

            let mut attribute_pass = String::new();
            let mut attribute_fail = String::new();

            println!("Enter the attributes that passed (comma-separated):");
            io::stdin().read_line(&mut attribute_pass).expect("Failed to read input");

            println!("Enter the attributes that failed (comma-separated):");
            io::stdin().read_line(&mut attribute_fail).expect("Failed to read input");

            let data_to_store = format!(
                "Ciphertext: {}\nPolicy: {}\nAttribute Pass: {}\nAttribute Fail: {}",
                ciphertext_json.trim(), policy.trim(), attribute_pass.trim(), attribute_fail.trim()
            );

            match store_on_ipfs(&data_to_store).await {
                Ok(cid) => println!("Stored on IPFS with CID: {}", cid),
                Err(e) => println!("Error storing data on IPFS: {}", e),
            }
        },
        Err(e) => {
            println!("Encryption failed: {}", e);
        },
    }
}
