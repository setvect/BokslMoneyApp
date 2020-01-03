import connSeque from './connSeque.js'
const { DataTypes, } = require('sequelize')

const userVo = connSeque.define(
  'user',
  {
    userId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    deleteF: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    classMethods: {},
    tableName: 'TBAA_USER',
    freezeTableName: true,
    underscored: true,
    timestamps: false,
  }
)

export default userVo
