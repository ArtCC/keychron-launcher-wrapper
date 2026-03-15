# Task

Build a minimal macOS desktop utility using Electron that loads the official Keychron Launcher website inside a dedicated app window, so I can configure my Keychron K3 Max without installing Google Chrome, Microsoft Edge, Opera, or any other general-purpose browser on my Mac.

# Core goal

I want a dedicated desktop wrapper app, not a browser.
The app must use Electron with embedded Chromium and load the official Keychron Launcher web app.
It must enable WebHID correctly so the official Launcher can talk to my keyboard.
Do not reimplement the keyboard protocol.
Do not recreate Keychron Launcher UI.
Do not build a generic browser.

# Product constraints

- Target platform: macOS
- Main device: Keychron K3 Max
- Primary connection mode: wired USB
- Use Electron as the runtime
- Chromium embedded in Electron is acceptable
- Installing Google Chrome or similar browsers on the system is not acceptable
- Do not use Docker, VMs, Firefox extensions, browser hacks, or remote browser approaches
- Do not depend on the user having Chrome installed
- Do not replace the official Keychron web app with a custom clone

# Functional requirements

1. On launch, open the official Keychron Launcher URL directly.
2. Support WebHID inside Electron so the site can request access to the keyboard.
3. The app should be a single-purpose utility for configuring the keyboard.
4. It should work with Keychron K3 Max over cable.
5. Keep the UX minimal and stable.
6. If useful, show a very small pre-launch hint like “Connect the keyboard by cable before continuing”.
7. Restrict navigation to only the domains strictly needed for Keychron Launcher.
8. Prevent the app from behaving like a normal browser:
   - no tabs
   - no address bar
   - no bookmarks
   - no arbitrary browsing UI

# Technical requirements

Implement a minimal but proper Electron project with:

- a single BrowserWindow
- secure defaults where possible
- explicit handling of HID permissions
- validation that `navigator.hid` is available in the loaded page context
- domain allowlisting / navigation hardening
- packaging-ready project structure for macOS

Use the simplest stack possible.
Prefer plain JavaScript unless TypeScript meaningfully improves the result without adding much complexity.

# Expected deliverables

1. A working proof of concept Electron project.
2. Source code for the app.
3. Package configuration and scripts.
4. Clear instructions to run it locally in development.
5. Brief instructions to verify that WebHID is working.
6. Basic macOS packaging setup or a clean starting point for packaging.
7. A short limitations section describing any real issues found.

# Implementation plan

Work in this order:

1. Create the smallest possible Electron PoC.
2. Open the official Keychron Launcher URL in a dedicated window.
3. Ensure WebHID is available and permission flow works.
4. Confirm the wrapper can request access to the keyboard.
5. Harden navigation and permissions.
6. Prepare the project for macOS packaging.
7. Document limitations honestly.

# Important non-goals

Do NOT:

- reimplement HID protocol logic for the keyboard
- build a custom key remapping UI
- reverse engineer Keychron Launcher unless absolutely required
- add sync, analytics, telemetry, accounts, or cloud features
- make the app cross-platform unless it falls out naturally with no cost
- overengineer architecture for a simple PoC

# Quality bar

- Keep the solution minimal
- Keep the code clean
- Avoid unnecessary dependencies
- Prefer correctness over visual polish
- Be explicit about assumptions
- If Electron or the official site imposes a limitation, document it clearly instead of inventing workarounds

# Output format

Provide:

1. Project structure
2. Full source files
3. Commands to install and run
4. Short explanation of how HID permission handling works in the app
5. Short explanation of how to test with a Keychron K3 Max
6. Known limitations / risks

# Notes

This app is intended to be a dedicated wrapper around the official Keychron Launcher, using Electron’s embedded Chromium runtime and WebHID support, specifically to avoid installing a general-purpose Chromium browser on macOS.
