export default {
  Memo: null,
  init () {
    const {
      Sequelize,
      DataTypes
    } = require('sequelize')
    const sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: 'db/test.db'
    })

    this.Memo = sequelize.define('Memo', {
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
    console.log('sync start')
    this.Memo.sync()
    console.log('sync end')
  },
  addMemo () {
    console.log('add start')
    this.Memo.create({
      title: '복슬이',
      body: 'Sequelize.js is ORM for Node.js.',
      reg_date: new Date()
    })
    console.log('add end')
  }
}
