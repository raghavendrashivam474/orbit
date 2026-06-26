//! lib.rs
//! Orbit Tauri Application Library
//! Sprint 5: Workspace Engine integrated.

mod browser;
mod database;
mod models;
mod repositories;
mod services;
mod workspace;

use browser::{
    browser_back, browser_can_go_back, browser_can_go_forward,
    browser_create, browser_destroy, browser_forward,
    browser_get_title, browser_get_url, browser_hide,
    browser_navigate, browser_reload, browser_show,
    browser_stop, browser_update_bounds,
};

use models::{bookmark::BookmarkEntry, history::HistoryEntry, session::FullSession};
use once_cell::sync::OnceCell;
use services::persistence::PersistenceService;
use repositories::session::TabToSave;
use workspace::{
    models::*,
    service::WorkspaceService,
};
use tauri::{
    menu::{Menu, MenuItem},
    Emitter, Manager,
};

static PERSISTENCE: OnceCell<PersistenceService> = OnceCell::new();
static WORKSPACE:   OnceCell<WorkspaceService>   = OnceCell::new();

fn persistence() -> &'static PersistenceService {
    PERSISTENCE.get().expect("[Orbit] PersistenceService not initialized")
}

fn workspace_svc() -> &'static WorkspaceService {
    WORKSPACE.get().expect("[Orbit] WorkspaceService not initialized")
}

// â”€â”€ Window Commands â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

// â”€â”€ History Commands â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

#[tauri::command]
async fn history_record(url: String, title: String) -> Result<(), String> {
    persistence().record_navigation(&url, &title).await
}

#[tauri::command]
async fn history_recent(limit: i64) -> Result<Vec<HistoryEntry>, String> {
    persistence().get_recent_history(limit).await
}

#[tauri::command]
async fn history_search(query: String) -> Result<Vec<HistoryEntry>, String> {
    persistence().search_history(&query).await
}

#[tauri::command]
async fn history_delete(id: String) -> Result<(), String> {
    persistence().delete_history_entry(&id).await
}

#[tauri::command]
async fn history_clear() -> Result<(), String> {
    persistence().clear_history().await
}

// â”€â”€ Bookmark Commands â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

#[tauri::command]
async fn bookmark_add(url: String, title: String) -> Result<BookmarkEntry, String> {
    persistence().add_bookmark(&url, &title).await
}

#[tauri::command]
async fn bookmark_all() -> Result<Vec<BookmarkEntry>, String> {
    persistence().get_all_bookmarks().await
}

#[tauri::command]
async fn bookmark_search(query: String) -> Result<Vec<BookmarkEntry>, String> {
    persistence().search_bookmarks(&query).await
}

#[tauri::command]
async fn bookmark_is_saved(url: String) -> Result<bool, String> {
    persistence().is_bookmarked(&url).await
}

#[tauri::command]
async fn bookmark_update_title(id: String, title: String) -> Result<(), String> {
    persistence().update_bookmark_title(&id, &title).await
}

#[tauri::command]
async fn bookmark_delete(id: String) -> Result<(), String> {
    persistence().delete_bookmark(&id).await
}

#[tauri::command]
async fn bookmark_delete_by_url(url: String) -> Result<(), String> {
    persistence().delete_bookmark_by_url(&url).await
}

// â”€â”€ Session Commands â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

#[tauri::command]
async fn session_save(active_tab: String, tabs: Vec<TabToSave>) -> Result<String, String> {
    persistence().save_session(&active_tab, tabs).await
}

#[tauri::command]
async fn session_load() -> Result<Option<FullSession>, String> {
    persistence().load_latest_session().await
}

// â”€â”€ Settings Commands â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

#[tauri::command]
async fn settings_get(key: String) -> Result<Option<String>, String> {
    persistence().get_setting(&key).await
}

#[tauri::command]
async fn settings_set(key: String, value: String) -> Result<(), String> {
    persistence().set_setting(&key, &value).await
}

#[tauri::command]
async fn settings_all() -> Result<Vec<(String, String)>, String> {
    persistence().get_all_settings().await
}

// â”€â”€ Workspace Commands â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

#[tauri::command]
async fn workspace_list() -> Result<Vec<WorkspaceEntry>, String> {
    workspace_svc().list().await
}

#[tauri::command]
async fn workspace_find(id: String) -> Result<Option<WorkspaceEntry>, String> {
    workspace_svc().find(&id).await
}

