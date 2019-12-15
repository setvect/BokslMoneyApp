export default{
  makeDir (dir) {
    const fs = require('fs')
    !fs.existsSync(dir) && fs.mkdirSync(dir)
  }
}
