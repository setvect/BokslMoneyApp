import connSeque from "./connSeque.js";
const { DataTypes } = require("sequelize");

const transactionVo = connSeque.define(
  "transaction",
  {
    transactionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    categorySeq: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: false,
    },
    kind: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: false,
    },
    payAccount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: false,
    },
    receiveAccount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: false,
    },
    attribute: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: false,
    },
    money: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: false,
    },
    transactionDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: false,
    },
    note: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: false,
    },
    fee: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: false,
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

export default transactionVo;