#[tauri::command]
async fn workspace_create(input: CreateWorkspaceInput) -> Result<WorkspaceEntry, String> {
    workspace_svc().create(input).await
}

#[tauri::command]
async fn workspace_update(input: UpdateWorkspaceInput) -> Result<WorkspaceEntry, String> {
    workspace_svc().update(input).await
}

#[tauri::command]
async fn workspace_delete(id: String) -> Result<(), String> {
    workspace_svc().delete(&id).await
}

#[tauri::command]
async fn workspace_activate(id: String) -> Result<(), String> {
    workspace_svc().activate(&id).await
}

#[tauri::command]
async fn workspace_save_tabs(input: SaveWorkspaceTabsInput) -> Result<(), String> {
    workspace_svc().save_tabs(input).await
}

#[tauri::command]
async fn workspace_load_tabs(workspace_id: String) -> Result<Vec<WorkspaceTabEntry>, String> {
    workspace_svc().load_tabs(&workspace_id).await
}

// â”€â”€ Application Entry â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
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
            history_record,
            history_recent,
            history_search,
            history_delete,
            history_clear,
            bookmark_add,
            bookmark_all,
            bookmark_search,
            bookmark_is_saved,
            bookmark_update_title,
            bookmark_delete,
            bookmark_delete_by_url,
            session_save,
            session_load,
            settings_get,
            settings_set,
            settings_all,
            workspace_list,
            workspace_find,
            workspace_create,
            workspace_update,
            workspace_delete,
            workspace_activate,
            workspace_save_tabs,
            workspace_load_tabs,
        ])
        .setup(|app| {
            let version = app.package_info().version.to_string();
            println!("[Orbit] Starting version {version}");

            let app_data_dir = app
                .path()
                .app_data_dir()
                .expect("[Orbit] Failed to get app data dir");

            let db_path = app_data_dir.join("orbit.db");
            let handle  = app.handle().clone();

            tauri::async_runtime::block_on(async move {
                let pool = database::initialize(db_path)
                    .await
                    .expect("[Orbit] Failed to initialize database");

                PERSISTENCE
                    .set(PersistenceService::new(pool.clone()))
                    .expect("[Orbit] Failed to set PersistenceService");

                let ws_service = WorkspaceService::new(pool);
                ws_service.ensure_default().await
                    .expect("[Orbit] Failed to ensure default workspace");

                WORKSPACE
                    .set(ws_service)
                    .expect("[Orbit] Failed to set WorkspaceService");

                println!("[Orbit] Persistence layer ready.");
                println!("[Orbit] Workspace engine ready.");

                if let Ok(settings) = PERSISTENCE.get().unwrap().get_all_settings().await {
                    if let Some(window) = handle.get_webview_window("main") {
                        let _ = window.emit("orbit-settings-loaded", settings);
                    }
                }
            });

            let new_tab = MenuItem::with_id(
                app, "new_tab", "New Tab", true, Some("CmdOrCtrl+T"),
            ).map_err(|e| e.to_string())?;

            let close_tab = MenuItem::with_id(
                app, "close_tab", "Close Tab", true, Some("CmdOrCtrl+W"),
            ).map_err(|e| e.to_string())?;

            let focus_address = MenuItem::with_id(
                app, "focus_address", "Focus Address", true, Some("CmdOrCtrl+L"),
            ).map_err(|e| e.to_string())?;

            let reload_page = MenuItem::with_id(
                app, "reload_page", "Reload", true, Some("CmdOrCtrl+R"),
            ).map_err(|e| e.to_string())?;

            let command_palette = MenuItem::with_id(
                app, "command_palette", "Command Palette", true, Some("CmdOrCtrl+K"),
            ).map_err(|e| e.to_string())?;

            let menu = Menu::with_items(app, &[
                &new_tab,
                &close_tab,
                &focus_address,
                &reload_page,
                &command_palette,
            ]).map_err(|e| e.to_string())?;

            app.set_menu(menu).map_err(|e| e.to_string())?;

            let handle2 = app.handle().clone();
            app.on_menu_event(move |_app, event| {
                let id = event.id().0.as_str().to_string();
                if let Some(window) = handle2.get_webview_window("main") {
                    let _ = window.emit("orbit-shortcut", id);
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("[Orbit] Fatal: Failed to start.");
}