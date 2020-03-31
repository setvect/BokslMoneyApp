import memoVo from './memo-vo.js'

export default {
  init (callback) {
    memoVo.sync().then(() => callback())
  },
  addMemo () {
    memoVo.create({
      title: '복슬이',
      body: '12345 ddd',
      reg_date: new Date()
    })
  }
}
