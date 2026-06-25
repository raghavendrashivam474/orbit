//! lib.rs
//! Orbit Tauri Application Library
//! Sprint 3: Browser commands registered.

mod browser;

use browser::{
    browser_back,
    browser_can_go_back,
    browser_can_go_forward,
    browser_destroy,
    browser_forward,
    browser_get_title,
    browser_get_url,
    browser_navigate,
    browser_reload,
    browser_stop,
};

#[tauri::command]
fn get_app_version(app: tauri::AppHandle) -> String {
    app.package_info().version.to_string()
}

#[tauri::command]
async fn minimize_window(window: tauri::Window) -> Result<(), String> {
    window.minimize().map_err(|e| e.to_string())
}

#[tauri::command]
async fn maximize_window(window: tauri::Window) -> Result<(), String> {
    if window.is_maximized().map_err(|e| e.to_string())? {
        window.unmaximize().map_err(|e| e.to_string())
    } else {
        window.maximize().map_err(|e| e.to_string())
    }
}

#[tauri::command]
async fn close_window(window: tauri::Window) -> Result<(), String> {
    window.close().map_err(|e| e.to_string())
}

#[tauri::command]
async fn is_window_maximized(window: tauri::Window) -> Result<bool, String> {
    window.is_maximized().map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_store::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            get_app_version,
            minimize_window,
            maximize_window,
            close_window,
            is_window_maximized,
            browser_navigate,
            browser_reload,
            browser_stop,
            browser_back,
            browser_forward,
            browser_get_title,
            browser_get_url,
            browser_can_go_back,
            browser_can_go_forward,
            browser_destroy,
        ])
        .setup(|app| {
            let version = app.package_info().version.to_string();
            println!("[Orbit] Starting version {version}");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("[Orbit] Fatal: Failed to start.");
}