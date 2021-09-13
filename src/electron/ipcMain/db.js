import { ipcMain, dialog } from 'electron'
import {
  OPEN_DIRECTORY_SELECTOR,
  OPEN_FILE_SELECTOR,
  SELECTED_DIRECTORY,
  SELECTED_FILE
} from '../ipcEvents'

ipcMain.on(OPEN_DIRECTORY_SELECTOR, (event) => {
  dialog
    .showOpenDialog({ properties: ['openDirectory', 'createDirectory'] })
    .then((r) => {
      if (r.canceled == true) {
        event.reply(SELECTED_DIRECTORY, null)
      } else {
        event.reply(SELECTED_DIRECTORY, r.filePaths[0])
      }
    })
})

ipcMain.on(OPEN_FILE_SELECTOR, (event) => {
  dialog.showOpenDialog({ properties: ['openFile'] }).then((r) => {
    if (r.canceled == true) {
      event.reply(SELECTED_FILE, null)
    } else {
      event.reply(SELECTED_FILE, r.filePaths[0])
    }
  })
})
