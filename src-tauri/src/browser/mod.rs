//! browser/mod.rs
//! Orbit Browser Commands - Child WebView Implementation
//!
//! Uses Tauri v2.11.x Window::add_child API to embed
//! a WebView directly inside the main application window.
//!
//! Each tab gets a unique webview identifier.
//! The facade manages show/hide/destroy lifecycle.
//!
//! See ADR-0003 for architectural rationale.

use std::collections::HashMap;
use std::sync::Mutex;
use tauri::{LogicalPosition, LogicalSize, Manager, Runtime, WebviewBuilder, WebviewUrl};

/// Registry of active child webview identifiers.
/// Maps tab ID to webview label.
static WEBVIEW_REGISTRY: Mutex<Option<HashMap<String, String>>> = Mutex::new(None);

fn registry() -> std::sync::MutexGuard<'static, Option<HashMap<String, String>>> {
    let mut guard = WEBVIEW_REGISTRY.lock().unwrap();
    if guard.is_none() {
        *guard = Some(HashMap::new());
    }
    guard
}

/// Create a child webview for a tab and navigate to the given URL.
/// If a webview with this ID already exists, navigates to the new URL.
#[tauri::command]
pub async fn browser_create<R: Runtime>(
    app: tauri::AppHandle<R>,
    id: String,
    url: String,
    x: f64,
    y: f64,
    width: f64,
    height: f64,
) -> Result<(), String> {
    let parsed_url = url
        .parse::<tauri::Url>()
        .map_err(|e| format!("Invalid URL: {e}"))?;

    let window = app
        .get_webview_window("main")
        .ok_or_else(|| "Main window not found".to_string())?;

    // Check if webview already exists
    {
        let reg = registry();
        if let Some(map) = reg.as_ref() {
            if map.contains_key(&id) {
                drop(reg);
                return browser_navigate(app, id, url).await;
            }
        }
    }

    // Create child webview
    let label = format!("browser-{id}");
    let _webview = window
        .add_child(
            WebviewBuilder::new(&label, WebviewUrl::External(parsed_url))
                .auto_resize(),
            LogicalPosition::new(x, y),
            LogicalSize::new(width, height),
        )
        .map_err(|e| e.to_string())?;

    let mut reg = registry();
    if let Some(map) = reg.as_mut() {
        map.insert(id, label);
    }

    Ok(())
}

/// Navigate an existing child webview to a new URL.
#[tauri::command]
pub async fn browser_navigate<R: Runtime>(
    app: tauri::AppHandle<R>,
    id: String,
    url: String,
) -> Result<(), String> {
    let parsed_url = url
        .parse::<tauri::Url>()
        .map_err(|e| format!("Invalid URL: {e}"))?;

    let label = get_label(&id)?;

    app.get_webview(&label)
        .ok_or_else(|| format!("Webview {label} not found"))?
        .navigate(parsed_url)
        .map_err(|e| e.to_string())
}

/// Reload the current page.
#[tauri::command]
pub async fn browser_reload<R: Runtime>(
    app: tauri::AppHandle<R>,
    id: String,
) -> Result<(), String> {
    let label = get_label(&id)?;
    app.get_webview(&label)
        .ok_or_else(|| format!("Webview {label} not found"))?
        .eval("window.location.reload()")
        .map_err(|e| e.to_string())
}

/// Stop the current page load.
#[tauri::command]
pub async fn browser_stop<R: Runtime>(
    app: tauri::AppHandle<R>,
    id: String,
) -> Result<(), String> {
    let label = get_label(&id)?;
    app.get_webview(&label)
        .ok_or_else(|| format!("Webview {label} not found"))?
        .eval("window.stop()")
        .map_err(|e| e.to_string())
}

/// Navigate backward.
#[tauri::command]
pub async fn browser_back<R: Runtime>(
    app: tauri::AppHandle<R>,
    id: String,
) -> Result<(), String> {
    let label = get_label(&id)?;
    app.get_webview(&label)
        .ok_or_else(|| format!("Webview {label} not found"))?
        .eval("window.history.back()")
        .map_err(|e| e.to_string())
}

