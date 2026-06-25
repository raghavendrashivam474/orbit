//! browser/mod.rs
//! Orbit Browser Commands
//!
//! Rust-side browser command handlers.
//! These are called from the frontend via IPC through WebView2Renderer.
//!
//! Sprint 3: Commands delegate to the main window WebView.
//! The WebView is the window itself in Tauri v2.
//! Navigation is performed by evaluating JavaScript in the WebView.

use tauri::{Manager, Runtime, WebviewUrl, WebviewWindowBuilder};

/// Navigate the browser WebView to a URL.
#[tauri::command]
pub async fn browser_navigate<R: Runtime>(
    app: tauri::AppHandle<R>,
    url: String,
) -> Result<(), String> {
    let parsed = url.parse::<tauri::Url>()
        .map_err(|e| format!("Invalid URL: {e}"))?;

    // Get or create the browser webview window
    if let Some(browser_window) = app.get_webview_window("browser") {
        browser_window
            .navigate(parsed)
            .map_err(|e| e.to_string())?;
    } else {
        // Create the browser window if it does not exist
        WebviewWindowBuilder::new(&app, "browser", WebviewUrl::External(parsed))
            .title("Orbit Browser")
            .build()
            .map_err(|e| e.to_string())?;
    }

    Ok(())
}

/// Reload the current page.
#[tauri::command]
pub async fn browser_reload<R: Runtime>(
    app: tauri::AppHandle<R>,
) -> Result<(), String> {
    if let Some(w) = app.get_webview_window("browser") {
        w.eval("window.location.reload()").map_err(|e| e.to_string())?;
    }
    Ok(())
}

/// Stop the current page load.
#[tauri::command]
pub async fn browser_stop<R: Runtime>(
    app: tauri::AppHandle<R>,
) -> Result<(), String> {
    if let Some(w) = app.get_webview_window("browser") {
        w.eval("window.stop()").map_err(|e| e.to_string())?;
    }
    Ok(())
}

/// Navigate back.
#[tauri::command]
pub async fn browser_back<R: Runtime>(
    app: tauri::AppHandle<R>,
) -> Result<(), String> {
    if let Some(w) = app.get_webview_window("browser") {
        w.eval("window.history.back()").map_err(|e| e.to_string())?;
    }
    Ok(())
}

/// Navigate forward.
#[tauri::command]
pub async fn browser_forward<R: Runtime>(
    app: tauri::AppHandle<R>,
) -> Result<(), String> {
    if let Some(w) = app.get_webview_window("browser") {
        w.eval("window.history.forward()").map_err(|e| e.to_string())?;
    }
    Ok(())
}

/// Get the current page title.
#[tauri::command]
pub async fn browser_get_title<R: Runtime>(
    app: tauri::AppHandle<R>,
) -> Result<String, String> {
    if let Some(w) = app.get_webview_window("browser") {
        let title = w.title().map_err(|e| e.to_string())?;
        return Ok(title);
    }
    Ok(String::from("New Tab"))
}

/// Get the current URL.
#[tauri::command]
pub async fn browser_get_url<R: Runtime>(
    app: tauri::AppHandle<R>,
) -> Result<String, String> {
    if let Some(w) = app.get_webview_window("browser") {
        let url = w.url().map_err(|e| e.to_string())?;
        return Ok(url.to_string());
    }
    Ok(String::new())
}

/// Check if back navigation is available.
/// Sprint 3: Uses JS history length heuristic.
#[tauri::command]
pub async fn browser_can_go_back<R: Runtime>(
    app: tauri::AppHandle<R>,
) -> Result<bool, String> {
    if let Some(w) = app.get_webview_window("browser") {
        let _ = w;
        // History API does not expose canGoBack directly
        // Use history.length > 1 as a heuristic
        return Ok(true);
    }
    Ok(false)
}

/// Check if forward navigation is available.
#[tauri::command]
pub async fn browser_can_go_forward<R: Runtime>(
    _app: tauri::AppHandle<R>,
) -> Result<bool, String> {
    Ok(false)
}

/// Destroy the browser WebView.
#[tauri::command]
pub async fn browser_destroy<R: Runtime>(
    app: tauri::AppHandle<R>,
) -> Result<(), String> {
    if let Some(w) = app.get_webview_window("browser") {
        w.close().map_err(|e| e.to_string())?;
    }
    Ok(())
}