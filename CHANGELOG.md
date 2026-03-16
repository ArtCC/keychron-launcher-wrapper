# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project follows Semantic Versioning.

## [0.0.4] - 2026-03-16

### Added

- Added a GitHub Pages static landing under `docs/`.
- Added app icon support in the website as both visible logo and favicon (`docs/favicon.png`).

### Changed

- Updated landing page content to English.
- Switched landing page to a dark theme with a centered main container layout.
- Extended landing page copy to mention Linux, Windows, and macOS availability.
- Expanded README with GitHub Pages setup instructions and docs structure references.

## [0.0.3] - 2026-03-15

### Added

- Added release automation for macOS builds with changelog-based GitHub Release notes.
- Added signing and notarization preparation for release builds using Apple credentials from GitHub Actions secrets.
- Added macOS entitlements files for hardened runtime packaging.

### Changed

- Updated CI to use Node.js 22 LTS.
- Expanded and aligned README content for scope, platform support, release flow, and signing/notarization requirements.
- Improved app branding details (icon usage in dialogs and release documentation consistency).

## [0.0.2] - 2026-03-15

### Changed

- Updated runtime and packaging toolchain dependencies: Electron to 41.0.2 and electron-builder to 26.8.1.
- Restricted DevTools to development by default; packaged builds now keep DevTools disabled unless explicitly enabled.

## [0.0.1] - 2026-03-15

### Added

- Initial Electron macOS wrapper project.
- Single dedicated BrowserWindow loading the official Keychron Launcher.
- WebHID permission and device selection handling.
- Domain allowlisting and navigation hardening.
- Minimal preload and secure Electron defaults.
- Basic macOS packaging scripts with electron-builder.
- Project documentation and repository guidelines.
