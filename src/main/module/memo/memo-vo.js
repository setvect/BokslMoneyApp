import connSeque from '../connSeque.js'
const { DataTypes } = require('sequelize')

const memoVo = connSeque.define(
  'Memo',
  {
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
  },
  {
    classMethods: {},
    tableName: 'Memo',
    freezeTableName: true,
    underscored: true,
    timestamps: false
  }
)

export default memoVo
