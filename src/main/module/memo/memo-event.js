import { ipcMain } from 'electron'

export default {
  init () {
    ipcMain.on('asynchronous-message', (event, arg) => {
      // eslint-disable-next-line no-debugger
      debugger
      console.log('arg :', arg)
      event.sender.send('asynchronous-reply', 'pong asynchronous')
    })

    ipcMain.on('synchronous-message', (event, arg) => {
      // eslint-disable-next-line no-debugger
      debugger
      console.log('@@@@@', arg) // "ping" 출력
      event.returnValue = 'pong synchronous'
    })
  },
}
