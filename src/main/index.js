'use strict'

import {
  app,
  BrowserWindow
} from 'electron'

import memoRepository from './module/memo/memo-repository.js'
import memoEvent from './module/memo/memo-event.js'
import menu from './menu.js'
import util from './util.js'

// 0. 디렉토리 생성
util.makeDir('./db')

// 1. 윈도우 메뉴 초기화
menu.init()

// 2. 각 모듈 초기화
memoRepository.init(() => {
  memoRepository.addMemo()
})
memoEvent.init()

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file://${__dirname}/index.html`

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
