//! lib.rs
//! Orbit Tauri Application Library
//! Sprint 3: Native keyboard shortcuts via menu accelerators.

mod browser;

use browser::{
    browser_back, browser_can_go_back, browser_can_go_forward,
    browser_create, browser_destroy, browser_forward,
    browser_get_title, browser_get_url, browser_hide,
    browser_navigate, browser_reload, browser_show,
    browser_stop, browser_update_bounds,
};

use tauri::{
    menu::{Menu, MenuItem},
    Manager,
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
            browser_create,
            browser_navigate,
            browser_reload,
            browser_stop,
            browser_back,
            browser_forward,
            browser_get_title,
            browser_get_url,
            browser_can_go_back,
            browser_can_go_forward,
            browser_update_bounds,
            browser_show,
            browser_hide,
            browser_destroy,
        ])
        .setup(|app| {
            let version = app.package_info().version.to_string();
            println!("[Orbit] Starting version {version}");

            // Register native menu with keyboard accelerators.
            // The menu is hidden but accelerators remain active.
            // This ensures shortcuts work even when focus is
            // inside a child webview.

            let new_tab = MenuItem::with_id(
                app, "new_tab", "New Tab", true, Some("CmdOrCtrl+T"),
            ).map_err(|e| e.to_string())?;

            let close_tab = MenuItem::with_id(
                app, "close_tab", "Close Tab", true, Some("CmdOrCtrl+W"),
            ).map_err(|e| e.to_string())?;

            let focus_address = MenuItem::with_id(
                app, "focus_address", "Focus Address Bar", true, Some("CmdOrCtrl+L"),
            ).map_err(|e| e.to_string())?;

            let reload_page = MenuItem::with_id(
                app, "reload_page", "Reload", true, Some("CmdOrCtrl+R"),
            ).map_err(|e| e.to_string())?;

            let reload_f5 = MenuItem::with_id(
                app, "reload_f5", "Reload F5", true, Some("F5"),
            ).map_err(|e| e.to_string())?;

            let nav_back = MenuItem::with_id(
                app, "nav_back", "Back", true, Some("Alt+Left"),
            ).map_err(|e| e.to_string())?;

            let nav_forward = MenuItem::with_id(
                app, "nav_forward", "Forward", true, Some("Alt+Right"),
            ).map_err(|e| e.to_string())?;

            let menu = Menu::with_items(
                app,
                &[
                    &new_tab,
                    &close_tab,
                    &focus_address,
                    &reload_page,
                    &reload_f5,
                    &nav_back,
                    &nav_forward,
                ],
            ).map_err(|e| e.to_string())?;

            app.set_menu(menu).map_err(|e| e.to_string())?;

            // Hide the menu bar so it does not show visually
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_menu_visible(false);
            }

            // Listen for menu events and emit them as app events
            // so the React frontend can handle them.
            let handle = app.handle().clone();
            app.on_menu_event(move |_app, event| {
                let id = event.id().0.as_str();
                if let Some(window) = handle.get_webview_window("main") {
                    let _ = window.emit("orbit-shortcut", id);
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("[Orbit] Fatal: Failed to start.");
}