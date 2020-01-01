import connSeque from '../connSeque.js'
const { DataTypes } = require('sequelize')

const userVo = connSeque.define(
  'user',
  {
    userId: {
      type: DataTypes.STRING(20),
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    deleteF: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  },
  {
    classMethods: {},
    tableName: 'TBAA_USER',
    freezeTableName: true,
    underscored: true,
    timestamps: false
  }
)

export default userVo
