const SALT = 10
export default{
  makeDir (dir) {
    const fs = require('fs')
    !fs.existsSync(dir) && fs.mkdirSync(dir)
  },
  encodeBcrypt (value) {
    let bcrypt = require('bcryptjs')
    let salt = bcrypt.genSaltSync(SALT)
    let hash = bcrypt.hashSync(value, salt)
    return hash
  },
  compareBcrypt (value, hash) {
    let bcrypt = require('bcryptjs')
    let result = bcrypt.compareSync(value, hash)
    return result
  },
  // promise 에러 처리. 공통
  errorLog (err) {
    console.error('err :', err)
  }
}
