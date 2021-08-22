'use strict'

import {
  app,
  protocol,
  BrowserWindow,
  globalShortcut,
  dialog,
  ipcMain
} from 'electron'
import './electron/ipcMain/frappeAuth'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })
  win.once('ready-to-show', () => {
    win.show()
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  } else {
    // When the user presses Ctrl + Shift + I/ Command + Option + I, this function will get called
    // You can modify this function to do other things, but if you just want
    // to disable the shortcut, you can just return false
    globalShortcut.register('Control+Shift+I', () => {
      return false
    })
    globalShortcut.register('Command+Option+I', () => {
      return false
    })
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

ipcMain.on('openDirectorySelector', (event) => {
  dialog
    .showOpenDialog({ properties: ['openDirectory', 'createDirectory'] })
    .then((r) => {
      if (r.canceled == true) {
        event.reply('selectedDirectory', null)
      } else {
        event.reply('selectedDirectory', r.filePaths[0])
      }
    })
})

ipcMain.on('openFileSelector', (event) => {
  dialog.showOpenDialog({ properties: ['openFile'] }).then((r) => {
    if (r.canceled == true) {
      event.reply('selectedFile', null)
    } else {
      event.reply('selectedFile', r.filePaths[0])
    }
  })
})
