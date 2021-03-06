import connSeque from "./connSeque.js";
import { DataTypes } from "sequelize";
import categoryVo from "./category-vo.js";

const transactionVo = connSeque.define(
  "transaction",
  {
    transactionSeq: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    categorySeq: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    kind: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    payAccount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    receiveAccount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    attribute: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    money: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    transactionDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    note: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    fee: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    classMethods: {},
    tableName: "BE_TRANSACTION",
    freezeTableName: true,
    underscored: true,
    timestamps: false,
  }
);
transactionVo.belongsTo(categoryVo, { foreignKey: "categorySeq", });

export default transactionVo;
