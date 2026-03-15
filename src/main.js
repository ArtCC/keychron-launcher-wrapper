"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { app, BrowserWindow, dialog, nativeImage, session } = require("electron");

const KEYCHRON_LAUNCHER_URL = "https://launcher.keychron.com";
const DEBUG_LOGS = process.env.KEYCHRON_DEBUG === "1";
const APP_ICON_PATH = path.join(__dirname, "..", "assets", "keychron-launcher-wrapper.png");

// Add only domains that are required by the official launcher.
const ALLOWED_HOST_PATTERNS = [
  "launcher.keychron.com",
  "keychron.com",
  "www.keychron.com",
  "*.keychron.com"
];

const EXTRA_ALLOWED_HOSTS = (process.env.KEYCHRON_ALLOWED_HOSTS || "")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

let mainWindow = null;

function logDebug(message, meta) {
  if (!DEBUG_LOGS) {
    return;
  }

  if (meta === undefined) {
    console.log(`[keychron-wrapper] ${message}`);
    return;
  }

  console.log(`[keychron-wrapper] ${message}`, meta);
}

function matchesHostPattern(hostname, pattern) {
  if (pattern.startsWith("*.")) {
    const bare = pattern.slice(2);
    return hostname === bare || hostname.endsWith(`.${bare}`);
  }

  return hostname === pattern;
}

function isAllowedUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "https:") {
      return false;
    }

    return [...ALLOWED_HOST_PATTERNS, ...EXTRA_ALLOWED_HOSTS].some((pattern) =>
      matchesHostPattern(url.hostname, pattern)
    );
  } catch {
    return false;
  }
}

function configureHidAndPermissions() {
  const appSession = session.defaultSession;

  appSession.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
    logDebug("permission-check", {
      permission,
      requestingOrigin,
      securityOrigin: details && details.securityOrigin
    });

    if (permission !== "hid") {
      return false;
    }

    if (!isAllowedUrl(requestingOrigin)) {
      return false;
    }

    if (details && details.securityOrigin && !isAllowedUrl(details.securityOrigin)) {
      return false;
    }

    return true;
  });

  appSession.setPermissionRequestHandler((webContents, permission, callback, details) => {
    logDebug("permission-request", {
      permission,
      requestingUrl: details && details.requestingUrl
    });

    if (permission !== "hid") {
      callback(false);
      return;
    }

    const allowed = isAllowedUrl(details.requestingUrl);
    callback(allowed);
  });

  appSession.setDevicePermissionHandler((details) => {
    logDebug("device-permission", {
      deviceType: details && details.deviceType,
      origin: details && details.origin,
      deviceName: details && details.device && details.device.name,
      vendorId: details && details.device && details.device.vendorId,
      productId: details && details.device && details.device.productId
    });

    if (details.deviceType !== "hid") {
      return false;
    }

    if (!details.origin || !isAllowedUrl(details.origin)) {
      return false;
    }

    return true;
  });

  appSession.on("select-hid-device", (event, details, callback) => {
    const deviceList = (details && details.deviceList) || [];

    logDebug("select-hid-device", {
      frameUrl: details && details.frame && details.frame.url,
      devices: deviceList.length,
      deviceList:
        (deviceList.length
          ? deviceList.map((d) => ({
            name: d.name,
            productId: d.productId,
            vendorId: d.vendorId,
            deviceId: d.deviceId
          }))
          : [])
    });

    if (!details.frame || !isAllowedUrl(details.frame.url)) {
      event.preventDefault();
      callback("");
      return;
    }

    // In some Electron builds, requestDevice may resolve [] unless the app
    // explicitly returns the only candidate device from this event.
    if (deviceList.length === 1) {
      event.preventDefault();
      callback(deviceList[0].deviceId);
    }
  });
}

function hardenNavigation(win) {
  win.webContents.on("will-navigate", (event, url) => {
    if (!isAllowedUrl(url)) {
      logDebug("blocked-navigation", { url });
      event.preventDefault();
    }
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    logDebug("window-open", { url, allowed: isAllowedUrl(url) });

    if (isAllowedUrl(url)) {
      win.loadURL(url);
    }

    return { action: "deny" };
  });

}

app.on("web-contents-created", (_event, contents) => {
  contents.on("will-attach-webview", (attachEvent) => {
    // No embedded webviews allowed in this dedicated wrapper.
    attachEvent.preventDefault();
  });
});

async function maybeShowConnectionHint() {
  const result = await dialog.showMessageBox({
    type: "info",
    title: "Keychron Launcher Wrapper",
    message: "Connect your keyboard by cable before continuing.",
    buttons: ["Continue", "Quit"],
    defaultId: 0,
    cancelId: 1,
    noLink: true
  });

  if (result.response === 1) {
    app.quit();
    return false;
  }

  return true;
}

async function validateHidAvailability(win) {
  try {
    const hasHid = await win.webContents.executeJavaScript("typeof navigator.hid !== 'undefined'", true);
    if (!hasHid) {
      await dialog.showMessageBox(win, {
        type: "warning",
        title: "WebHID Not Available",
        message: "navigator.hid is not available in this session.",
        detail: "Try updating Electron or check macOS security permissions for USB/HID access."
      });
    }
  } catch (error) {
    await dialog.showMessageBox(win, {
      type: "error",
      title: "Validation Error",
      message: "Failed to validate WebHID availability.",
      detail: String(error)
    });
  }
}

function createMainWindow() {
  const windowOptions = {
    width: 1280,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: "#111111",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      devTools: true
    }
  };

  if (fs.existsSync(APP_ICON_PATH)) {
    windowOptions.icon = APP_ICON_PATH;
  }

  mainWindow = new BrowserWindow(windowOptions);

  hardenNavigation(mainWindow);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.webContents.on("did-finish-load", () => {
    logDebug("did-finish-load", { url: mainWindow.webContents.getURL() });
    validateHidAvailability(mainWindow);
  });

  mainWindow.webContents.on("console-message", (_event, level, message, line, sourceId) => {
    logDebug("renderer-console", { level, message, line, sourceId });
  });

  mainWindow.loadURL(KEYCHRON_LAUNCHER_URL);
}

app.whenReady().then(async () => {
  if (process.platform === "darwin" && fs.existsSync(APP_ICON_PATH)) {
    const dockIcon = nativeImage.createFromPath(APP_ICON_PATH);
    if (!dockIcon.isEmpty()) {
      app.dock.setIcon(dockIcon);
    }
  }

  configureHidAndPermissions();

  const shouldContinue = await maybeShowConnectionHint();
  if (!shouldContinue) {
    return;
  }

  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
