import connSeque from "./connSeque.js";

import { DataTypes } from "sequelize";

const oftenUsedVo = connSeque.define(
  "oftenUsed",
  {
    oftenUsedId: {
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
    title: {
      type: DataTypes.STRING(200),
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
    money: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: false,
    },
    note: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: false,
    },
    attribute: {
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
    tableName: "BC_OFTEN_USED",
    freezeTableName: true,
    underscored: true,
    timestamps: false,
  }
);

export default oftenUsedVo;
