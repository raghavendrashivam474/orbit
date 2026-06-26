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
    println!("[BROWSER] browser_create id={} url={}", &id[..8.min(id.len())], url);

    let already_registered = is_registered(&id);
    if already_registered {
        return browser_navigate(app, id, url).await;
    }

    let parsed_url = url
        .parse::<tauri::Url>()
        .map_err(|e| format!("Invalid URL: {e}"))?;

    let label = format!("browser-{id}");

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

#[tauri::command]
pub async fn browser_navigate<R: Runtime>(
    app: tauri::AppHandle<R>,
    id: String,
    url: String,
) -> Result<(), String> {
    println!("[BROWSER] browser_navigate id={} url={}", &id[..8.min(id.len())], url);

    let parsed_url = url
        .parse::<tauri::Url>()
        .map_err(|e| format!("Invalid URL: {e}"))?;

    let label = get_label(&id)?;

    app.get_webview(&label)
        .ok_or_else(|| format!("Webview {label} not found"))?
        .navigate(parsed_url)
        .map_err(|e| e.to_string())
}

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

#[tauri::command]
pub async fn browser_get_title<R: Runtime>(
    app: tauri::AppHandle<R>,
    id: String,
) -> Result<String, String> {
    let label = get_label(&id)?;
    if app.get_webview(&label).is_some() {
        return Ok(String::from("Loading..."));
    }
    Ok(String::from("New Tab"))
}

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

#[tauri::command]
pub async fn browser_can_go_back<R: Runtime>(
    app: tauri::AppHandle<R>,
    id: String,
) -> Result<bool, String> {
    let label = get_label(&id)?;
    Ok(app.get_webview(&label).is_some())
}

#[tauri::command]
pub async fn browser_can_go_forward<R: Runtime>(
    _app: tauri::AppHandle<R>,
    _id: String,
) -> Result<bool, String> {
    Ok(false)
}

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

#[tauri::command]
pub async fn browser_show<R: Runtime>(
    app: tauri::AppHandle<R>,
    id: String,
) -> Result<(), String> {
    println!("[BROWSER] browser_show id={}", &id[..8.min(id.len())]);

    let label = get_label(&id)?;
    app.get_webview(&label)
        .ok_or_else(|| format!("Webview {label} not found"))?
        .show()
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn browser_hide<R: Runtime>(
    app: tauri::AppHandle<R>,
    id: String,
) -> Result<(), String> {
    println!("[BROWSER] browser_hide id={}", &id[..8.min(id.len())]);

    let label = match get_label(&id) {
        Ok(l) => l,
        Err(e) => {
            println!("[BROWSER] browser_hide - NO LABEL for id={} err={}", &id[..8.min(id.len())], e);
            return Err(e);
        }
    };

    match app.get_webview(&label) {
        Some(wv) => {
            wv.hide().map_err(|e| e.to_string())?;
            println!("[BROWSER] browser_hide SUCCESS for {}", &id[..8.min(id.len())]);
            Ok(())
        }
        None => {
            println!("[BROWSER] browser_hide - NO WEBVIEW found for label {}", label);
            Err(format!("Webview {label} not found"))
        }
    }
}

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