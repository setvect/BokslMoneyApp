'use strict'

import {
  app,
  BrowserWindow
} from 'electron'

import memo from './orm/memo-vo.js'
import menu from './menu.js'

memo.init(() => {
  memo.addMemo()
})

menu.init()

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file://${__dirname}/index.html`

const {
  ipcMain
} = require('electron')

ipcMain.on('asynchronous-message', (event, arg) => {
  console.log('arg :', arg)
  event.sender.send('asynchronous-reply', 'pong asynchronous')
})

ipcMain.on('synchronous-message', (event, arg) => {
  console.log('@@@@@', arg) // "ping" 출력
  event.returnValue = 'pong synchronous'
})

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 800,
    useContentSize: true,
    width: 1200
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
