import connSeque from "./connSeque.js";
import { DataTypes } from "sequelize";
import categoryVo from "./category-vo.js";

const oftenUsedVo = connSeque.define(
  "oftenUsed",
  {
    oftenUsedSeq: {
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
    title: {
      type: DataTypes.STRING(200),
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
    money: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    note: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    attribute: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    orderNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deleteF: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
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
oftenUsedVo.belongsTo(categoryVo, { foreignKey: "categorySeq", });

export default oftenUsedVo;
