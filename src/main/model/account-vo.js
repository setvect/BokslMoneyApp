import connSeque from "./connSeque.js";
import { DataTypes } from "sequelize";

const accountVo = connSeque.define(
  "account",
  {
    accountSeq: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    accountNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    kindCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    accountType: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    interestRate: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    term: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    expDate: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    monthlyPay: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    transferDate: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    note: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    stockF: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    enableF: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    deleteF: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    classMethods: {},
    tableName: "BA_ACCOUNT",
    freezeTableName: true,
    underscored: true,
    timestamps: false,
  }
);

export default accountVo;
