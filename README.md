<p align="center">
	<img src="assets/keychron-launcher-wrapper.png" alt="Keychron Launcher Wrapper icon" width="115" />
</p>

# Keychron Launcher Wrapper (macOS)

Minimal Electron desktop utility that opens the official Keychron Launcher in a dedicated app window, with WebHID support for configuring a Keychron K3 Max over wired USB.

## Scope

- Dedicated wrapper app, not a general-purpose browser
- Loads the official Keychron Launcher site
- Uses Electron's embedded Chromium runtime
- Targets macOS first

## Features

- Single `BrowserWindow` with no tabs, address bar, or bookmarks
- Loads `https://launcher.keychron.com` on startup
- WebHID permission handling through Electron session handlers
- `navigator.hid` runtime validation in the loaded page context
- Domain allowlisting and navigation hardening
- Optional pre-launch hint: connect keyboard by cable before continuing

## Project Structure

```text
.
├── .github/
│   └── copilot-instructions.md
├── src/
│   ├── main.js
│   └── preload.js
├── AGENTS.md
├── LICENSE
├── README.md
└── package.json
```

## Requirements

- macOS
- Node.js 20+ (recommended)
- Keychron K3 Max connected by USB cable

## Install

```bash
npm install
```

## Run in Development

```bash
npm start
```

At launch, the app shows a small reminder dialog to connect the keyboard by cable.

### Debug Logging

To troubleshoot HID permission flow and renderer messages, run:

```bash
KEYCHRON_DEBUG=1 ELECTRON_ENABLE_LOGGING=1 ELECTRON_ENABLE_STACK_DUMPING=1 npm start
```

This enables app-level debug logs from the Electron main process plus Chromium/Electron runtime logs.

## WebHID Permission Handling

The app uses Electron session APIs to keep HID access explicit and scoped:

- `setPermissionCheckHandler`: allows only `hid` and only from allowlisted origins.
- `setPermissionRequestHandler`: denies non-HID requests and non-allowlisted origins.
- `setDevicePermissionHandler`: allows HID device permissions only for allowlisted origins.
- `select-hid-device`: blocks HID selection requests from non-allowlisted frames.

This keeps permissions narrow while preserving Chromium's native device selection flow for allowed pages.

## Navigation Hardening

- Only HTTPS URLs are allowed.
- Only allowlisted hostnames can load in the app.
- `will-navigate` blocks non-allowlisted navigation.
- `setWindowOpenHandler` denies all popup windows.
- Allowed popup URLs are redirected into the single main window.
- Webviews are disabled with `will-attach-webview` prevention.

### Allowlist Override (if needed)

If the official launcher starts depending on additional hostnames, you can extend the allowlist without code changes:

```bash
KEYCHRON_ALLOWED_HOSTS="example-cdn.com,assets.example.com" npm start
```

Use this only for hostnames that are strictly required by the official Keychron Launcher.

## Verify WebHID with Keychron K3 Max

1. Connect the keyboard in wired mode (USB cable).
2. Run the app: `npm start`.
3. Confirm the launcher page loads.
4. In the launcher UI, trigger device connection.
5. Confirm a HID chooser appears and select the Keychron device.
6. Confirm the launcher can read/configure the keyboard.

If `navigator.hid` is unavailable, the app displays a warning dialog after page load.

## macOS Packaging (Starter)

Build scripts are configured with `electron-builder`:

```bash
npm run pack:mac
npm run dist:mac
```

- `pack:mac`: builds an unpacked macOS app directory.
- `dist:mac`: builds distributables (DMG and ZIP).

## Limitations and Risks

- This wrapper depends on compatibility between the official Keychron Launcher site and the Chromium version bundled with the selected Electron version.
- macOS distribution outside local development usually requires code signing and notarization, which are not configured in this minimal starter.
- If the official launcher adds new third-party domains, the allowlist may need updates (or temporary extension via `KEYCHRON_ALLOWED_HOSTS`).
- HID access still depends on OS-level device behavior, cable quality, and keyboard mode/state.

## License

This project is licensed under the [Apache License 2.0](LICENSE).

## Author

Arturo Carretero Calvo  
GitHub: [ArtCC](https://github.com/ArtCC)