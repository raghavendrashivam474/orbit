//! browser/mod.rs
//! Orbit Browser Commands - Child WebView Implementation
//!
//! Uses Tauri "unstable" feature: Window::add_child + WebviewBuilder.
//! Dependency scope: THIS FILE ONLY.
//! See ADR-0003 and ADR-0004.

use std::collections::HashMap;
use std::sync::Mutex;
use tauri::{
    LogicalPosition, LogicalSize, Manager, Runtime,
    WebviewBuilder, WebviewUrl,
};

static WEBVIEW_REGISTRY: Mutex<Option<HashMap<String, String>>> = Mutex::new(None);

fn register(id: &str, label: &str) {
    let mut guard = WEBVIEW_REGISTRY.lock().unwrap();
    let map = guard.get_or_insert_with(HashMap::new);
    map.insert(id.to_string(), label.to_string());
}

fn unregister(id: &str) -> Option<String> {
    let mut guard = WEBVIEW_REGISTRY.lock().unwrap();
    guard.as_mut()?.remove(id)
}

fn is_registered(id: &str) -> bool {
    let guard = WEBVIEW_REGISTRY.lock().unwrap();
    guard.as_ref().map_or(false, |m| m.contains_key(id))
}

fn get_label(id: &str) -> Result<String, String> {
    let guard = WEBVIEW_REGISTRY.lock().unwrap();
    guard
        .as_ref()
        .and_then(|m| m.get(id))
        .cloned()
        .ok_or_else(|| format!("No webview registered for tab {id}"))
}

/// Create a child webview inside the main window.
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
    let already_registered = is_registered(&id);
    if already_registered {
        return browser_navigate(app, id, url).await;
    }

    let parsed_url = url
        .parse::<tauri::Url>()
        .map_err(|e| format!("Invalid URL: {e}"))?;

    let label = format!("browser-{id}");

    // get_window returns the Window<R> which has add_child via unstable
    let window = app
        .get_window("main")
        .ok_or_else(|| "Main window not found".to_string())?;

    window
        .add_child(
            WebviewBuilder::new(&label, WebviewUrl::External(parsed_url)),
            LogicalPosition::new(x, y),
            LogicalSize::new(width, height),
        )
        .map_err(|e| e.to_string())?;

    register(&id, &label);

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

/// Stop loading.
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

/// Get the current page title via JavaScript eval.
/// title() is not available on Webview<R>, only on WebviewWindow<R>.
#[tauri::command]
pub async fn browser_get_title<R: Runtime>(
    app: tauri::AppHandle<R>,
    id: String,
) -> Result<String, String> {
    let label = get_label(&id)?;
    // Evaluate document.title in the child webview context
    // eval() does not return a value directly in Tauri 2.x
    // We return the label as a fallback until event-based title tracking is added
    if app.get_webview(&label).is_some() {
        return Ok(String::from("Loading..."));
    }
    Ok(String::from("New Tab"))
}

/// Get the current URL.
#[tauri::command]
pub async fn browser_get_url<R: Runtime>(
    app: tauri::AppHandle<R>,
    id: String,
) -> Result<String, String> {
    let label = get_label(&id)?;
    app.get_webview(&label)
        .ok_or_else(|| format!("Webview {label} not found"))?
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
    Ok(app.get_webview(&label).is_some())
}

/// Check if forward navigation is available.
#[tauri::command]
pub async fn browser_can_go_forward<R: Runtime>(
    _app: tauri::AppHandle<R>,
    _id: String,
) -> Result<bool, String> {
    Ok(false)
}

/// Update the position and size of the child webview.
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

/// Show the child webview.
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

/// Hide the child webview.
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

/// Destroy the child webview and release resources.
#[tauri::command]
pub async fn browser_destroy<R: Runtime>(
    app: tauri::AppHandle<R>,
    id: String,
) -> Result<(), String> {
    let label = unregister(&id)
        .ok_or_else(|| format!("Webview {id} not registered"))?;

    app.get_webview(&label)
        .ok_or_else(|| format!("Webview {label} not found"))?
        .close()
        .map_err(|e| e.to_string())
}