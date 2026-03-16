# Installation and Usage

This document explains how to use Keychron Launcher Wrapper on macOS, Windows, and Linux.

## Supported Platforms

- Linux (local runtime support, including Debian and derivatives)
- macOS (primary target and distribution platform)
- Windows (local runtime support)

WebHID behavior may vary by OS/runtime support.

## Prerequisites

- Node.js 22+ (recommended)
- npm
- A Keychron keyboard connected by USB cable

## Install Dependencies

```bash
npm install
```

## Run in Development

```bash
npm start
```

At launch, the app shows a small reminder dialog to connect the keyboard by cable.

## Debug Logging

To troubleshoot HID permission flow and renderer messages, run:

```bash
KEYCHRON_DEBUG=1 ELECTRON_ENABLE_LOGGING=1 ELECTRON_ENABLE_STACK_DUMPING=1 npm start
```

This enables app-level debug logs from the Electron main process plus Chromium/Electron runtime logs.

## macOS Packaging (Starter)

Build scripts are configured with `electron-builder`:

```bash
npm run pack:mac
npm run dist:mac
```

- `pack:mac`: builds an unpacked macOS app directory.
- `dist:mac`: builds distributables (DMG and ZIP).

## macOS Releases

- Official releases: https://github.com/ArtCC/keychron-launcher-wrapper/releases
- Published release artifacts are signed and notarized by Apple when the required signing secrets are configured.

### Windows (PowerShell)

```powershell
$env:KEYCHRON_DEBUG="1"
$env:ELECTRON_ENABLE_LOGGING="1"
$env:ELECTRON_ENABLE_STACK_DUMPING="1"
npm start
```

### Windows (Command Prompt)

```bat
set KEYCHRON_DEBUG=1
set ELECTRON_ENABLE_LOGGING=1
set ELECTRON_ENABLE_STACK_DUMPING=1
npm start
```

## DevTools Behavior

- In development (`npm start`), DevTools is enabled by default.
- In packaged builds, DevTools is disabled by default.
- To force-enable DevTools in a packaged build for diagnostics, set `KEYCHRON_DEVTOOLS=1` before launch.

## Verify WebHID with Keychron Keyboards

1. Connect the keyboard in wired mode (USB cable).
2. Run the app: `npm start`.
3. Confirm the launcher page loads.
4. In the launcher UI, trigger device connection.
5. Confirm a HID chooser appears and select the Keychron device.
6. Confirm the launcher can read/configure the keyboard.

If `navigator.hid` is unavailable, the app displays a warning dialog after page load.

## Notes for Windows and Linux Packages

Native Windows (`.exe`) and Linux (`.deb` and other formats) packaging are tracked as pending tasks in the project TODO list.
