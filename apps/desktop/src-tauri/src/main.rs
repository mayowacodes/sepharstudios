// Hide the console window on Windows release builds. Without this, launching
// the app pops a terminal behind the window.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

/// Desktop shell for the Sephar Studios SPA.
///
/// The window loads the SvelteKit static build (`BUILD_TARGET=static`) bundled
/// into the binary via `frontendDist` — the same artifact the Android APK
/// ships. All data comes from the deployed API over HTTPS; the origin is baked
/// into the bundle at build time from `PUBLIC_API_ORIGIN`.
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .run(tauri::generate_context!())
        .expect("error while running Sephar Studios");
}
