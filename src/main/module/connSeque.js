const { Sequelize } = require('sequelize')

const connSeque = new Sequelize({
  dialect: 'sqlite',
  storage: 'db/test.db'
})

export default connSeque
