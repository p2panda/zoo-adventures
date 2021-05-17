#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use aquadoggo::{Configuration, Runtime};
use async_std::task;

#[async_std::main]
async fn main() {
  env_logger::init();

  // Start p2panda node
  let config = Configuration::new(None).expect("Could not load configuration");
  let node = Runtime::start(config).await;

  // Show tauri web view
  tauri::Builder::default()
    .run(tauri::generate_context!())
    .expect("error while running tauri application");

  // Wait until all tasks are gracefully shut down and exit
  task::block_on(node.shutdown());
}
