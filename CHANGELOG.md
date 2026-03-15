# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project follows Semantic Versioning.

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
