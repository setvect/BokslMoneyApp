import userVo from './user-vo.js'

export default {
  init (callback) {
    userVo.sync().then(() => callback())
  },
  addUser () {
    userVo.create({ userId: 'boksl', name: '복슬이', password: '1234', deleteF: false })
  }
}
