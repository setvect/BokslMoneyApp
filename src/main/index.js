'use strict'

import {
  app,
  BrowserWindow
} from 'electron'

const {
  Sequelize,
  DataTypes
} = require('sequelize')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'db/test.db'
})

let Memo = sequelize.define('Memo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  reg_date: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  classMethods: {},
  tableName: 'Memo',
  freezeTableName: true,
  underscored: true,
  timestamps: false
})

Memo.sync().then(() => Memo.create({
  title: '복슬이',
  body: 'Sequelize.js is ORM for Node.js.',
  reg_date: new Date()
})).then(boksl => {
  // console.log('boksl :', boksl)
})

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file://${__dirname}/index.html`

const { ipcMain } = require('electron')

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
