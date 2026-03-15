## Scope
This repository is a minimal Electron macOS utility that wraps the official Keychron Launcher website for Keychron K3 Max configuration.

## Priorities
1. Working WebHID support
2. Minimal code
3. Stable dedicated app behavior
4. Reasonable security hardening
5. Clear docs

## Rules
- Do not reimplement keyboard HID protocol
- Do not clone Keychron Launcher UI
- Do not add unrelated product features
- Do not introduce heavy dependencies without strong justification
- Keep code easy to read
- Prefer small files and straightforward structure
- Document limitations honestly

## UX
- Single window
- No browser chrome
- Focus on loading official Keychron Launcher reliably

## Platform
- macOS first
- Wired USB for the initial version
