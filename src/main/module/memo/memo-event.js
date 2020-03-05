import { ipcMain } from 'electron'
import userVo from '../../model/user-vo.js'
import util from '../../util.js'

export default {
  init() {
    ipcMain.on('asynchronous-message', (event, passwd) => {
      // eslint-disable-next-line no-debugger
      console.log('passwd :', passwd)
      console.log('userVo :', userVo)
      userVo.findByPk("boksl").then(row=>{
        const result = util.compareBcrypt(passwd, row.password)
        event.sender.send('asynchronous-reply', result)
      })
    })
  },
}
