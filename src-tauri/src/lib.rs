#[tauri::command]
fn get_app_version(app: tauri::AppHandle) -> String {
    app.package_info().version.to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_store::Builder::new().build())
        .invoke_handler(tauri::generate_handler![get_app_version])
        .setup(|app| {
            let version = app.package_info().version.to_string();
            println!("[Orbit] Starting version {version}");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("[Orbit] Fatal: Failed to start.");
}
