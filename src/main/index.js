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
  console.log('boksl :', boksl)
})

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
    height: 563,
    useContentSize: true,
    width: 1000
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

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
