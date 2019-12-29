import connSeque from '../connSeque.js'

export default {
  Memo: null,
  async init (callback) {
    const {
      DataTypes
    } = require('sequelize')

    this.Memo = connSeque.define('Memo', {
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
    await this.Memo.sync().then(() => callback())
  },
  addMemo () {
    this.Memo.create({
      title: '복슬이',
      body: '12345',
      reg_date: new Date()
    })
  }
}
