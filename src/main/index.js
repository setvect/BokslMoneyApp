'use strict'

import { app, BrowserWindow } from 'electron'

import memoEvent from './module/memo/memo-event.js'
import menu from './menu.js'
import util from './util.js'
import userVo from './model/user-vo.js'

// 0. 디렉토리 생성
util.makeDir('./db')

// 1. 윈도우 메뉴 초기화
menu.init()

// 2. 각 모듈 초기화
userVo
  .sync()
  .then(() => {
    return userVo.findAll()
  })
  .then(users => {
    console.log('users.length:', users.length)
    if (users.length !== 0) {
      return null
    }
    console.log('add User')
    const hash = util.encodeBcrypt('1234')
    // 기본 사용자 등록
    return userVo.create({ userId: 'boksl', name: '복슬이', password: hash, deleteF: false, })
  })
  .catch(util.errorLog)

memoEvent.init()

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ? 'http://localhost:9080' : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 800,
    useContentSize: true,
    width: 1200,
  })

  const path = require('path')
  const os = require('os')
  const debugToolPath = path.join(os.homedir(), '/AppData/Local/Google/Chrome/User Data/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/5.3.3_0')
  console.log('debugToolPath: ', debugToolPath)
  BrowserWindow.addDevToolsExtension(debugToolPath)

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
