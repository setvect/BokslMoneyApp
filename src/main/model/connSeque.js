const { Sequelize } = require('sequelize')

const connSeque = new Sequelize({
  dialect: 'sqlite',
  storage: 'db/bokslmoney.db'
})

export default connSeque
