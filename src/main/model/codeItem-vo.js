import connSeque from "./connSeque.js";
const { DataTypes } = require("sequelize");

const codeItemVo = connSeque.define(
  "codeItem",
  {
    codeItemId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true,
    },
    codeItemSeq: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
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
    tableName: "CB_CODE_ITEM",
    freezeTableName: true,
    underscored: true,
    timestamps: false,
  }
);

export default codeItemVo;
