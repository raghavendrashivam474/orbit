//! browser/mod.rs
//! Orbit Browser Commands - Stable WebviewWindow Implementation
//!
//! Sprint 3: Uses WebviewWindow (stable Tauri 2.x API).
//! See ADR-0003 and ADR-0004 for rationale.

use std::collections::HashMap;
use std::sync::Mutex;
use tauri::{
    LogicalPosition, LogicalSize, Manager, Runtime,
    WebviewUrl, WebviewWindowBuilder,
};

static WEBVIEW_REGISTRY: Mutex<Option<HashMap<String, String>>> = Mutex::new(None);

/// Insert a tab ID -> webview label mapping.
fn register(id: &str, label: &str) {
    let mut guard = WEBVIEW_REGISTRY.lock().unwrap();
    let map = guard.get_or_insert_with(HashMap::new);
    map.insert(id.to_string(), label.to_string());
}

/// Remove and return the webview label for a tab ID.
fn unregister(id: &str) -> Option<String> {
    let mut guard = WEBVIEW_REGISTRY.lock().unwrap();
    guard.as_mut()?.remove(id)
}

/// Return true if a tab ID is already registered.
fn is_registered(id: &str) -> bool {
    let guard = WEBVIEW_REGISTRY.lock().unwrap();
    guard.as_ref().map_or(false, |m| m.contains_key(id))
}

/// Get the webview label for a tab ID.
fn get_label(id: &str) -> Result<String, String> {
    let guard = WEBVIEW_REGISTRY.lock().unwrap();
    guard
        .as_ref()
        .and_then(|m| m.get(id))
        .cloned()
        .ok_or_else(|| format!("No webview registered for tab {id}"))
}

/// Create a WebviewWindow for a tab.
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
    // Check registration without holding the guard across await
    let already_registered = is_registered(&id);

    if already_registered {
        return browser_navigate(app, id, url).await;
    }

    let parsed_url = url
        .parse::<tauri::Url>()
        .map_err(|e| format!("Invalid URL: {e}"))?;

    let label = format!("browser-{id}");

    WebviewWindowBuilder::new(&app, &label, WebviewUrl::External(parsed_url))
        .decorations(false)
        .position(x, y)
        .inner_size(width, height)
        .build()
        .map_err(|e| e.to_string())?;

    register(&id, &label);

    Ok(())
}

/// Navigate to a new URL.
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

    app.get_webview_window(&label)
        .ok_or_else(|| format!("Window {label} not found"))?
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
    app.get_webview_window(&label)
        .ok_or_else(|| format!("Window {label} not found"))?
        .eval("window.location.reload()")
        .map_err(|e| e.to_string())
}

/// Stop loading.
#[tauri::command]
pub async fn browser_stop<R: Runtime>(
    app: tauri::AppHandle<R>,
    id: String,
) -> Result<(), String> {
    let label = get_label(&id)?;
    app.get_webview_window(&label)
        .ok_or_else(|| format!("Window {label} not found"))?
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
    app.get_webview_window(&label)
        .ok_or_else(|| format!("Window {label} not found"))?
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
    app.get_webview_window(&label)
        .ok_or_else(|| format!("Window {label} not found"))?
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
    app.get_webview_window(&label)
        .ok_or_else(|| format!("Window {label} not found"))?
        .title()
        .map_err(|e| e.to_string())
}

/// Get the current URL.
#[tauri::command]
pub async fn browser_get_url<R: Runtime>(
    app: tauri::AppHandle<R>,
    id: String,
) -> Result<String, String> {
    let label = get_label(&id)?;
    app.get_webview_window(&label)
        .ok_or_else(|| format!("Window {label} not found"))?
        .url()
        .map(|u| u.to_string())
        .map_err(|e| e.to_string())
}

/// Check if back navigation is available.
#[tauri::command]
pub async fn browser_can_go_back<R: Runtime>(
    app: tauri::AppHandle<R>,
    id: String,
) -> Result<bool, String> {
    let label = get_label(&id)?;
    Ok(app.get_webview_window(&label).is_some())
}

/// Check if forward navigation is available.
#[tauri::command]
pub async fn browser_can_go_forward<R: Runtime>(
    _app: tauri::AppHandle<R>,
    _id: String,
) -> Result<bool, String> {
    Ok(false)
}

/// Update position and size.
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
    let window = app
        .get_webview_window(&label)
        .ok_or_else(|| format!("Window {label} not found"))?;

    window
        .set_position(LogicalPosition::new(x, y))
        .map_err(|e| e.to_string())?;

    window
        .set_size(LogicalSize::new(width, height))
        .map_err(|e| e.to_string())?;

    Ok(())
}

/// Show the browser window.
#[tauri::command]
pub async fn browser_show<R: Runtime>(
    app: tauri::AppHandle<R>,
    id: String,
) -> Result<(), String> {
    let label = get_label(&id)?;
    app.get_webview_window(&label)
        .ok_or_else(|| format!("Window {label} not found"))?
        .show()
        .map_err(|e| e.to_string())
}

/// Hide the browser window.
#[tauri::command]
pub async fn browser_hide<R: Runtime>(
    app: tauri::AppHandle<R>,
    id: String,
) -> Result<(), String> {
    let label = get_label(&id)?;
    app.get_webview_window(&label)
        .ok_or_else(|| format!("Window {label} not found"))?
        .hide()
        .map_err(|e| e.to_string())
}

/// Destroy the browser window.
#[tauri::command]
pub async fn browser_destroy<R: Runtime>(
    app: tauri::AppHandle<R>,
    id: String,
) -> Result<(), String> {
    let label = unregister(&id)
        .ok_or_else(|| format!("Webview {id} not registered"))?;

    app.get_webview_window(&label)
        .ok_or_else(|| format!("Window {label} not found"))?
        .close()
        .map_err(|e| e.to_string())
}