/// Navigate forward.
#[tauri::command]
pub async fn browser_forward<R: Runtime>(
    app: tauri::AppHandle<R>,
    id: String,
) -> Result<(), String> {
    let label = get_label(&id)?;
    app.get_webview(&label)
        .ok_or_else(|| format!("Webview {label} not found"))?
        .eval("window.history.forward()")
        .map_err(|e| e.to_string())
}

/// Get the current page title.
#[tauri::command]
pub async fn browser_get_title<R: Runtime>(
    app: tauri::AppHandle<R>,
    id: String,
) -> Result<String, String> {
    let label = get_label(&id)?;
    let webview = app
        .get_webview(&label)
        .ok_or_else(|| format!("Webview {label} not found"))?;
    webview.title().map_err(|e| e.to_string())
}

/// Get the current URL.
#[tauri::command]
pub async fn browser_get_url<R: Runtime>(
    app: tauri::AppHandle<R>,
    id: String,
) -> Result<String, String> {
    let label = get_label(&id)?;
    let webview = app
        .get_webview(&label)
        .ok_or_else(|| format!("Webview {label} not found"))?;
    webview.url().map(|u| u.to_string()).map_err(|e| e.to_string())
}

/// Check if back navigation is available.
#[tauri::command]
pub async fn browser_can_go_back<R: Runtime>(
    app: tauri::AppHandle<R>,
    id: String,
) -> Result<bool, String> {
    let label = get_label(&id)?;
    if app.get_webview(&label).is_some() {
        return Ok(true);
    }
    Ok(false)
}

/// Check if forward navigation is available.
#[tauri::command]
pub async fn browser_can_go_forward<R: Runtime>(
    _app: tauri::AppHandle<R>,
    _id: String,
) -> Result<bool, String> {
    Ok(false)
}

/// Update the position and size of a child webview.
#[tauri::command]
pub async fn browser_update_bounds<R: Runtime>(
    app: tauri::AppHandle<R>,
    id: String,
    x: f64,
    y: f64,
    width: f64,
    height: f64,
) -> Result<(), String> {
    let label = get_label(&id)?;
    let webview = app
        .get_webview(&label)
        .ok_or_else(|| format!("Webview {label} not found"))?;

    webview
        .set_position(LogicalPosition::new(x, y))
        .map_err(|e| e.to_string())?;

    webview
        .set_size(LogicalSize::new(width, height))
        .map_err(|e| e.to_string())?;

    Ok(())
}

/// Show a child webview.
#[tauri::command]
pub async fn browser_show<R: Runtime>(
    app: tauri::AppHandle<R>,
    id: String,
) -> Result<(), String> {
    let label = get_label(&id)?;
    app.get_webview(&label)
        .ok_or_else(|| format!("Webview {label} not found"))?
        .show()
        .map_err(|e| e.to_string())
}

/// Hide a child webview.
#[tauri::command]
pub async fn browser_hide<R: Runtime>(
    app: tauri::AppHandle<R>,
    id: String,
) -> Result<(), String> {
    let label = get_label(&id)?;
    app.get_webview(&label)
        .ok_or_else(|| format!("Webview {label} not found"))?
        .hide()
        .map_err(|e| e.to_string())
}

/// Destroy a child webview and remove it from the registry.
#[tauri::command]
pub async fn browser_destroy<R: Runtime>(
    app: tauri::AppHandle<R>,
    id: String,
) -> Result<(), String> {
    let label = {
        let mut reg = registry();
        reg.as_mut()
            .and_then(|m| m.remove(&id))
            .ok_or_else(|| format!("Webview {id} not registered"))?
    };

    app.get_webview(&label)
        .ok_or_else(|| format!("Webview {label} not found"))?
        .close()
        .map_err(|e| e.to_string())
}

/// Helper: get the webview label for a tab ID.
fn get_label(id: &str) -> Result<String, String> {
    let reg = registry();
    reg.as_ref()
        .and_then(|m| m.get(id))
        .cloned()
        .ok_or_else(|| format!("No webview registered for tab {id}"))
}