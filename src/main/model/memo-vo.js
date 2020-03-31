import connSeque from './connSeque.js'
const { DataTypes, } = require('sequelize')

const memoVo = connSeque.define(
  'memo',
  {
    memoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    note: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      defaultValue: false,
    },
    memoDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: false,
    },
    deleteF: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    classMethods: {},
    tableName: 'BD_MEMO',
    freezeTableName: true,
    underscored: true,
    timestamps: false,
  }
)

export default memoVo
