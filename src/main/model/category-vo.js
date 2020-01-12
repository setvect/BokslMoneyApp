import connSeque from './connSeque.js'
import oftenUsed from './oftenUsed-vo.js'
import transaction from './transaction-vo.js'

const { DataTypes, } = require('sequelize')

const categoryVo = connSeque.define(
  'category',
  {
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    kind: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: false,
    },
    parentSeq: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: false,
    },
    orderNo: {
      type: DataTypes.INTEGER,
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
    tableName: 'BB_CATEGORY',
    freezeTableName: true,
    underscored: true,
    timestamps: false,
  }
)
categoryVo.hasMany(oftenUsed, { foreignKey: 'category_seq', })
categoryVo.hasMany(transaction, { foreignKey: 'category_seq', })

export default categoryVo
