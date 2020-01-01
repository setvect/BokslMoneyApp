import userVo from './user-vo.js'

export default {
  init (callback) {
    userVo.sync().then(() => callback())
  },
  addUser (userItem) {
    userVo.create(userItem)
  }
}
